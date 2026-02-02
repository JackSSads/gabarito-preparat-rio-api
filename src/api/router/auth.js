const router = require("express").Router();
const logger = require("../../../logger");
const AuthService = require("../../services/authService");

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    logger.info("POST: /login");

    try {
        const result = await AuthService.login(email, password);

        return res.status(result.status || 200).send(result);
    } catch (error) {
        logger.error(`Falha no login: ${email}`, error);
        res.status(500).send({ message: error.message, status: false });
    };
});

module.exports = router;