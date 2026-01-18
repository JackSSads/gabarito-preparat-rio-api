const { v4 } = require("uuid");
const logger = require("../../logger");

const { query_insert_question_answer } = require("../repositores/query_question_answer");

class QuestionAnswerService {
    async insert_into_question_answer(id_user, id_question, selected_option_id, is_correct, is_timeout, response_time) {
        logger.info("QuestionAnswerService: .", {
            id_user: id_user,
            id_question: id_question,
            selected_option_id: selected_option_id,
            is_correct: is_correct,
            is_timeout: is_timeout,
            response_time: response_time,
        });

        try {
            const id_user_question_answer = v4();

            await query_insert_question_answer(id_user_question_answer, id_user, id_question, selected_option_id, is_correct, is_timeout, response_time);
            
            logger.info("QuestionService: Resposta do usuário inserida com sucesso.");
            return { status: true, message: "Resposta do usuário inserida com sucesso." };
        } catch (error) {
            logger.error("QuestionAnswerService: Erro ao inserir resposta do usuário.", { error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new QuestionAnswerService();