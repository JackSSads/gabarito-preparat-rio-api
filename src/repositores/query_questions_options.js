const pool = require("../../db/conn");

const query_select_from_id_question = (id_question) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT *
            FROM question_options AS qo
            WHERE qo.id_question = ?;
        `;

        pool.query(sql, [id_question], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_insert_into_question_options = (id_question_options, id_question, answer_option) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO question_options
            (id_question_options, id_question, answer_option)
            VALUES (?,?,?);
        `;

        const values = [
            id_question_options,
            id_question,
            answer_option
        ];

        pool.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_update_by_id = (id_question_options, answer_option) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE question_options
            SET answer_option = ?
            WHERE id_question_options = ?;
        `;

        const values = [
            answer_option,
            id_question_options
        ];

        pool.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    query_select_from_id_question,
    query_insert_into_question_options,
    query_update_by_id
};