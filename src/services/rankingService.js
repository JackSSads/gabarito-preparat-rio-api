const { query_insert_ranking, query_get_ranking } = require("../repositores/query_ranking");
const logger = require("../../logger");

class RankingService {
    async insert_ranking(id_user, score = 0) {
        logger.info("RankingService: Atualizando score.", { id_user: id_user, score: score });

        try {
            await query_insert_ranking(id_user, Number(score));
            logger.info("RankingService: Score do usuário atualizado.");
            return { message: "Score do usuário atualizado.", status: true };
        } catch (error) {
            logger.error("RankingService: Erro ao atualizar score.", { id_user: id_user, error: error.message });
            throw new Error("Erro ao atualizar score.");
        };
    };

    async get_ranking() {
        logger.info("RankingService: Buscando ranking.");

        try {
            const result = await query_get_ranking();
            logger.info("RankingService: Ranking retornado");
            return result;
        } catch (error) {
            logger.error("RankingService: Erro ao buscar ranking.", { id_user: id_user, error: error.message });
            throw new Error("Erro ao buscar ranking.");
        };
    };
};

module.exports = new RankingService();