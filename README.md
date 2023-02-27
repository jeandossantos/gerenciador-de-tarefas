# Gerenciador de Tarefas

[![NPM](https://img.shields.io/npm/l/react)](https://github.com/TXTDBR/gerenciador_de_tarefas/blob/master/LICENSE) 

## Sobre o projeto

Gerenciador de Tarefas é uma aplicação full stack web.

A aplicação é uma ferramenta simples de criação e controle de tarefas.

### **_OBS:_** _Backend refeito com Typescript e TypeORM_ [Aqui](https://github.com/jeandossantos/tarefas_backend_ts)

## Layout da Aplicação
![Web 1](https://github.com/TXTDBR/assets/blob/master/gerenciador%20de%20tarefas/signin.png)
![Web 2](https://github.com/TXTDBR/assets/blob/master/gerenciador%20de%20tarefas/signup.png)
![Web 3](https://github.com/TXTDBR/assets/blob/master/gerenciador%20de%20tarefas/home.png)
![Web 4](https://github.com/TXTDBR/assets/blob/master/gerenciador%20de%20tarefas/tarefa2.png)
![Web 5](https://github.com/TXTDBR/assets/blob/master/gerenciador%20de%20tarefas/perfil.png)

## Diagrama Entidade Relacionamento
![Diagrama Entidade Relacionamento](https://github.com/TXTDBR/assets/blob/master/gerenciador%20de%20tarefas/uml-tasks.png)

## Tecnologias utilizadas
## Back end
- Javascript
- Node.js
- Express
- PostgreSQL
- prisma
- Autenticação JWT
- Testes com jest e supertest
## Front end
- Vue JS
- Vuex
- Vue Router
- HTML / CSS / JS
- Bootstrap
- vue-chartjs

## Como executar o projeto

### Back end

```bash
# clonar repositório
git clone https://github.com/jeandossantos/gerenciador-de-tarefas.git

# entrar na pasta do projeto back end
cd backend

# instalar dependências
npm ci | npm i

# roda migrations
npx prisma migrate:dev
 
# executar o projeto
npm run dev
```

## Front end web
Pré-requisitos: npm 

```bash
# clonar repositório
git clone https://github.com/jeandossantos/gerenciador-de-tarefas.git

# entrar na pasta do projeto front end web
cd frontend

# instalar dependências
npm install

# executar o projeto
npm run serve
```

## Autor

Jean Francisco dos Santos
