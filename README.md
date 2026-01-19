Deploy de API Node.js com Docker Swarm

Este guia mostra do zero como:

organizar um projeto Node.js

versionar com Git

proteger dados sensíveis

subir para o GitHub

preparar para deploy com Docker Swarm

📌 PASSO 0 — PRÉ-REQUISITOS

Antes de começar, você precisa ter:

Git instalado

Node.js ≥ 20

Docker + Docker Swarm

Conta no GitHub

Conta no Docker Hub

	node -v
	git --version
	docker --version
	docker info | grep Swarm


📁 PASSO 1 — ESTRUTURA DO PROJETO

api-node/
├── prisma/
│   └── schema.prisma
├── routes/
│   └── products.js
├── src/
│   └── server.js
├── .env
├── .gitignore
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md

🧠 PASSO 2 — CÓDIGO DA API (EXEMPLO)

import express from "express";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// rota raiz
app.get("/", (req, res) => {
  res.json({ status: "API rodando com sucesso 🚀" });
});

// healthcheck
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// rotas de negócio
app.use("/products", productsRouter);

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
🔐 PASSO 3 — VARIÁVEIS DE AMBIENTE

PORT=3000
DATABASE_URL="file:./db/data.sqlite"

🚫 PASSO 4 — CRIAR .gitignore (DADOS SENSÍVEIS)

####################################
# Node.js
####################################

node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

####################################
# Environment variables (sensíveis)
####################################

.env
.env.*
!.env.example

####################################
# Prisma
####################################

# Cliente gerado automaticamente
/src/generated/prisma

# Migrations locais (opcional versionar)
prisma/migrations

####################################
# Banco de dados (SQLite)
####################################

db/*.sqlite
db/*.sqlite-journal
db/*.db

####################################
# Build / Cache
####################################

dist
build
.cache

####################################
# Sistema Operacional
####################################

.DS_Store
Thumbs.db

####################################
# IDE / Editor
####################################

.vscode
.idea
*.swp
*.swo


🐳 PASSO 5 — DOCKERFILE

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]

🧪 PASSO 6 — TESTAR LOCALMENTE

npm install
npm run dev
Teste
curl http://localhost:3000/health

🧬 PASSO 7 — BUILD DA IMAGEM DOCKER

docker build -t api-node:latest .
Teste
docker run -p 3000:3000 api-node:latest

🌐 PASSO 8 — CRIAR REPOSITÓRIO NO GITHUB

1.Acesse https://github.com

2.Clique em New repository

3.Nome: api-node

Público ou privado

NÃO marque “Add README” 

📤 PASSO 9 — SUBIR PROJETO PARA O GITHUB

Na pasta do projeto:

git init
git add .
git commit -m "Initial commit - API Node.js"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/api-node.git
git push -u origin main

✔️ Agora seu código está no GitHub
✔️ .env não foi enviado

🔑 PASSO 11 — LOGIN NO DOCKER HUB

docker login

🚀 PASSO 12 — PUSH DA IMAGEM

docker tag api-node:latest SEU_USUARIO/api-node:latest
docker push SEU_USUARIO/api-node:latest

🐝 PASSO 13 — DEPLOY NO DOCKER SWARM

docker service create \
  --name api-node \
  --publish published=3000,target=3000 \
  SEU_USUARIO/api-node:latest

🌍 PASSO 14 — ACESSAR NO NAVEGADOR

http://IP_DA_MANAGER:3000
http://IP_DA_MANAGER:3000/health

🔁 PASSO 15 — ATUALIZAR A API (REGRA DE OURO)

docker build -t api-node:latest .
docker tag api-node:latest SEU_USUARIO/api-node:latest
docker push SEU_USUARIO/api-node:latest
docker service update --image SEU_USUARIO/api-node:latest api-node
