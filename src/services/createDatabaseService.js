const { v4 } = require("uuid");
const { hashSync } = require("bcrypt");
const logger = require("../../logger");
const {
    create_table_question_options,
    create_table_questions,
    create_table_ranking,
    create_table_user,
    insert_into_first_user
} = require("../repositores/create_database");

const create_database = async () => {
    try {
        const first_id_user = v4();
        const password_hashed = hashSync("adminmanager", 10);
        await Promise.all([
            create_table_question_options(),
            create_table_questions(),
            create_table_ranking(),
            create_table_user(),
            insert_into_first_user(first_id_user, password_hashed)
        ]);

        logger.info("CreateDatabaseService: Banco de dados configurado com sucesso.");
        return { message: "Banco de dados configurado com sucesso.", status: true };
    } catch (error) {
        logger.error("StartDatabase: Erro ao criar o banco de dados", error);
        throw new Error(error.message || "Erro ao criar banco de dados.");
    };
};

module.exports = { create_database };