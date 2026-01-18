const pool = require("../../db/conn");

const query_auth_verify_if_user_exists = (email) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                u.name,
                u.id_user,
                u.password,
                u.role,
                u.is_active,
                u.access_expires_at
            FROM user u
            WHERE u.email = ?;
        `;

        pool.query(sql, [email], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            };
        });
    });
};

const query_auth_verify_if_user_exists_by_id = (id_user) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                u.id_user,
                u.is_active,
                u.role
            FROM user u
            WHERE u.id_user = ?;
        `;

        pool.query(sql, [id_user], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            };
        });
    });
};

module.exports = {
    query_auth_verify_if_user_exists,
    query_auth_verify_if_user_exists_by_id
};
