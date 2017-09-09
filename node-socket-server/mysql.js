const mysql = require('mysql');
let sql;
exports.connect = () => {
    sql = mysql.createConnection({
        "host": `${process.env.DB_HOST}`,
        "port": `${process.env.DB_PORT}`,
        "user": `${process.env.DB_USER}`,
        "password": `${process.env.DB_PASSWORD}`,
        "database": `${process.env.DB_NAME}`,
    })

    return sql.connect();
}

exports.query = (query, params) => {
    return new Promise((resolve, reject) => {
        if (typeof params === "undefined") sql.query(query, function (err, result) {
            if (err) throw err;
            else resolve(result)
        })
        else sql.query(query, params, function (err, result) {
            if (err) throw err;
            else resolve(result);
        })
    })
}