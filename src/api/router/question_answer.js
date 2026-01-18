const router = require("express").Router();
const logger = require("../../../logger");
const QuestionAnswerService = require("../../services/questionAnswerService")
const { authorize } = require("../../resources/isAtuthenticaded");

router.post("/:id_user", authorize(["ADMIN", "USER", "TEMP_USER"]), async (req, res) => {
    logger.info("POST /question_answer/:id_user");
    
    const { id_user } = req.params;
    const { id_question, is_correct, is_timeout, response_time, selected_option_id } = req.body;

    try {
        const result = await QuestionAnswerService.insert_into_question_answer(id_user, id_question, selected_option_id, is_correct, is_timeout, response_time);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message, status: false });
    };
});

module.exports = router;