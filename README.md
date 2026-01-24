# Gabarito Preparatório API

API RESTful para o aplicativo Quiz Gabarito Preparatório - uma plataforma de questões para estudos e preparação para provas.

## 📋 Descrição

Esta API serve como backend para o aplicativo Gabarito Preparatório, fornecendo endpoints para autenticação de usuários, gerenciamento de questões, respostas, ranking e administração do sistema.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **bcrypt** - Hashing de senhas
- **CORS** - Compartilhamento de recursos entre origens
- **uuid** - Geração de identificadores únicos
- **nodemon** - Desenvolvimento automático

## 📁 Estrutura do Projeto

```
gabarito-preparat-rio-api/
├── src/
│   ├── api/
│   │   └── router/          # Rotas da API
│   │       ├── auth.js      # Autenticação
│   │       ├── user.js      # Usuários
│   │       ├── questions.js # Questões
│   │       ├── question_answer.js # Respostas
│   │       ├── ranking.js   # Ranking
│   │       └── create_database.js # Criação do BD
│   ├── repositores/         # Queries SQL
│   ├── services/            # Lógica de negócio
│   └── resources/           # Middleware e utilitários
├── db/
│   └── conn.js             # Conexão com MySQL
├── logs/                   # Logs da aplicação
├── index.js               # Ponto de entrada
├── logger.js              # Configuração de logging
├── package.json
└── .env_example           # Variáveis de ambiente
```

## 🛠️ Instalação

### Pré-requisitos
- Node.js 14+
- MySQL 5.7+
- npm ou yarn

### Passos

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd gabarito-preparat-rio-api
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env_example .env
   ```
   Edite o arquivo `.env` com suas configurações:
   ```env
   CONNECTION_LIMIT=10
   HOST=localhost
   USER=root
   PASSWORD=developer
   DATABASE=db_gabarito
   PORT=3306
   JWT_SECRET=sua_chave_secreta_aqui
   PORT_BACK=5000
   ```

4. **Crie o banco de dados**
   ```bash
   mysql -u root -p
   CREATE DATABASE db_gabarito;
   ```

5. **Execute o script de criação das tabelas**
   ```bash
   # A API possui um endpoint para criar as tabelas automaticamente
   # POST /api/create_database
   ```

## 🚀 Executando a Aplicação

### Modo Desenvolvimento
```bash
npm run dev
```

### Modo Produção
```bash
npm start
```

A API estará disponível em `http://localhost:5000`

## 📚 Documentação da API

### Autenticação

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso.",
  "token": "jwt_token_aqui",
  "id_user": 1,
  "name": "Nome do Usuário",
  "role": "USER"
}
```

### Usuários

#### Obter perfil do usuário
```http
GET /api/user/profile
Authorization: Bearer <token>
```

#### Atualizar perfil
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Novo Nome",
  "email": "novo@email.com"
}
```

### Questões

#### Listar questões
```http
GET /api/question?keyword=matematica&limit=10&offset=0&subject=exatas&difficulty=media&random=true
Authorization: Bearer <token>
```

#### Obter questão por ID
```http
GET /api/question/:id_question
Authorization: Bearer <token>
```

#### Criar questão (ADMIN)
```http
POST /api/question
Authorization: Bearer <token>
Content-Type: application/json

{
  "question_text": "Qual a capital do Brasil?",
  "subject": "Geografia",
  "difficulty": "facil",
  "options": [
    {"option_text": "São Paulo", "is_correct": false},
    {"option_text": "Rio de Janeiro", "is_correct": false},
    {"option_text": "Brasília", "is_correct": true},
    {"option_text": "Salvador", "is_correct": false}
  ]
}
```

### Respostas

#### Submeter resposta
```http
POST /api/question_answer
Authorization: Bearer <token>
Content-Type: application/json

{
  "id_question": 1,
  "id_option": 3,
  "time_spent": 30
}
```

### Ranking

#### Obter ranking
```http
GET /api/ranking?limit=10&subject=matematica
```

## 🔐 Papéis de Usuário

- **ADMIN**: Acesso total ao sistema
- **USER**: Acesso normal às funcionalidades
- **TEMP_USER**: Acesso temporário com data de expiração

## 📊 Logs

A aplicação utiliza um sistema de logging completo com diferentes níveis:

- **info**: Informações gerais
- **error**: Erros da aplicação
- **security**: Eventos de segurança
- **database**: Operações do banco de dados
- **api**: Requisições da API

Os logs são salvos no diretório `logs/` com rotação automática.

## 🐳 Docker

Para executar com Docker:

```bash
docker build -t gabarito-api .
docker run -p 5000:5000 --env-file .env gabarito-api
```

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `CONNECTION_LIMIT` | Limite de conexões do pool | 10 |
| `HOST` | Host do MySQL | localhost |
| `USER` | Usuário do MySQL | root |
| `PASSWORD` | Senha do MySQL | developer |
| `DATABASE` | Nome do banco | db_gabarito |
| `PORT` | Porta do MySQL | 3306 |
| `JWT_SECRET` | Chave secreta para JWT | - |
| `PORT_BACK` | Porta da API | 5000 |

## 🚨 Tratamento de Erros

A API retorna erros no formato:
```json
{
  "message": "Descrição do erro",
  "status": false
}
```

Códigos de status HTTP comuns:
- `200`: Sucesso
- `401`: Não autorizado
- `403`: Acesso negado
- `404`: Não encontrado
- `500`: Erro interno do servidor

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença ISC.

## 👨‍💻 Autor

**Jackson Souza da Silva** - Desenvolvedor

## 📞 Contato

Para suporte ou dúvidas, entre em contato através do email do autor.