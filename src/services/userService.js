const { v4 } = require("uuid");

const logger = require("../../logger");
const {
    query_select_all,
    query_select_by_id,
    query_select_by_email,
    query_select_by_phone,
    query_delete_user_by_id,
    query_insert_user,
    query_update_user_by_id,
} = require("../repositores/query_user");

const RankingService = require("./rankingService.js");

const { hashSync } = require("bcrypt");

class UserService {
    async service_query_select_all(name, email, phone, role) {
        logger.info("UserService: Buscando todos os usuários.");

        try {
            const result = await query_select_all(name, email, phone, role);
            logger.info(`UserService: ${result.length || 0} usuários encontrados.`);
            return result;
        } catch (error) {
            logger.error("UserService: Erro ao buscar usuários.", { error: error.message });
            throw new Error("Erro ao buscar usuários.");
        };
    };

    async service_query_select_by_id(id_user) {
        logger.info("UserService: Buscando usuário pelo ID.", { id_user: id_user });

        try {
            const result = await query_select_by_id(id_user);
            if (!result.length) {
                logger.warn("UserService: Usuário não encontrado.", { id_user: id_user });
                throw new Error("Usuário não encontrado.");
            };

            logger.info("UserService: Sucesso ao buscar usuário pelo ID.", { id_user: id_user, email: result[0].email, phone: result[0].phone, status: result[0].status });
            return result[0];
        } catch (error) {
            logger.error("UserService: Erro ao buscar usuário pelo ID.", { id_user: id_user, error: error.message });
            throw new Error(error.message || "Erro ao buscar usuário pelo ID.");
        };
    };

    async service_query_insert_user(name, email, phone, password, role) {
        logger.info("UserService: Cadastrando novo usuário.", { name: name, email: email, phone: phone, role: role });

        if (!name, !email, !phone, !password, !role) {
            throw new Error("Preencha todos os dados...");
        };

        try {
            const check_if_email_exists = await query_select_by_email(email);

            if (check_if_email_exists[0]) {
                logger.error("UserService: E-mail já cadastrado.", { email: email });
                throw new Error("E-mail já cadastrado.");
            };

            const check_if_phone_exists = await query_select_by_phone(phone);

            if (check_if_phone_exists[0]) {
                logger.error("UserService: Telefone já cadastrado.", { phone: phone });
                throw new Error("Telefone já cadastrado.");
            };

            const password_hashed = hashSync(password, 10);

            const id_user = v4();

            const status = "UNLOCKED";
            
            const payload = {
                id_user, name, email, phone, password_hashed, status, role
            };
            
            const access_expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias

            role === "TEMP_USER" ? payload.access_expires_at = access_expires_at : false

            await query_insert_user(id_user, name, email, phone, password_hashed, status, role, access_expires_at);
            await RankingService.insert_ranking(id_user);

            logger.info("UserService: Usuário cadastrado com sucesso.", { name: name, email: email, phone: phone, role: role, status: status, access_expires_at: access_expires_at });
            return { status: 200, message: "Usuário cadastrado com sucesso.", id_user: id_user };
        } catch (error) {
            logger.error("UserService: Erro ao cadastrar usuário.", { name: name, email: email, phone: phone, role: role, error: error.message });
            throw new Error(error.message || "Erro ao cadastrar usuário.");
        };
    };

    async service_query_update_user_by_id(id_user, name, email, password, phone, role, is_active) {
        logger.info("UserService: Atualizando usuário pelo ID.", { id_user: id_user, name: name, email: email, phone: phone });

        try {
            const user_if_exists = await query_select_by_id(id_user);

            if (!user_if_exists[0]?.id_user) {
                logger.error("UserService: Usuário não encontrado.", { id_user: id_user });
                throw new Error("Usuário não encontrado.");
            };

            const check_if_email_exists = await query_select_by_email(email);

            if (check_if_email_exists[0] && check_if_email_exists[0].id_user !== id_user) {
                logger.error("UserService: E-mail já cadastrado.", { email: email, id_user: id_user });
                throw new Error("E-mail já cadastrado.");
            };

            const password_hashed = password && hashSync(password, 10);

            await query_update_user_by_id(id_user, name, email, password_hashed, phone, role, is_active);
            logger.info("UserService: Usuário atualizado com sucesso.", { id_user: id_user });
            return { status: 200, message: "Usuário atualizado com sucesso." };
        } catch (error) {
            logger.error("UserService: Erro atualizar usuário pelo ID.", { id_user: id_user, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_delete_user_by_id(id_user) {
        logger.info("UserService: Deletando usuário pelo ID.", { id_user: id_user });

        try {
            const user_if_exists = await query_select_by_id(id_user);

            if (!user_if_exists[0]?.id_user) {
                logger.warn("UserService: Usuário não encontrado.", { id_user: id_user });
                throw new Error("Usuário não encontrado.");
            };

            await query_delete_user_by_id(id_user);
            logger.info("UserService: User Usuário deletado com sucesso.", { id_user: id_user });
            return { status: 200, message: "Usuário deletado com sucesso." };
        } catch (error) {
            logger.error("UserService: Erro ao atualizar usuário pelo ID.", { id_user: id_user, error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new UserService();