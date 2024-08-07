
# Librasys :books:

:construction: EM CONSTRUÇÃO :construction:

Librasys é um sistema de biblioteca desenvolvido para facilitar a gestão de empréstimos, visualização de livros e gerenciamento de usuários. O sistema é composto por um backend robusto utilizando Spring Boot e um frontend interativo e moderno construído com React.


![Logo](https://i.imgur.com/20MYU8E.png)


## Funcionalidades

- *Cadastro de Livros*: Permite o registro de novos livros com detalhes como título, autor, ISBN, categoria e quantidade disponível.
- *Empréstimos de Livros*: Funcionalidade para registrar e gerenciar empréstimos de livros por parte dos usuários.
- *Gerenciamento de Usuários*: Cadastro e autenticação de usuários, com funcionalidades específicas para administradores.


## Stack utilizada

**Front-end:** React, Shadcn/ui, Tailwind CSS

**Back-end:** - Spring Boot, Spring Security, MySQL


## Instalação

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

## Rodando

Para rodar o front utilize o seguinte comando

```bash
  npm run dev
```


## Autor

- [@LucasMKS](https://www.github.com/LucasMKS)


## 🔗 Links
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lucas-marques-da-silva-23b919232/)
