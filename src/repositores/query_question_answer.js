const pool = require("../../db/conn");

const query_insert_question_answer = (id_user_question_answer, id_user, id_question, selected_option_id, is_correct, is_timeout, response_time) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO user_question_answer
            (id_user_question_answer, id_user, id_question, selected_option_id, is_correct, is_timeout, response_time, answered_at )
            VALUES (?,?,?,?,?,?,?,?);
        `;

        const values = [id_user_question_answer, id_user, id_question, selected_option_id, is_correct, is_timeout, response_time, new Date()];

        pool.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    query_insert_question_answer
};