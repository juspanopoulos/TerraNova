# TerraNova — Frontend

**Inteligência territorial para quem vive o campo.**

O frontend do TerraNova é a interface web do projeto: um site institucional e uma plataforma de gestão agrícola que reúne clima, água, solo e alertas da propriedade para apoiar decisões no campo, safra após safra.

---

## Links

| Recurso | URL |
|---------|-----|
| Repositório | [github.com/juspanopoulos/TerraNova](https://github.com/juspanopoulos/TerraNova) |
| Deploy (Vercel) | _A definir — adicionar URL após publicação_ |
| Vídeo de apresentação | _A definir — adicionar link posteriormente_ |

---

## Tecnologias utilizadas

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| [React](https://react.dev/) | 19.2 | Interface do usuário |
| [TypeScript](https://www.typescriptlang.org/) | 6.0 | Tipagem estática |
| [Vite](https://vitejs.dev/) | 8.0 | Build e servidor de desenvolvimento |
| [React Router DOM](https://reactrouter.com/) | 7.16 | Roteamento e navegação |
| [Tailwind CSS](https://tailwindcss.com/) | 4.3 | Estilização utilitária |
| [GSAP](https://gsap.com/) | 3.15 | Animações e transições |
| [Lenis](https://lenis.darkroom.engineering/) | 1.3 | Scroll suave no site institucional |
| [Lucide React](https://lucide.dev/) | 1.17 | Ícones da interface |
| [React Hook Form](https://react-hook-form.com/) | 7.77 | Formulários |
| [@react-pdf/renderer](https://react-pdf.org/) | 4.5 | Geração de relatórios em PDF |
| [@fontsource/inter](https://fontsource.org/fonts/inter) | 5.2 | Tipografia Inter |

---

## Estrutura de pastas

```
frontend/
├── public/                  # Arquivos estáticos servidos na raiz
├── src/
│   ├── assets/              # Imagens, logos, ícones, fontes e vídeos
│   │   ├── hero/            # Fundos do hero (home e sobre)
│   │   ├── icons/           # Favicon e ícones do projeto
│   │   ├── images/          # Imagens por seção (home, equipe, sobre, login, 404)
│   │   ├── logos/           # Logotipos (colorido e branco)
│   │   ├── fonts/           # Fontes locais (se houver)
│   │   └── videos/          # Vídeos do projeto
│   ├── components/          # Componentes reutilizáveis
│   │   ├── dashboard/       # Componentes da plataforma
│   │   ├── equipe/          # Componentes da página de equipe
│   │   ├── faq/             # Componentes do FAQ
│   │   ├── home/            # Componentes da home
│   │   └── ...              # Navbar, Footer, breadcrumbs, etc.
│   ├── constants/           # Rotas, tokens de layout e configurações
│   ├── context/             # Context API (Dashboard, Assistente)
│   ├── data/                # Conteúdo estático e mocks
│   ├── hooks/               # Hooks customizados (animações, dados)
│   ├── layouts/             # BaseLayout e DashboardLayout
│   ├── lib/                 # Utilitários (auth, PDF, scroll, dashboard)
│   ├── pages/               # Páginas por rota
│   │   └── plataforma/      # Páginas do dashboard
│   ├── routes/              # Configuração central de rotas (AppRoutes)
│   ├── services/            # Serviços de dados (ex.: equipe)
│   ├── styles/              # CSS global e módulos
│   ├── types/               # Tipos TypeScript de domínio
│   └── utils/               # Funções auxiliares
├── index.html
├── package.json
├── vercel.json              # Configuração de deploy na Vercel
└── vite.config.ts
```

---

## Como usar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm (incluído com o Node.js)

### Instalação

```bash
cd frontend
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

### Build de produção

```bash
npm run build
```

### Pré-visualização do build

```bash
npm run preview
```

### Outros scripts

```bash
npm run typecheck   # Verificação de tipos TypeScript
npm run lint        # Análise estática com ESLint
```

### Integração com backend

Guia para quem for conectar a API real (login, cadastro, dashboard e mocks atuais):

→ [`docs/BACKEND_INTEGRATION.md`](docs/BACKEND_INTEGRATION.md)

### Deploy na Vercel

O projeto já inclui `vercel.json` com suporte a SPA (rewrite para `index.html`). Basta conectar o repositório na Vercel com o diretório raiz apontando para `frontend/`.

---

## Imagens e ícones

### Logotipos e identidade visual

| Arquivo | Caminho | Uso |
|---------|---------|-----|
| Logo colorido | `src/assets/logos/logo-colorido.png` | Navbar, sidebar, login |
| Logo branco | `src/assets/logos/logo-branco.png` | Fundos escuros |
| Favicon | `src/assets/icons/favicon.ico` | Aba do navegador |

### Imagens por seção

| Seção | Pasta | Exemplos |
|-------|-------|----------|
| Home | `src/assets/images/home/` | germinação, trigo, irrigação, alertas ambientais |
| Sobre | `src/assets/images/sobre/` | broto, decisão com calma, ver o que importa |
| Equipe | `src/assets/images/equipe/` | Fotos dos integrantes |
| Login | `src/assets/images/login/` | Fundo da tela de autenticação |
| 404 | `src/assets/images/not-found/` | Ilustrações desktop e mobile |
| Hero | `src/assets/hero/` | Fundos parallax (farm, backgrounds) |

### Ícones da interface

Os ícones utilizados na interface vêm da biblioteca **[Lucide React](https://lucide.dev/)** (navegação, dashboard, FAQ, contato, clima, alertas, etc.). Ícones customizados de redes sociais (LinkedIn, GitHub) estão em `src/components/equipe/TeamSocialLinks.tsx`.

---

## Rotas, navegação e tipagem

### Definição de rotas

O roteamento utiliza **React Router DOM v7** com URLs centralizadas em `src/constants/routes.ts` e `src/constants/dashboard.ts`, declaradas com `as const` para inferência literal de tipos.

**Site institucional:**

| Rota | Página |
|------|--------|
| `/` | Início |
| `/sobre` | Sobre |
| `/equipe` | Equipe |
| `/faq` | FAQ |
| `/contato` | Contato |
| `/mapa-do-site` | Mapa do site |

**Plataforma (dashboard):**

| Rota | Página |
|------|--------|
| `/plataforma` | Redireciona para visão geral |
| `/plataforma/visao-geral` | Hub de visões |
| `/plataforma/visao/dia` | Visão do dia |
| `/plataforma/visao/semana` | Visão semanal |
| `/plataforma/visao/mes` | Visão do mês |
| `/plataforma/visao/anual` | Visão anual |
| `/plataforma/alertas` | Alertas |
| `/plataforma/clima` | Controle climático |
| `/plataforma/solo` | Controle do solo |
| `/plataforma/colheitas` | Previsão de colheitas |
| `/plataforma/agua` | Consumo hídrico |
| `/plataforma/assistente` | Assistente TerraNova |
| `/plataforma/anotacoes` | Anotações |
| `/plataforma/configuracoes/geral` | Configurações gerais |
| `/plataforma/configuracoes/empresa` | Dados da empresa |
| `/plataforma/configuracoes/integracoes` | Integrações |

A configuração central está em `src/routes/AppRoutes.tsx`. Rotas da plataforma são aninhadas com `DashboardLayout` como layout pai e `<Outlet />` para renderizar as páginas filhas.

### Navegação

| Componente | Escopo | Mecanismo |
|------------|--------|-----------|
| `Navbar` / `HomeNavbar` | Site institucional | `NavLink` com estado ativo |
| `Sidebar` | Plataforma | `NavLink` + `VIEW_ROUTE_BY_ID` |
| `SettingsNavGroup` | Plataforma | Submenu expansível de Configurações |
| `PageBreadcrumb` | Site | Trilha de navegação |
| `DashboardBreadcrumb` | Plataforma | Gerado por `breadcrumbsFromPath()` |

Comportamentos de UX: `ScrollToTop` (rolagem ao topo a cada mudança de rota), `SiteSmoothScroll` (scroll suave com Lenis nas páginas institucionais), `BaseLayout` (oculta Navbar/Footer na home, plataforma e 404).

### Parâmetros de rota dinâmica

O projeto não utiliza parâmetros no formato `:id` com `useParams`. Em vez disso, adota **segmentos de URL estáticos e aninhados**, interpretados por funções tipadas em `src/constants/dashboard.ts`:

| Função | Retorno | Uso |
|--------|---------|-----|
| `TIME_FILTER_FROM_PATH(pathname)` | `TimeFilter \| null` | Filtro temporal da visão |
| `pathToSettingsTab(pathname)` | `SettingsTabId \| null` | Aba ativa de configurações |
| `pathToViewId(pathname)` | `ViewId` | View ativa do dashboard |
| `pageTitleFromPath(pathname)` | `string` | Título da página atual |
| `breadcrumbsFromPath(pathname)` | `BreadcrumbItem[]` | Trilha de navegação |

Mapeamentos bidirecionais: `VISION_ROUTE_BY_FILTER`, `SETTINGS_ROUTE_BY_TAB`, `VIEW_ROUTE_BY_ID`.

### Redirecionamento

| Origem | Destino | Comportamento |
|--------|---------|---------------|
| `/plataforma` | `/plataforma/visao-geral` | Rota index da plataforma |
| `/plataforma/configuracoes` | `/plataforma/configuracoes/geral` | Aba padrão |
| `/platform` | `/plataforma` | Alias em inglês |
| `*` (rota desconhecida) | `NotFound` | Página 404 personalizada |

A página 404 (`NotFound.tsx`) exibe mensagem contextual ("Você saiu do trilho!") com opções de voltar ou ir ao início. A plataforma oferece feedbacks de carregamento e erro via `DashboardLoadingState` e `DashboardErrorState`.

### Tipos de dados

Tipos básicos (`string`, `number`, `boolean`, objetos) aplicados em domínios de negócio em `src/types/`:

```typescript
export type CompanyProfile = {
  legalName: string;
  tradeName: string;
  totalAreaHa: number;
  activeSectors: number;
  // ...
};

export type GeneralPreferences = {
  darkMode: boolean;
  reducedMotion: boolean;
  emailNotifications: boolean;
};
```

### Tipos avançados

**Union Types:**

```typescript
export type AuthMode = "login" | "register" | "registerCompany";
export type ViewId = "overview" | "alerts" | "climate" | "soil" | "growth" | "water" | "assistant" | "notes" | "settings";
export type TimeFilter = "daily" | "weekly" | "monthly" | "yearly";
export type AlertLevel = "critical" | "warning" | "normal";
export type DashboardLoadStatus = "idle" | "loading" | "success" | "error";
```

**Intersection Types:**

```typescript
export type TeamMember = TeamMemberData & {
  photo: string;
};
```

**Tipos utilitários:** `Record<K, V>`, `Partial<T>`, `keyof T`, `Pick<T, K>` e generics (ex.: `updatePreference<K extends keyof GeneralPreferences>`).

### Tipagem personalizada de objetos

O projeto utiliza `type` aliases para contratos estruturais, organizados em:

```
src/types/
├── dashboard.ts   # Tipos do dashboard e plataforma
└── equipe.ts      # Tipos da página de equipe
```

Principais tipos: `CompanyProfile`, `GeneralPreferences`, `TeamMemberData`, `BreadcrumbItem`, `NavItem`, `ChartSegment`, `DashboardLoadError`, `RegisterCredentials`, `SitemapSection`.

---

## Autores e créditos

### Equipe TerraNova

| Nome | RM | Papel |
|------|----|-------|
| Julia Silva Spanopoulos | 566754 | Product Owner e Desenvolvedora Java |
| Julia Valerio Guimarães da Silva | 568275 | Desenvolvedora Front-End |
| Igor Dantas da Silva | 568337 | Desenvolvedor de Inteligência Artificial |
| Guilherme Santos Sena | 568101 | Desenvolvedor de Banco de Dados |
| Guilherme Anitelli Cardoso | 566744 | Desenvolvedor Python |

### Créditos de bibliotecas e recursos

- **[Lucide](https://lucide.dev/)** — ícones da interface
- **[GSAP](https://gsap.com/)** — animações
- **[Lenis](https://lenis.darkroom.engineering/)** — scroll suave
- **[Inter](https://rsms.me/inter/)** via [@fontsource/inter](https://fontsource.org/fonts/inter) — tipografia
- **[React PDF](https://react-pdf.org/)** — geração de relatórios

Imagens e logotipos do projeto são assets próprios em `src/assets/`.

---

## Contato

| Canal | Informação |
|-------|------------|
| E-mail | [contato@terranova.com.br](mailto:contato@terranova.com.br) |
| Telefone | (11) 9999-9999 |
| WhatsApp | [(11) 99999-9999](https://wa.me/5511999999999) |
| Endereço | Av. Paulista, 1100, São Paulo — SP |

---

## Licença

Projeto acadêmico desenvolvido pela equipe TerraNova. Consulte o repositório principal para informações de licenciamento.
