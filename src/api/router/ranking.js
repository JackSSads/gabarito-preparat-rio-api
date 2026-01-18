const router = require("express").Router();
const logger = require("../../../logger");
const RankingService = require("../../services/rankingService");

const { isAuthenticated, authorize } = require("../../resources/isAtuthenticaded");

router.get("/", async (req, res) => {
    logger.info("GET /ranking");

    try {
        const result = await RankingService.get_ranking();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

router.post("/", isAuthenticated, authorize(["ADMIN", "USER", "TEMP_USER"]), async (req, res) => {
    logger.info("POST /ranking");

    const { id_user, score } = req.body;

    try {
        const result = await RankingService.insert_ranking(id_user, score);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

module.exports = router;