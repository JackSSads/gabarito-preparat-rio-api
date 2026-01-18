const AuthService = require("../services/authService");
const logger = require("../../logger");

const authenticationUser = async (headers) => {
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger.warn("Authentication: Falha na autenticação do usuário - Token não fornecido ou inválido no header.");
        return { message: "Falha na autenticação do usuário - Token não fornecido ou inválido no header.", status: false };
    };

    const token = authHeader.split(" ")[1];
    logger.info("Authentication: Token extraído, verificando...");

    try {
        const result = await AuthService.verifyUser(token);

        if (result?.id_user) {
            logger.info("Authentication: Sucesso ao buscar usuário via token.", { id_user: result.id_user });
            return { status: true, id_user: result.id_user, role: result.role };
        } else {
            logger.warn("Authentication: Falha na autenticação - Token inválido ou usuário não encontrado.");
            return { message: "Falha na autenticação - Token inválido ou usuário não encontrado.", status: false };
        };
    } catch (error) {
        logger.error("Authentication: Erro na autenticação do usuário.", error.message);
        return { message: error.message, status: false };
    };
};

const isAuthenticated = async (req, res, next) => {
    const userAgent = req.get('User-Agent');
    const clientIP = req.ip || req.connection.remoteAddress

    logger.auth("Tentativa de autenticação", {
        clientIP,
        userAgent: userAgent ? userAgent.substring(0, 100) : 'Unknown',
    });

    const authCheck = await authenticationUser(req.headers);

    if (!authCheck.status) {
        logger.security(authCheck.message);
        res.status(401).send({ message: authCheck.message, status: false });
        return;
    };

    if (authCheck?.id_user) {
        logger.auth("Usuário autenticado com sucesso", {
            clientIP,
            id_user: authCheck.id_user
        });
        
        req.role_user = authCheck.role;
        return next();
    };

    logger.security("Acesso negado - autenticação falhou", {
        clientIP,
        userAgent: userAgent ? userAgent.substring(0, 100) : 'Unknown'
    });
    res.status(401).send({ message: "Acesso negado. Faça login.", status: false });
};

const authorize = (roles = []) => (req, res, next) => {
    if (!roles.includes(req.role_user)) {
        return res.status(403).json({ message: "Sem permissão para realizar essa ação." });
    };
    next();
};

module.exports = {
    isAuthenticated,
    authorize
};