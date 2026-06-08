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
├── docs/                    # Documentação técnica (ex.: integração backend)
├── public/                  # Arquivos estáticos servidos na raiz
│   └── logos/               # Logo público (PDF e URLs absolutas)
├── src/
│   ├── assets/              # Imagens, logos, ícones, fontes e vídeos
│   │   ├── hero/            # Fundos parallax (home e sobre)
│   │   ├── icons/           # Favicon e ícones do projeto
│   │   ├── images/          # Imagens por seção (home, equipe, sobre, login, 404)
│   │   ├── logos/           # Logotipos (colorido e branco) — bundle da UI
│   │   ├── fonts/           # Fontes locais (se houver)
│   │   └── videos/          # Vídeos do projeto
│   ├── components/          # Componentes reutilizáveis
│   │   ├── contato/         # Formulário e seção de contato
│   │   ├── dashboard/       # Componentes da plataforma (views, sidebar, auth)
│   │   ├── equipe/          # Listagem e cards da equipe
│   │   ├── faq/             # Acordeão e explorador do FAQ
│   │   ├── home/            # Seções da página inicial
│   │   ├── mapa-do-site/    # Mapa do site
│   │   ├── sobre/           # Seções da página Sobre
│   │   ├── HeroParallax/    # Hero animado da home
│   │   └── ...              # Navbar, HomeNavbar, Footer, PageHero, breadcrumbs
│   ├── constants/           # Rotas, layout do dashboard e tokens de UI
│   │   └── tokens/          # Classes Tailwind reutilizáveis por página
│   ├── context/             # Context API (Dashboard, Assistente)
│   ├── data/                # Conteúdo estático (.ts) e JSON da equipe
│   │   ├── equipe/
│   │   │   ├── team.json    # Manifesto com IDs dos membros
│   │   │   └── members/     # Um JSON por integrante
│   │   ├── home/            # Textos e módulos da home
│   │   └── sobre/           # Textos e módulos da página Sobre
│   ├── hooks/               # Hooks customizados (animações, equipe)
│   ├── layouts/             # BaseLayout e DashboardLayout
│   ├── lib/                 # Auth, PDF, scroll, helpers do dashboard
│   ├── pages/               # Wrappers finos por rota
│   │   └── plataforma/      # Páginas do dashboard (delegam para views)
│   ├── routes/              # Configuração central de rotas (AppRoutes)
│   ├── services/            # Carregamento assíncrono de dados (equipe)
│   ├── styles/              # CSS global e módulos
│   ├── types/               # Tipos TypeScript de domínio
│   └── utils/               # Funções auxiliares (DOM, format, assets)
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
| Logo colorido (UI) | `src/assets/logos/logo-colorido.png` | Navbar, sidebar, login, componentes |
| Logo colorido (público) | `public/logos/logo-colorido.png` | PDF e URLs absolutas (`/logos/...`) |
| Logo branco | `src/assets/logos/logo-branco.png` | Fundos escuros |
| Favicon | `src/assets/icons/favicon.ico` | Aba do navegador |

### Imagens por seção

| Seção | Pasta | Arquivos em uso |
|-------|-------|-----------------|
| Home | `src/assets/images/home/` | `germinacao.jpg`, `desenvolvimento.jpg`, `trigo.jpg`, `nuvens.jpg`, `irrigacao.jpeg`, `chuva-fazenda.jpg` |
| Sobre | `src/assets/images/sobre/` | `broto.png`, `como-funciona.png`, `decidir-com-calma.png`, `no-seu-tempo.png`, `ver-o-que-importa.png` |
| Equipe | `src/assets/images/equipe/` | Fotos nomeadas pelo `id` de cada membro (`.jpg` ou `.png`) |
| Login | `src/assets/images/login/` | `background6.jpeg` |
| 404 | `src/assets/images/not-found/` | `404.png`, `404-mobile.png` |
| Hero | `src/assets/hero/` | `farm.jpeg`, `background2.png` … `background5.png` |

### Ícones da interface

Os ícones utilizados na interface vêm da biblioteca **[Lucide React](https://lucide.dev/)** (navegação, dashboard, FAQ, contato, clima, alertas, etc.). Ícones customizados de redes sociais (LinkedIn, GitHub) estão em `src/components/equipe/TeamSocialLinks.tsx`.

---

## Dados estáticos e JSON da equipe

O conteúdo institucional e os mocks do dashboard ficam em arquivos **TypeScript** em `src/data/` (`faq.ts`, `contato.ts`, `mockDashboard.ts`, `home/content.ts`, `sobre/platform.ts`, etc.) e são importados estaticamente pelos componentes.

A página **Equipe** é a única que usa **JSON**. O carregamento é **assíncrono** via `src/services/equipeService.ts` (nunca import estático de `.json` nos componentes):

| Arquivo | Função |
|---------|--------|
| `data/equipe/team.json` | Lista de `memberIds` (manifesto) |
| `data/equipe/members/*.json` | Dados de cada integrante (`id`, `name`, `rm`, `turma`, `role`, `bio`, `social`) |
| `assets/images/equipe/{id}.*` | Foto resolvida pelo mesmo `id` |

Fluxo: `useTeamMembers` → `loadTeamMembers()` → `await import("team.json")` + `import.meta.glob` para membros e fotos.

Para adicionar um integrante: crie `members/{id}.json`, inclua o `id` em `team.json` e adicione a foto em `assets/images/equipe/`.

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
