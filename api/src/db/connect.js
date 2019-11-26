const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test'
});
const connectDb = () => {
    connection.connect();
};

module.exports = connectDb;
