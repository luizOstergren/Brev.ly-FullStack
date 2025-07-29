⚡ Brev.ly — Encurtador de Links FullStack
Aplicação moderna para encurtamento e gerenciamento de URLs com interface intuitiva, validação, estatísticas, exportação via CSV e integração com CDN. Desenvolvido com tecnologias atuais tanto no frontend quanto no backend. 🚀

🖥️ Frontend
Interface reativa e responsiva com funcionalidades avançadas de interação e feedback ao usuário.
🧪 Tecnologias
- React + TypeScript
- TailwindCSS
- React Query
- React Hook Form + Zod
- React Hot Toast
- Context API (controle de loading global)
- Animações com @keyframes + Tailwind
💡 Funcionalidades
- ✅ Criação de link com slug personalizado e validação em tempo real
- 🔁 Atualização automática da listagem com invalidateQueries
- 📋 Copiar links com feedback instantâneo via toast
- 📦 Exportação de lista como CSV
- 🎬 Loading animado via contexto global
- 🎨 Layout responsivo e estilizado para inputs interativos
📥 Instalação
git clone https://github.com/seu-usuario/brev.ly-frontend.git


🔗 Certifique-se de que o backend está rodando na porta 3333


📦 Backend
API robusta para encurtamento de URLs com suporte a CSV, redirecionamentos e exportações para CDN. Documentado via Swagger e validado com Zod.
🚀 Tecnologias
- Node.js + TypeScript
- Fastify
- Drizzle ORM
- Zod
- Cloudflare R2 / Amazon S3
- Swagger (OpenAPI 3)
⚙️ Como rodar localmente
- Servidor disponível em: http://localhost:3333
- Documentação Swagger: http://localhost:3333/docs
📁 Estrutura de Rotas
| Método | Rota | Descrição | 
| POST | /links | Cria link encurtado manual | 
| DELETE | /uploads/:id | Remove link por ID | 
| GET | /:shortURL | Redireciona e incrementa contador | 
| GET | /links | Lista todas as URLs | 
| POST | /uploads | Upload de CSV + referência remota | 
| POST | /save-links | Salva links a partir de remoteKey | 
| GET | /csv-download | Exporta links como CSV para CDN | 
| GET | /check/:slug | Valida slug encurtado | 


📄 OpenAPI
Para gerar o schema atualizado:
pnpm run export:openapi


✅ Checklist funcional
- Criar, deletar e redirecionar links
- Incrementar estatísticas de acesso
- Upload e exportação via CSV
- Armazenamento remoto em Cloudflare R2 / S3
- Documentação Swagger
- Validação com Zod
- Segurança com tratamento de payloads multipart
- Redirecionamento com contagem atomizada
