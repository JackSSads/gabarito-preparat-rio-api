const pool = require("../../db/conn");

const query_select_all = (keyword = "", limit, offset, subject, difficulty, random) => {
    return new Promise((resolve, reject) => {

        let sql = "SELECT * FROM questions";

        const values = [];
        const where = [];

        if (subject) {
            where.push("subject = ?");
            values.push(subject);
        };

        if (difficulty) {
            where.push("difficulty = ?");
            values.push(difficulty);
        };

        if (keyword) {
            where.push(`question LIKE '%${keyword.replaceAll("'", "")}%'`);
        };

        if (where.length) {
            sql += " WHERE " + where.join(" AND ");
        };

        if (random && !keyword) {
            sql += " ORDER BY RAND()";
        };

        if (limit && !keyword) {
            sql += " LIMIT ?";
            values.push(limit);
        };

        if (offset && !keyword) {
            sql += " OFFSET ?";
            values.push(offset);
        };

        pool.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_select_by_id = (id_question) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM questions WHERE id_question =  ?;";

        pool.query(sql, [id_question], (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
};

const query_select_options = (id_question) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                qo.id_question_options,
                qo.answer_option
            FROM question_options qo
            WHERE id_question = ?
            ORDER BY RAND();
        `;

        pool.query(sql, [id_question], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_insert_into = (id_question, question, text = null, difficulty, subject) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO questions
            (id_question, question, correct_question_id, difficulty, subject ${text ? ", text" : ""})
            VALUES (?,?,?,?,? ${text ? ",?" : ""});
        `;

        const values = [id_question, question, null, difficulty, subject];

        text && values.push(text);

        pool.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_update_correct_answer = (id_question, correct_answer) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE questions
            SET correct_question_id = ?
            WHERE id_question = ?;
        `;

        const values = [correct_answer, id_question];

        pool.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_update_by_id = (id_question, question, text, correct_question_id, difficulty, subject) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE questions
            SET
            question = ?,
            text = ?,
            correct_question_id = ?,
            difficulty = ?,
            subject = ?
            WHERE id_question = ?;`;

        const values = [question, text, correct_question_id, difficulty, subject, id_question];

        pool.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_delete_by_id = (id_question) => {
    return new Promise((resolve, reject) => {
        const sql = `
            DELETE FROM 
                questions
            WHERE id_question = ?;`;

        pool.query(sql, [id_question], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    query_select_all,
    query_select_by_id,
    query_select_options,
    query_insert_into,
    query_update_correct_answer,
    query_update_by_id,
    query_delete_by_id
};