const { v4 } = require("uuid");
const {
    query_select_from_id_question,
    query_insert_into_question_options,
    query_update_by_id
} = require("../repositores/query_questions_options");
const logger = require("../../logger");

class QuestionOptionsService {
    async select_options_from_question(id_question) {
        logger.info("QuestionOptionsService: Buscando opções de respostas para a pergunta.");

        try {
            const result = await query_select_from_id_question(id_question);

            if (!result.length) {
                logger.warn("QuestionOptionsService: Pergunta ou respostas não encontradas.");
                throw new Error("Pergunta ou respostas não encontradas.");
            };

            logger.info("QuestionService: Opções de respostas retornadas.");
            return result;
        } catch (error) {
            logger.error("QuestionService: Erro ao buscar opções de respostas.", { error: error.message });
            throw new Error(error.message);
        };
    };

    async insert_into_question_options(id_question, list_question_options = [], correct_answer) {
        logger.info("QuestionOptionsService: Inserindo opções de respostas.");

        try {
            let correct_question_id = null;
            list_question_options.forEach(async (answer_option, index) => {
                const id_question_options = v4();

                if (correct_answer === index) {
                    correct_question_id = id_question_options
                };

                await query_insert_into_question_options(id_question_options, id_question, answer_option);
            });
            logger.info("QuestionService: Opções de respostas cadastradas com sucesso.");
            return { status: true, message: "Opções de respostas cadastradas com sucesso.", correct_answer: correct_question_id };
        } catch (error) {
            logger.info("QuestionOptionsService: Erro ao inserir respostas.", { error: error.message });
            throw new Error(error.message);
        };
    };

    async update_options(list_question_options = []) {
        logger.info("QuestionOptionsService: Atualizando opções de respostas.");
        try {
            list_question_options.forEach(async (option, index) => {
                await query_update_by_id(option.id_question_options, option.answer_option);
            });
            logger.info("QuestionService: Opções de respostas atualizada com sucesso.");
            return { status: true, message: "Opções de respostas cadastradas com sucesso." };
        } catch (error) {
            logger.info("QuestionOptionsService: Erro ao inserir respostas.", { error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new QuestionOptionsService;