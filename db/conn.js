require("dotenv").config();
const mysql = require('mysql2');
const logger = require('../logger');

logger.database("Iniciando configuração da conexão com banco de dados");

const developer_data = {
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "developer",
    database: "db_gabarito",
    port: 3306
};

const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT || developer_data.connectionLimit,
    host: process.env.HOST || developer_data.host,
    user: process.env.USER || developer_data.user,
    password: process.env.PASSWORD || developer_data.password,
    database: process.env.DATABASE || developer_data.database,
    port: process.env.PORT || developer_data.password,
});

pool.getConnection((err, connection) => {
    if (err) {
        logger.error("Erro ao conectar com banco de dados", { 
            error: err.message, 
            code: err.code,
            host: process.env.HOST || developer_data.host,
            database: process.env.DATABASE || developer_data.database,
            port: process.env.PORT || developer_data.port,
        });
        return;
    };
    
    logger.database("Conexão com banco de dados estabelecida com sucesso", {
        host: process.env.HOST || developer_data.host,
        database: process.env.DATABASE || developer_data.database,
        port: process.env.PORT || developer_data.port,
        threadId: connection.threadId
    });
    
    connection.release();
});

pool.on('connection', (connection) => {
    logger.database("Nova conexão criada no pool", { 
        threadId: connection.threadId 
    });
});

pool.on('acquire', (connection) => {
    logger.debug("Conexão adquirida do pool", { 
        threadId: connection.threadId 
    });
});

pool.on('release', (connection) => {
    logger.debug("Conexão liberada para o pool", { 
        threadId: connection.threadId 
    });
});

pool.on('enqueue', () => {
    logger.warn("Conexão enfileirada - pool pode estar sobrecarregado");
});

process.on('SIGINT', () => {
    logger.database("Encerrando pool de conexões do banco de dados");
    pool.end((err) => {
        if (err) {
            logger.error("Erro ao encerrar pool de conexões", { error: err.message });
        } else {
            logger.database("Pool de conexões encerrado com sucesso");
        };
    });
});

module.exports = pool;