const router = require("express").Router();
const logger = require("../../../logger");
const { create_database } = require("../../services/createDatabaseService");
const { authorize } = require("../../resources/isAtuthenticaded");

router.get("/", authorize(["ADMIN"]), async (req, res) => {
    /*
        CRIAÇÃO DAS TABELAS DO BANCO DE DADOS
        A rota pede nível de ADMIN meramente para no dia a dia
        não ser acessada por outros usuários, mesmo sendo irrelevante.
    */
    logger.info("GET /create_database");

    try {
        const result = await create_database();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

module.exports = router;