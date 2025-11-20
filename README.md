# Sistema de Gerenciamento de Trabalho Voluntário

Uma aplicação feita com React + Vite para gerenciar grupos voluntários, escalas e atividades.

Desenvolvida com TypeScript, Tailwind CSS e shadcn/ui.

- [Arquitetura Principal da Aplicação](./architecture.md)

## Integrantes

- Adriano Barros
- Brendon Gomes
- Elias Barbosa
- Rafael Gonçalves

## 🚀 Instalação

### 1. Configuração do Projeto

```bash
# Clonar e navegar para o diretório
npm create vite@latest volunteer-management -- --template react-ts
cd volunteer-management

# Instalar dependências principais
npm install

# Instalar dependências do projeto
npm install react-hook-form zod @hookform/resolvers
npm install @tanstack/react-query
npm install react-router-dom
npm install date-fns
npm install lucide-react
```

### 2. Configuração do shadcn/ui

```bash
# Inicializar shadcn/ui
npx shadcn@latest init

# Adicionar componentes necessários
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add badge
npx shadcn@latest add skeleton
npx shadcn@latest add tabs
npx shadcn@latest add toast
npx shadcn@latest add toaster
npx shadcn@latest add sonner
```

### 3. Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview
```

## 🔄 Migração para API/Banco de Dados

### 1. Trocar Adapter

No arquivo `src/providers/DataProvider.tsx`:

```typescript
// Substituir LocalStorageAdapter por ApiAdapter
import ApiAdapter from '../adapters/ApiAdapter';

const adapter = new ApiAdapter('http://localhost:3001/api', authToken);
```

### 2. Endpoints da API Necessários

```txt
GET    /api/dashboard/summary     # Estatísticas do dashboard
GET    /api/groups                # Listar grupos
POST   /api/groups                # Criar grupo
GET    /api/groups/:id            # Detalhes do grupo
PUT    /api/groups/:id            # Atualizar grupo
DELETE /api/groups/:id            # Deletar grupo

GET    /api/groups/:id/members    # Membros do grupo
POST   /api/groups/:id/join       # Entrar no grupo
POST   /api/groups/:id/leave      # Sair do grupo

GET    /api/groups/:id/positions  # Posições do grupo
POST   /api/positions             # Criar posição
PUT    /api/positions/:id         # Atualizar posição
DELETE /api/positions/:id         # Deletar posição

GET    /api/groups/:id/shifts     # Escalas do grupo
POST   /api/shifts               # Criar escala
GET    /api/shifts/:id           # Detalhes da escala
PUT    /api/shifts/:id           # Atualizar escala
DELETE /api/shifts/:id           # Deletar escala

POST   /api/shift-positions/:id/signup  # Inscrever-se
POST   /api/shift-volunteers/:id/cancel # Cancelar inscrição
GET    /api/my-signups                  # Minhas inscrições
```

### 3. Formato de Resposta da API

```json
{
  "success": true,
  "data": { ... },
  "message": "Mensagem opcional"
}
```

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de UI
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **React Query** - Gerenciamento de estado servidor
- **React Router** - Roteamento
- **Lucide React** - Ícones

## 📋 Funcionalidades

### ✅ Implementadas

- Dashboard com estatísticas
- CRUD de grupos
- CRUD de escalas/turnos
- Sistema de posições
- Inscrições em escalas
- Interface responsiva
- Validação de formulários
- Persistência em localStorage

### 🔄 Próximas Funcionalidades

- [ ] Sistema de autenticação
- [ ] Notificações
- [ ] Relatórios e estatísticas avançadas
- [ ] Sistema de permissões
- [ ] Exportação de dados
- [ ] Integração com calendário

## 🎨 Design System

O projeto utiliza um design system completo definido em `src/index.css` com:

- Cores semânticas (oklch)
- Tokens de design consistentes
- Suporte a modo escuro
- Gradientes e sombras
- Animações suaves

## 📄 Licença

Este projeto está licenciado sob a MIT License.
