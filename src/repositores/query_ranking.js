const pool = require("../../db/conn");

const query_insert_ranking = (id_user, score) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO user_scores (id_user, score, last_score_update)
            VALUES (?, ${score}, CURRENT_TIMESTAMP)
            ON DUPLICATE KEY UPDATE
	            score = score + ${score},
                last_score_update = CURRENT_TIMESTAMP;
        `;

        pool.query(sql, [id_user], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_get_ranking = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
            ROW_NUMBER() OVER (ORDER BY us.score DESC) AS position,
            u.name,
            us.score,
            COUNT(uqa.id_user_question_answer) AS quizzes_taken,
            ROUND(
                COALESCE(
                (SUM(uqa.is_correct = true) / NULLIF(COUNT(uqa.id_user_question_answer), 0)) * 100,
                0
                )
            ) AS average_score
            FROM user u
            JOIN user_scores us ON us.id_user = u.id_user
            LEFT JOIN user_question_answer uqa ON uqa.id_user = u.id_user
            WHERE u.role <> 'ADMIN'
            GROUP BY u.id_user, u.name, us.score
            ORDER BY us.score DESC;
        `;

        pool.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    query_insert_ranking,
    query_get_ranking
};