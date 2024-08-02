# Librisys

## Sumário
- [Introdução](#introducao)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tech)
- [Como Rodar](#rodar)


<div id='introducao'/> 

## Introdução

Librisys é um sistema de biblioteca desenvolvido para facilitar a gestão de empréstimos, visualização de livros e gerenciamento de usuários. O sistema é composto por um backend robusto utilizando Spring Boot e um frontend interativo e moderno construído com React.

<div id='funcionalidades'/> 

## Funcionalidades

- Cadastro de Livros: Permite o registro de novos livros com detalhes como título, autor, ISBN, categoria e quantidade disponível.
- Empréstimos de Livros: Funcionalidade para registrar e gerenciar empréstimos de livros por parte dos usuários.
- Gerenciamento de Usuários: Cadastro e autenticação de usuários, com funcionalidades específicas para administradores.

<div id='tech'/> 

## Tecnologias Utilizadas

### Frontend
- React
- Shadcn/ui
- Tailwind CSS

### Backend
- Spring Boot
- MySQL
- Spring Security

### Ferramentas de Desenvolvimento
- Maven
- VS Code
- Postman (para testes de API)

<div id='rodar'/> 

## Como Rodar

### Pré-requisitos

- Node.js
- Java 11+
- MySQL
- Maven

Passos para rodar o frontend
1. Clone o repositório:
```
git clone <url_do_repositório>
cd <diretório_do_repositório>/frontend
```

2. Instale as dependências:
```
npm install
```

3. Inicie o servidor de desenvolvimento:
```
npm start
```

Passos para rodar o backend
1. Navegue até o diretório backend:
```
cd <diretório_do_repositório>/backend
```

2. Configure o banco de dados no arquivo application.properties:
```
spring.datasource.url=jdbc:mysql://localhost:3306/sistema_biblioteca
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

3. Rode o projeto utilizando Maven:
```
mvn spring-boot:run
```

4. Acesse o sistema no navegador:
```
http://localhost:3000
```
