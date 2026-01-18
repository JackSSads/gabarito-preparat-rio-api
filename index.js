const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./logger");

const PORT = 5000;

require("dotenv").config();

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

app.use(cors({
    origin: [process.env.URL_FRONT ?? "http://localhost:8080"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

console.log(process.env.URL_FRONT)

const { isAuthenticated } = require("./src/resources/isAtuthenticaded");

const authRouter = require("./src/api/router/auth");
const userRouter = require("./src/api/router/user");
const rankingRouter = require("./src/api/router/ranking");
const questionRouter = require("./src/api/router/questions");
const questionAnswerRouter = require("./src/api/router/question_answer");
const createDatabaseRouter = require("./src/api/router/create_database");

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/ranking", rankingRouter);
app.use("/api/question", isAuthenticated, questionRouter);
app.use("/api/question_answer", isAuthenticated, questionAnswerRouter);
app.use("/api/create_database", createDatabaseRouter);

app.listen(process.env.PORT_BACK || PORT, () => {
    logger.info(`Servidor iniciado na porta ${process.env.PORT_BACK || PORT}`);
});