const { v4 } = require("uuid");
const {
    query_select_all,
    query_select_by_id,
    query_insert_into,
    query_update_correct_answer,
    query_select_options,
    query_update_by_id,
    query_delete_by_id
} = require("../repositores/query_questions");
const QuestionOptionsService = require("../services/questionOptionsService");
const logger = require("../../logger");

class QuestionService {
    async select_all_questions(keyword, limit, offset, subject, difficulty, random) {
        logger.info("QuestionService: Buscando todas as perguntas.");

        try {
            const questions = await query_select_all(keyword, Number(limit), Number(offset), subject, difficulty, random);

            const result = await Promise.all(questions.map(async (question) => {
                const questionOptions = await this.select_question_options(question.id_question);

                return {
                    "id_question": question.id_question,
                    "question": question.question,
                    "correct_question_id": question.correct_question_id,
                    "difficulty": question.difficulty,
                    "subject": question.subject,
                    "options": questionOptions
                };
            }));

            logger.info(`QuestionService: ${result.length || 0} perguntas retornadas`);
            return result;
        } catch (error) {
            logger.error("QuestionService: Erro ao buscar perguntas.", { error: error.message });
            throw new Error("Erro ao buscar perguntas.");
        };
    };

    async select_question_by_id(id_question) {
        try {
            const question = await query_select_by_id(id_question);

            if (!question.length) {
                logger.warn("QuestionService: Questão não encontrada.", { id_question: id_question });
                throw new Error("Pergunta não encontrada.");
            };

            const questionOptions = await this.select_question_options(id_question);

            logger.info("QuestionService: Sucesso ao buscar questão pelo ID.", { id_question: id_question });

            return {
                "id_question": question[0].id_question,
                "question": question[0].question,
                "correct_question_id": question[0].correct_question_id,
                "difficulty": question[0].difficulty,
                "subject": question[0].subject,
                "questions": questionOptions
            };
        } catch (error) {
            logger.error("QuestionService: Erro ao buscar pergunta pelo ID.", { id_question: id_question, error: error.message });
            throw new Error(error.message);
        };
    };

    async select_question_options(id_question) {
        logger.info("QuestionService: Buscando pergunta pelo ID.", { id_question: id_question });

        try {
            const result = await query_select_options(id_question);
            if (!result.length) {
                logger.warn("QuestionService: Opções de resposra não encontrada.", { id_question: id_question });
                throw new Error("Pergunta não encontrada.");
            };

            logger.info("QuestionService: Sucesso ao buscar opções de resposta pelo ID.", { id_question: id_question });
            return result;
        } catch (error) {
            logger.error("QuestionService: Erro ao buscar opções de resposta pelo ID.", { id_question: id_question, error: error.message });
            throw new Error(error.message);
        };
    };

    async insert_into_question(question, options, correct_answer, difficulty, subject) {
        logger.info("QuestionService: Cadastrando nova pergunta.", { question: question, options: options, correct_answer: correct_answer, difficulty: difficulty, subject: subject });

        try {
            logger.info("QuestionService: Cadastrando pergunta.");
            
            const id_question = v4();
            await query_insert_into(id_question, question, difficulty, subject);

            logger.info("QuestionService: Inserindo as opções de respostas.");
            const insert_into_question_options = await QuestionOptionsService.insert_into_question_options(id_question, options, correct_answer);

            logger.info("QuestionService: Atualizando tabela com ID da resposta correta.");
            await query_update_correct_answer(id_question, insert_into_question_options.correct_answer);

            logger.info("QuestionService: Pergunta cadastrada com sucesso.");

            return { status: true, message: "Pergunta cadastrada com sucesso." };
        } catch (error) {
            logger.error("QuestionService: Erro ao inserir pergunta.", { error: error.message });
            throw new Error("Erro ao inserir pergunta.");
        };
    };

    async massive_insert(list_questions = []) {
        logger.info("QuestionService: Cadastro de questões em massa.");

        try {
            logger.info("QuestionService: Cadastrando lista de questões.");
            list_questions.map(async (question) => {
                await this.insert_into_question(question.question, question.options, question.correct_answer, question.difficulty, question.subject);
            });

            logger.info(`QuestionService: ${list_questions.length || 0} perguntas cadastrada com sucesso`);
            return { status: true, message: `${list_questions.length || 0} perguntas cadastrada com sucesso.` };
        } catch (error) {
            logger.error("QuestionService: Erro ao inserir perguntas.", { error: error.message });
            throw new Error("Erro ao inserir perguntas.");
        };
    };

    async update_question(id_question, question, options, correct_question_id, difficulty, subject) {
        logger.info("QuestionService: Atualizando questão", {
            id_question: id_question,
            question: question,
            options: options,
            correct_question_id: correct_question_id,
            difficulty: difficulty,
            subject: subject
        });

        try {
            await this.select_question_by_id(id_question);
            await query_update_by_id(id_question, question, correct_question_id, difficulty, subject);
            await QuestionOptionsService.update_options(options);

            logger.info("QuestionService: Questão atualizada com sucesso.");
            return { message: "Questão atualizada com sucesso.", status: true };
        } catch (error) {
            logger.error("QuestionService: Erro ao atualizar questão.", { error: error.message });
            throw new Error("Erro ao atualizar questão.");
        };
    };

    async delete_question(id_question) {
        logger.info("QuestionService: Deletenado questão", { id_question: id_question });

        try {
            await this.select_question_by_id(id_question);
            await query_delete_by_id(id_question);

            logger.info("QuestionService: Questão deletada com sucesso.");
            return { message: "Questão deletada com sucesso.", status: true };
        } catch (error) {
            logger.error("QuestionService: Erro ao deletar questão.", { error: error.message });
            throw new Error("Erro ao deletar questão.");
        };
    };
};

module.exports = new QuestionService();