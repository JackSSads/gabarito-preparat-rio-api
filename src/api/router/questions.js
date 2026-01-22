const router = require("express").Router();
const logger = require("../../../logger");
const QuestionService = require("../../services/questionsService");
const { authorize } = require("../../resources/isAtuthenticaded");

router.get("/", authorize(["ADMIN", "USER", "TEMP_USER"]), async (req, res) => {
    logger.api("GET /question");
    
    const { keyword, limit, offset, subject, difficulty, random } = req.query;

    try {
        const result = await QuestionService.select_all_questions(keyword, limit, offset, subject, difficulty, random);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

router.get("/:id_question", authorize(["ADMIN", "USER", "TEMP_USER"]), async (req, res) => {
    const { id_question } = req.params;

    logger.api("GET /question/:id_question");

    try {
        const result = await QuestionService.select_question_by_id(id_question);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

router.post("/", authorize(["ADMIN"]), async (req, res) => {
    const { question, text, options, correct_answer, difficulty, subject } = req.body;

    logger.api("POST /question");

    try {
        const result = await QuestionService.insert_into_question(question, text, options, correct_answer, difficulty, subject);
        res.status(200).send({ message: result.message });
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

router.post("/massive_insert", authorize(["ADMIN"]), async (req, res) => {
    const { list_questions } = req.body;

    logger.api("POST /massive_insert");

    try {
        const result = await QuestionService.massive_insert(list_questions);
        res.status(200).send({ message: result.message });
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

router.put("/:id_question", authorize(["ADMIN"]), async (req, res) => {
    const { id_question } = req.params;
    const { question, text, options, correct_answer, difficulty, subject } = req.body;

    try {
        const result = await QuestionService.update_question(id_question, question, text, options, correct_answer, difficulty, subject);
        res.status(200).send({ message: result.message });
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

router.delete("/:id_question", authorize(["ADMIN"]), async (req, res) => {
    const { id_question } = req.params;

    try {
        const result = await QuestionService.delete_question(id_question);
        res.status(200).send({ message: result.message });
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

module.exports = router;