const mysql = require('mysql');
const dbConfig = require('../config/db-config');

const connection = mysql.createConnection({
  pool: dbConfig.POOL,
  connectionLimit: dbConfig.CONNECTION_LIMIT,
  waitForConnections: dbConfig.WAIT_FOR_CONNECTIONS,
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  multipleStatements: dbConfig.MULTIPLE_STATEMENTS,
});

connection.connect(error => {
  if (error) throw error;
  console.log('Successfully connected to the nursery database');
});

module.exports = connection;