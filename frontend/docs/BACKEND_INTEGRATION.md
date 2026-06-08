# Integração com backend — guia para desenvolvedores

Este documento descreve **como o frontend TerraNova funciona hoje** (dados mockados) e **onde conectar a API real**. O foco é login/cadastro e dashboard da plataforma (`/plataforma`).

O backend previsto é uma **API Java** (REST) persistindo dados em **Oracle Database**, com integração a **APIs externas** (clima, etc.) no servidor — o frontend **não** chama essas APIs de terceiros diretamente.

---

## 1. Arquitetura prevista do backend

```
┌─────────────────┐         HTTPS/JSON          ┌──────────────────────┐
│  Frontend       │  ◄──────────────────────►  │  API Java (REST)     │
│  React + Vite   │   VITE_API_BASE_URL        │  Spring Boot, etc.   │
└─────────────────┘                             └──────────┬───────────┘
                                                             │
                                    ┌────────────────────────┼────────────────────────┐
                                    │                        │                        │
                                    ▼                        ▼                        ▼
                           ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
                           │ Oracle DB    │        │ API clima    │        │ Outras APIs  │
                           │ usuários,    │        │ (OpenWeather,│        │ ( sensores,   │
                           │ propriedade, │        │ INMET, etc.) │        │  IA, etc.)   │
                           │ alertas,     │        └──────────────┘        └──────────────┘
                           │ anotações…   │
                           └──────────────┘
```

### Responsabilidades por camada

| Camada | Responsabilidade |
|--------|------------------|
| **Frontend (este repo)** | UI, validação de formulário, token em memória/localStorage, consumo da API Java |
| **API Java** | Autenticação, regras de negócio, ORM/JDBC com Oracle, agregação de dados, cache de APIs externas |
| **Oracle** | Persistência: usuários, empresas/fazendas, alertas, anotações, históricos, configurações |
| **APIs externas** | Dados em tempo real ou previsão (clima, etc.) — **somente o backend Java acessa** |

### Implicações para quem integra o frontend

1. **Uma única base URL** — o React fala só com a API Java (`VITE_API_BASE_URL`). Chaves de API de clima ficam no servidor, nunca no Vite.
2. **Contratos REST estáveis** — o Java expõe JSON já no formato (ou próximo) de `mockDashboard.ts` e `CompanyProfile`; o frontend mapeia se necessário.
3. **Dados de clima** — hoje mockados em `MOCK_DASHBOARD_DATA.climate`. No backend, um serviço Java consulta a API meteorológica, normaliza e grava/consulta Oracle; o frontend recebe via `GET /api/dashboard/climate` (ou dentro do summary).
4. **Autenticação** — JWT ou sessão emitida pela API Java; credenciais e hash de senha ficam no Oracle.
5. **CORS** — configurar na API Java para o origin do frontend (ex.: `http://localhost:5173` em dev).

### Onde fica o código Java / Oracle

Fora deste repositório (`frontend/`). Este guia assume que a equipe Java documentará endpoints (Swagger/OpenAPI) em paralelo. Alinhar nomes de campos com `src/types/dashboard.ts` e `src/data/mockDashboard.ts`.

---

## 2. Estado atual (importante)

Hoje **não há chamadas HTTP reais** para autenticação nem para a maioria dos dados do dashboard.

| Área | Comportamento atual |
|------|---------------------|
| Login | Qualquer e-mail/senha válidos no formulário entram no dashboard |
| Cadastro | Dados ficam só em memória (`DashboardContext`); nada é persistido no servidor |
| Sessão | Flag booleana em `localStorage` (`terranova-auth-session`) |
| Clima / solo / água (resumo) | Mock em `fetchDashboardData()` |
| Alertas, colheitas, gráficos históricos | Importam `MOCK_DASHBOARD_DATA` direto nas views |
| Empresa | Estado React + default mock; salvar em Configurações não chama API |
| Anotações | `localStorage` (`notesStorage.ts`) |
| Assistente IA | Respostas simuladas (`mockAssistantReply` em `assistantChat.ts`) |
| Contato (site) | Formulário validado com React Hook Form; submit ainda não envia e-mail/API |

Os formulários de **login**, **cadastro (passo 1)** e **dados da propriedade (passo 2)** já usam **React Hook Form**, o que facilita tratar erros do servidor com `setError`.

---

## 3. Arquivos que você vai editar com mais frequência

```
frontend/src/
├── context/DashboardContext.tsx       # Orquestra auth, company e reload do dashboard
├── lib/dashboard/
│   ├── authSession.ts                 # Persistência local da sessão (trocar por token JWT)
│   ├── loadDashboardData.ts           # Ponto principal de fetch dos indicadores
│   └── authValidation.ts              # Validação client-side (manter + complementar com API)
├── components/dashboard/
│   ├── LoginScreen.tsx                # Form login + cadastro passo 1 (RHF)
│   └── RegisterCompanyScreen.tsx      # Cadastro passo 2 — empresa/fazenda (RHF)
├── types/dashboard.ts                 # Tipos CompanyProfile, RegisterCredentials, erros
└── data/mockDashboard.ts              # Contrato de referência dos dados mockados
```

Sugestão: criar uma camada `src/lib/api/` (ex.: `client.ts`, `auth.ts`, `dashboard.ts`) em vez de espalhar `fetch` nos componentes.

Variável de ambiente recomendada:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Acessível no código via `import.meta.env.VITE_API_BASE_URL`.

---

## 4. Autenticação e cadastro

### 4.1 Fluxo na interface

```
/plataforma (não autenticado)
│
├─ LoginScreen [mode=login]
│     email + senha → onLogin()
│
├─ LoginScreen [mode=register]  (passo 1)
│     nome + email + senha → submitRegisterStep1()
│
└─ RegisterCompanyScreen        (passo 2)
      CompanyProfile completo → completeRegistration()
```

Tudo isso é controlado por `DashboardLayout` → `DashboardProvider` (`DashboardContext.tsx`).

### 4.2 Tipos envolvidos

Definidos em `src/types/dashboard.ts`:

**Login / cadastro passo 1** (`RegisterCredentials`):

```ts
{
  fullName: string;  // só no cadastro
  email: string;
  password: string;
}
```

**Cadastro passo 2 / perfil da empresa** (`CompanyProfile`):

```ts
{
  legalName: string;
  tradeName: string;
  cnpj: string;
  cpf: string;
  email: string;
  phone: string;
  mobile: string;
  street: string;
  streetNumber: string;
  neighborhood: string;
  city: string;
  state: string;        // UF, ex.: "MG"
  zipCode: string;
  farmName: string;
  farmRegion: string;
  totalAreaHa: number;
  activeSectors: number;
  responsibleName: string;
}
```

Lista de campos e ordem do formulário: `src/lib/dashboard/companyFields.ts` → `COMPANY_FIELDS`.

### 4.3 Validação no cliente

Em `src/lib/dashboard/authValidation.ts`:

- Login: e-mail obrigatório + formato; senha obrigatória
- Cadastro passo 1: nome + e-mail + senha forte (8+ chars, maiúscula, minúscula, número, especial)
- Cadastro passo 2: `validateCompanyProfile()` — CNPJ, CPF, CEP, celular, área > 0, etc.

A validação client-side **deve permanecer**; a API deve validar de novo no servidor.

### 4.4 Onde plugar a API (auth)

#### Login — hoje

`LoginScreen` chama `onLogin()` **sem enviar credenciais** para lugar nenhum.

`DashboardContext.login()` apenas faz:

```ts
saveAuthSession();      // localStorage boolean
setIsAuthenticated(true);
```

#### Login — integração sugerida

1. Criar `loginWithCredentials(email, password)` em `src/lib/api/auth.ts`
2. Alterar `LoginScreen` para passar `data` ao callback **ou** mover a chamada para dentro do context
3. Em `DashboardContext`, algo como:

```ts
const login = async (credentials: { email: string; password: string }) => {
  const { accessToken, refreshToken, user } = await apiLogin(credentials);
  saveAuthSession({ accessToken, refreshToken, userId: user.id });
  setIsAuthenticated(true);
};
```

4. Em caso de erro 401/422, usar `setError` do React Hook Form no `LoginScreen`:

```ts
setError("email", { message: "E-mail ou senha incorretos." });
// ou setError("root", { message: "..." }) para erro genérico
```

`LoginScreen` precisará receber `setError` via ref/context ou a lógica de submit ir para o context retornando erros.

#### Cadastro — hoje

- Passo 1: guarda credenciais em `registerCredentials` (state) e vai para passo 2
- Passo 2: `completeRegistration(draft)` monta `company` localmente, salva sessão mock e autentica

#### Cadastro — integração sugerida

**Opção A — um único endpoint no passo 2:**

```http
POST /api/auth/register
Body: RegisterCredentials + CompanyProfile
Response: 201 + tokens + user/company
```

**Opção B — dois passos no backend:**

```http
POST /api/auth/register/step-1   → cria usuário pendente, retorna registrationToken
POST /api/auth/register/step-2   → registrationToken + CompanyProfile → ativa conta
```

Alterar `completeRegistration` em `DashboardContext.tsx` para chamar a API antes de `setIsAuthenticated(true)`.

#### Logout

`logout()` em `DashboardContext.tsx` chama `clearAuthSession()`. Adicionar:

```ts
await apiLogout(); // invalidar refresh token no servidor, se aplicável
clearAuthSession();
```

### 4.5 Sessão / token

Arquivo: `src/lib/dashboard/authSession.ts`

Hoje:

```ts
localStorage["terranova-auth-session"] = { authenticated: true, savedAt: number }
```

Substituir por algo como:

```ts
{
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  userId: string;
}
```

Criar helper `getAccessToken()` usado por um `apiClient` que injeta:

```http
Authorization: Bearer <token>
```

Tratar `401` globalmente: limpar sessão, redirecionar para login, exibir mensagem `unauthorized` (já existe em `DashboardLoadFailure`).

---

## 5. Dashboard — carregamento de dados

### 5.1 Fluxo atual

Quando `isAuthenticated === true`:

1. `DashboardContext` chama `reloadDashboard()`
2. `fetchDashboardData()` em `loadDashboardData.ts` espera 900 ms e devolve cópia de mock
3. Atualiza no context: `climate`, `soil`, `water` (apenas **valores atuais**)
4. A cada 8 s há um **simulador local** que altera levemente temperatura/umidade/consumo (remover quando houver dados reais ao vivo)

Além disso, ao **trocar de rota** dentro de `/plataforma/*`, `reloadDashboard()` é chamado de novo.

### 5.2 Payload já tipado

`DashboardPayload` em `loadDashboardData.ts`:

```ts
{
  climate: { temperature: number; humidity: number; wind: number };
  soil: {
    nitrogen: number; phosphorus: number; potassium: number;
    moisture: number; ph: number;
  };
  water: {
    consumptionLiters: number; savingsLiters: number; efficiency: number;
  };
}
```

Integração mínima: fazer `fetchDashboardData()` chamar um endpoint Java, por exemplo:

```http
GET /api/dashboard/summary
Authorization: Bearer <token>
```

A API Java agrega leituras do Oracle (sensores, cadastros) e, quando aplicável, dados já sincronizados de APIs externas.

### 5.3 Clima e APIs externas (via backend Java)

No frontend, o módulo **Clima** (`/plataforma/clima`) e os indicadores de temperatura/umidade/vento esperam estruturas como em `mockDashboard.ts`:

- **Atual:** `climate.current` → `{ temperature, humidity, wind }`
- **Histórico:** `climate.history` → séries por `daily` | `weekly` | `monthly` | `yearly`

**Fluxo recomendado no backend:**

1. Job ou request da API Java consulta provedor externo (ex.: previsão do tempo, estações).
2. Java normaliza unidades (°C, %, km/h) e persiste snapshot + histórico no **Oracle** (evita bater na API externa a cada page view).
3. Frontend chama apenas endpoints Java, ex.:

```http
GET /api/dashboard/climate?period=weekly
GET /api/dashboard/climate/current
```

**Não expor** no frontend: API keys, URLs de terceiros, nem lógica de fallback entre provedores — isso fica no serviço Java.

Se a API externa estiver indisponível, o Java pode retornar último valor cacheado do Oracle ou erro `503`/`server` (mapeado para `DashboardLoadFailure` no React).

### 5.4 Dados ainda mockados nas views (segunda fase)

Várias telas **não** usam o context — leem `MOCK_DASHBOARD_DATA` direto:

| Módulo | Arquivo | Dados mockados |
|--------|---------|----------------|
| Alertas | `views/AlertsView.tsx` | `alerts[]`, `property.name` |
| Solo | `views/SoilView.tsx` | `soil.nutrients`, `soil.sectors` |
| Água | `views/WaterView.tsx` | `water.distribution`, `water.irrigationBySector`, histórico via `helpers.ts` |
| Colheitas | `views/GrowthView.tsx` | `crops[]` |
| Visão geral | `views/OverviewWelcomeCard.tsx` | alertas + crops |
| Visões PDF | `lib/dashboard/visionDetail.ts` | agrega vários mocks |
| Gráficos clima/água | `lib/dashboard/helpers.ts` | `climate.history`, `water.history` por `TimeFilter` |

Referência completa da estrutura mock: `src/data/mockDashboard.ts`.

**Estratégia recomendada:**

1. Expandir `DashboardPayload` (ou criar endpoints por módulo)
2. Guardar no `DashboardContext` ou usar React Query/SWR por view
3. Substituir imports de `MOCK_DASHBOARD_DATA` gradualmente

### 5.5 Filtros e recorte de tempo

- Filtros de página: `FilterSlideover` → `PageFilters` no context (só client-side hoje)
- Período (dia/semana/mês/anual): `pageTimeFilter` + query na URL em algumas rotas

Quando integrar, enviar filtros como query params:

```http
GET /api/dashboard/climate?period=weekly&sector=Talhão+A
```

### 5.6 Tratamento de erros

`fetchDashboardData` lança `DashboardLoadFailure` com `kind`:

| kind | Quando usar |
|------|-------------|
| `network` | Falha de rede / offline |
| `server` | 5xx |
| `timeout` | Timeout / AbortController |
| `unauthorized` | 401 — sessão expirada |

Mapear status HTTP → `kind` no client. A UI já exibe `DashboardErrorState` com retry e botão de logout em `unauthorized`.

**Debug:** `sessionStorage.setItem("dashboard-force-error", "network")` força erro na mock (remover em produção).

---

## 6. Empresa / configurações

- Cadastro passo 2 e **Configurações → Empresa** usam o mesmo shape `CompanyProfile`
- `EmpresaView.tsx` chama `updateCompany(draft)` — só atualiza state local
- Default inicial: `DEFAULT_COMPANY_PROFILE` em `src/data/mockCompany.ts`

Dados persistidos no **Oracle** (tabelas de empresa/propriedade vinculadas ao usuário autenticado).

Integração:

```http
GET  /api/company/me          → popular company ao autenticar
PUT  /api/company/me          → salvar edição em EmpresaView
POST /api/company/me          → criar no cadastro (se separado do register)
```

Após login bem-sucedido, buscar perfil da empresa e fazer `setCompany(profile)`.

---

## 7. Outros módulos (fora do escopo mínimo, mas previstos)

| Módulo | Arquivo | Persistência atual |
|--------|---------|-------------------|
| Anotações | `lib/dashboard/notesStorage.ts` | localStorage |
| Assistente | `lib/dashboard/assistantChat.ts` | localStorage + mock reply |
| Preferências | `lib/dashboard/preferences.ts` | localStorage (tema, motion, e-mail) |
| Contato (site) | `components/contato/ContactForm.tsx` | submit local (sem API) |
| Integrações | `views/IntegracoesView.tsx` | UI estática |

---

## 8. Rotas da plataforma

Definidas em `src/constants/dashboard.ts` (`DASHBOARD_PATHS`) e `src/routes/AppRoutes.tsx`.

Todas ficam sob `/plataforma/*` dentro de `DashboardLayout`. Requerem autenticação no frontend (`isAuthenticated`); o backend deve proteger os endpoints correspondentes.

---

## 9. Ordem sugerida de implementação

### Backend Java + Oracle (equipe server)

1. Modelagem Oracle (usuários, empresa, propriedade, alertas, leituras de sensores)
2. API REST base + CORS + Swagger/OpenAPI
3. Auth (login, register, JWT) persistindo no Oracle
4. CRUD empresa/propriedade
5. Serviço de clima: integração com API externa + cache/persistência no Oracle
6. Endpoints de dashboard (summary, alertas, solo, água, colheitas, históricos)
7. Anotações, assistente, contato, integrações

### Frontend (este repo — consumindo a API Java)

1. **Cliente HTTP** (`apiClient` + `VITE_API_BASE_URL` + header Authorization)
2. **Auth session** (tokens no lugar do boolean em `authSession.ts`)
3. **POST login / register** → wiring em `DashboardContext` / formulários RHF
4. **GET dashboard summary** → `fetchDashboardData.ts`
5. **GET/PATCH company** → login + `EmpresaView`
6. Substituir `MOCK_DASHBOARD_DATA` nas views, módulo a módulo
7. Anotações, assistente, contato (endpoints Java correspondentes)

---

## 10. Checklist rápido antes de abrir PR de integração

- [ ] Login falha com credenciais inválidas (mensagem no formulário)
- [ ] Cadastro completo persiste usuário + empresa no backend
- [ ] Token enviado em todas as requisições autenticadas
- [ ] 401 limpa sessão e volta ao login
- [ ] `reloadDashboard` usa API real (simulador de 8 s removido ou substituído por websocket/polling)
- [ ] Perfil da empresa carregado após login
- [ ] Tipos TypeScript alinhados entre API e `types/dashboard.ts`
- [ ] CORS na API Java e `VITE_API_BASE_URL` documentados (dev + produção)
- [ ] Chaves de APIs externas (clima) **somente no backend**, nunca no `.env` do Vite
- [ ] Dados de clima retornam unidades compatíveis com o frontend (°C, %, km/h)

---

## 11. Dúvidas sobre o frontend

- Formulários auth: React Hook Form + validadores em `authValidation.ts`
- Estado global do dashboard: `useDashboard()` / `DashboardContext`
- Mocks de referência: `mockDashboard.ts`, `mockCompany.ts`

Se a API Java tiver OpenAPI/Swagger, vale gerar tipos TypeScript e alinhar com os tipos existentes antes de substituir os mocks.

**Stack backend (fora deste repo):** API Java REST → Oracle Database + integrações server-side com APIs externas (clima e outras).
