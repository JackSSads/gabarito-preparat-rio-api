const { compareSync } = require("bcrypt");
const { sign, verify } = require('jsonwebtoken');
const {
    query_auth_verify_if_user_exists,
    query_auth_verify_if_user_exists_by_id
} = require("../repositores/query_auth");

const { query_update_state_user_by_id } = require("../repositores/query_user");

const logger = require("../../logger");
require('dotenv').config();

class AuthService {
    async login(email, password) {
        logger.info("AuthService: Tentativa de login", { email: email });

        try {
            const user = await query_auth_verify_if_user_exists(email);

            if (!user) {
                logger.warn("AuthService: Falha no login - Usuário não encontrado.", { email: email });
                throw new Error("Usuário não encontrado.");
            };

            const isPasswordValid = compareSync(password, user.password);

            if (!isPasswordValid) {
                logger.warn("AuthService: Falha no login - Senha inválida", { email: email });
                throw new Error("Senha inválida");
            };

            const token = sign({ id_user: user.id_user, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: "7d"
            });

            if (!user?.is_active) {
                throw new Error("Usuário bloqueado.");
            };

            if (
                user.role === "TEMP_USER"
                && user.access_expires_at
                && new Date() > new Date(user.access_expires_at)
            ) {
                await query_update_state_user_by_id(user.id_user);
                throw new Error("Acesso temporário expirado.");
            };

            logger.info("AuthService: Login bem-sucedico.", { email: email, id_user: user.id_user, token: token });
            return { message: "Login realizado com sucesso.", token, id_user: user.id_user, name: user.name, role: user.role };
        } catch (error) {
            logger.error("AuthService: Erro ao tentar realizar login.", { email: email, error: error.message });
            throw new Error(error.message);
        };
    };

    async verifyUser(token) {
        logger.info("AuthService: Verificando token do usuário.");

        try {
            const decoded = verify(token, process.env.JWT_SECRET, { expiresIn: "7d" });
            const result = await query_auth_verify_if_user_exists_by_id(decoded.id_user);

            if (!result?.id_user) {
                logger.warn("AuthService: Falha ao tentar verificar token do usuário - Usuário não encontrado.", { id_user: decoded.id });
                throw new Error("Falha ao tentar verificar token do usuário - Usuário não encontrado.");
            };

            if (!result?.is_active) {
                throw new Error("Usuário bloqueado.");
            };

            if (
                result.role === "TEMP_USER"
                && result.access_expires_at
                && new Date() > new Date(result.access_expires_at)
            ) {
                await query_update_state_user_by_id(result.id_user);
                throw new Error("Acesso temporário expirado.");
            };

            logger.security("AuthService: Token do usuário verificado com sucesso.", { id_user: decoded.id_user });
            return result;
        } catch (error) {
            logger.error("AuthService: Erro ao verificar token do usuário.", { error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new AuthService();
