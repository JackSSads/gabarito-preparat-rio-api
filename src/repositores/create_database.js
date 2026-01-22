const pool = require("../../db/conn");

const create_table_questions = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS questions (
                id_question 		VARCHAR(36) NOT NULL PRIMARY KEY,
                text				TEXT DEFAULT NULL,
                question 			TEXT NOT NULL,
                correct_question_id	VARCHAR(36),
                difficulty 			ENUM("EASY", "MEDIUM", "HARD"),
                subject			    VARCHAR(3) NOT NULL
            );
        `;

        pool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const create_table_question_options = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS question_options (
                id_question_options			VARCHAR(36) NOT NULL PRIMARY KEY,
                id_question 				VARCHAR(36) NOT NULL,
                answer_option 				TEXT NOT NULL,
                FOREIGN KEY (id_question)	REFERENCES questions (id_question) ON DELETE CASCADE
            );
        `;

        pool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const create_table_user = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS user (
                id_user				VARCHAR(36) NOT NULL PRIMARY KEY,
                name				VARCHAR(100) NOT NULL,
                email				VARCHAR(100) NOT NULL,
                phone				VARCHAR(11) NOT NULL,
                password    		VARCHAR(60) NOT NULL,
                status				ENUM("UNLOCKED", "LOCKED") NOT NULL,
                role        		ENUM("ADMIN","USER", "TEMP_USER") NOT NULL,
                access_expires_at	DATETIME NULL,
                is_active 			BOOLEAN DEFAULT true
            );
        `;

        pool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const create_table_ranking = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS user_scores (
                id_user 			    VARCHAR(36) NOT NULL PRIMARY KEY,
                score 				    INT DEFAULT 0,
                last_score_update	    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_user)   REFERENCES user (id_user) ON DELETE CASCADE
            );
        `;

        pool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const create_table_user_question_answer = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            CREATE TABLE IF NOT EXISTS user_question_answer (
                id_user_question_answer				VARCHAR(36) NOT NULL PRIMARY KEY,
                id_user 							VARCHAR(36) NOT NULL,
                id_question 						VARCHAR(36) NOT NULL,
                selected_option_id 					VARCHAR(36) NOT NULL,
                is_correct 							BOOLEAN NOT NULL,
                is_timeout 							BOOLEAN NOT NULL DEFAULT false,
                response_time 						INT NOT NULL,
                answered_at 						DATETIME NOT NULL,
                FOREIGN KEY (id_user) 				REFERENCES user(id_user) ON DELETE CASCADE,
                FOREIGN KEY (id_question) 			REFERENCES questions(id_question) ON DELETE CASCADE,
                FOREIGN KEY (selected_option_id) 	REFERENCES question_options(id_question_options) ON DELETE CASCADE
        );`;

        pool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const insert_into_first_user = (first_id_user, password_hashed) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO user
            (id_user, name, email, phone, password, status, role)
            VALUES 
            (?, "Admin", "admin.user@gabarito.com.br",
            "84999000972", ?, "UNLOCKED", "ADMIN");
        `;

        pool.query(sql, [first_id_user, password_hashed], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    create_table_questions,
    create_table_question_options,
    create_table_ranking,
    create_table_user,
    create_table_user_question_answer,
    insert_into_first_user
};