require("dotenv").config();
const router = require("express").Router();
const logger = require("../../../logger");
const { create_database } = require("../../services/createDatabaseService");
const { isAuthenticated, authorize } = require("../../resources/isAtuthenticaded");

const env = process.env.NODE_ENV === "development";

const is_development = env
  ? []
  : [isAuthenticated, authorize(["ADMIN"])];

router.get("/", ...is_development, async (req, res) => {
    logger.info("GET /create_database");

    try {
        const result = await create_database();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

module.exports = router;