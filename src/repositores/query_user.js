const pool = require("../../db/conn");

const query_select_all = (name, email, phone, role) => {
    return new Promise((resolve, reject) => {
        let sql = `
            SELECT 
                u.id_user,
                u.name,
                u.email,
                u.phone,
                u.status,
                u.role,
                u.access_expires_at,
                u.is_active
            FROM user AS u`;

        const where = [];
        const values = [];

        if (role) {
            where.push("u.role = ?");
            values.push(role);
        };

        if (email) {
            where.push("u.email = ?");
            values.push(email);
        };

        if (phone) {
            where.push("u.phone = ?");
            values.push(phone);
        };

        if (name) {
            where.push(`u.name LIKE '%${name}%'`);
        };

        if (where.length) {
            sql += " WHERE " + where.join(" AND ");
        };

        pool.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_select_by_id = (id_user) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                u.id_user,
                u.name,
                u.email,
                u.phone,
                u.status
            FROM user AS u
            WHERE u.id_user = ?;
        `;

        pool.query(sql, [id_user], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_select_by_email = (email) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT u.id_user, u.name, u.email
            FROM user AS u
            WHERE u.email = ?;
        `;

        pool.query(sql, [email], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_select_by_phone = (phone) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT u.id_user, u.phone
            FROM user AS u
            WHERE u.phone = ?;
        `;

        pool.query(sql, [phone], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_insert_user = (id_user, name, email, phone, password_hashed, status, role, access_expires_at) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO user 
            (id_user, name, email, phone, password, status, role, access_expires_at)
            VALUES (?,?,?,?,?,?,?,?);
        `;

        const values = [id_user, name, email, phone, password_hashed, status, role, access_expires_at];

        pool.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_update_user_by_id = (id_user, name, email, password_hashed, phone, role, is_active) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE user AS u
            SET ${password_hashed ? "u.password = ?," : ""}
                u.name = ?,
                u.email = ?,
                u.phone = ?,
                u.role = ?,
                u.is_active = ?
            WHERE u.id_user = ?;
        `;

        const values = [name, email, phone, role, Number(is_active), id_user];

        password_hashed && values.unshift(password_hashed);

        pool.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_update_state_user_by_id = (id_user) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE user AS u
            SET u.is_active = ?
            WHERE u.id_user = ?;
        `;

        const values = [0, id_user];

        pool.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};
const query_update_ranking_by_id = (id_user, score) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE user_scores AS us
            SET us.score = us.score + ?,
                us.last_score_update = CURRENT_TIMESTAMP
            WHERE us.id_user = ?;
        `;

        const values = [score, id_user];

        pool.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const query_delete_user_by_id = (id_user) => {
    return new Promise((resolve, reject) => {
        const sql = `
            DELETE FROM user u
            WHERE u.id_user = ?;
        `;

        pool.query(sql, [id_user], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    query_select_all,
    query_select_by_id,
    query_select_by_email,
    query_select_by_phone,
    query_insert_user,
    query_update_user_by_id,
    query_update_state_user_by_id,
    query_update_ranking_by_id,
    query_delete_user_by_id,
};