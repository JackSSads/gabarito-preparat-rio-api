const router = require("express").Router();
const logger = require("../../../logger");
const UserService = require("../../services/userService");
const { isAuthenticated, authorize } = require("../../resources/isAtuthenticaded");

router.get("/", isAuthenticated, authorize(["ADMIN"]), async (req, res) => {
    logger.info("GET /user");

    const { name, email, phone, role } = req.query;

    try {
        const result = await UserService.service_query_select_all(name, email, phone, role);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

router.get("/:id_user", isAuthenticated, authorize(["ADMIN", "USER", "TEMP_USER"]), async (req, res) => {
    const { id_user } = req.params;

    logger.info(`GET /user/:id_user`);

    try {
        const result = await UserService.service_query_select_by_id(id_user);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

router.post("/", async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    logger.info("POST /user");

    try {
        const result = await UserService.service_query_insert_user(name, email, phone, password, role);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

router.put("/:id_user", isAuthenticated, authorize(["ADMIN", "USER", "TEMP_USER"]), async (req, res) => {
    const { id_user } = req.params;
    const { name, email, password, phone, role, is_active } = req.body;

    logger.info("PUT /user/:id_user");

    try {
        const result = await UserService.service_query_update_user_by_id(id_user, name, email, password, phone, role, is_active);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

router.delete("/:id_user", isAuthenticated, authorize(["ADMIN", "USER", "TEMP_USER"]), async (req, res) => {
    const { id_user } = req.params;

    logger.info("DELETE /user/:id_user");

    try {
        const result = await UserService.service_query_delete_user_by_id(id_user);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

module.exports = router;