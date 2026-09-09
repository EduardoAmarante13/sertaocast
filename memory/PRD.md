# SertãoCast — PRD

## Original Problem Statement
"Essa é minha logo, de podcast. com base nela, crie um site completo sobre o podcast e também um sistema de 'agendar' a sala para seu próprio podcast."

Logo: SertãoCast — cactus-microphone in neon green + cyan on black.

## Architecture
- Backend: FastAPI + MongoDB (motor). All routes under `/api`. JWT bearer auth for admin (localStorage).
- Frontend: React 19 + React Router 7 + TailwindCSS + shadcn/ui + sonner toasts + framer-motion + lucide-react.
- Auth: JWT (7-day expiry). Single admin seeded from `.env` on startup.

## User Personas
1. **Visitante/Ouvinte** — navega Home, ouve episódios, envia contato.
2. **Podcaster** — solicita reserva pública da cabine (aprovação automática).
3. **Admin (Eduardo)** — logado em `/admin`, gerencia episódios, agendamentos e mensagens.

## Core Requirements
- Home + Episódios (busca/filtro) + Sobre + Agendar Sala + Contato + Admin
- Agendamento com autoaprovação e prevenção de conflito de horário
- Painel admin com métricas, gestão de episódios, agendamentos e mensagens

## Implemented (Feb 2026)
- ✅ Todas as 6 rotas frontend + navbar responsiva + player bar simulado
- ✅ 6 episódios seed em 5 categorias (cultura/música/humor/entrevistas/negócios)
- ✅ Fluxo de agendamento completo (data → horário → equipamentos → dados → confirmação)
- ✅ Painel admin (stats, bookings, episodes CRUD, mensagens de contato)
- ✅ Autenticação JWT com admin seed (eduguenovsk2@gmail.com)
- ✅ Testado: 100% backend, 100% frontend (iteration_1)

## Backlog / Next
- P1: Upload de áudio real por episódio (via object storage)
- P1: Email de confirmação de reserva (Resend integration)
- P2: Player Spotify/YouTube embed nos episódios
- P2: Sistema de reviews/ratings dos episódios
- P2: Newsletter (captura de email na home)
