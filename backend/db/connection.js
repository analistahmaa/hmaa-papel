// backend/db/connection.js

const mysql = require('mysql2');

// Cria um "pool" de conexões usando a versão de Promises do mysql2
// Um pool é mais eficiente do que criar uma nova conexão para cada query
const db = mysql.createPool({
  host: process.env.DB_HOST,         // Lê do docker-compose.yml (valor: 'db')
  user: process.env.DB_USER,         // Lê do docker-compose.yml (valor: 'root')
  password: process.env.DB_PASSWORD, // Lê do docker-compose.yml (valor: 'HMaa.25')
  database: process.env.DB_NAME,     // Lê do docker-compose.yml (valor: 'hmaa_controle_papel')
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
}).promise(); // <-- O '.promise()' no final é o que nos dá a interface async/await

// Testa a conexão para garantir que tudo está funcionando ao iniciar o app
db.getConnection()
  .then(connection => {
    console.log('✅ Conexão com o banco de dados MySQL estabelecida com sucesso!');
    connection.release(); // Libera a conexão de volta para o pool
  })
  .catch(err => {
    console.error('❌ ERRO ao conectar com o banco de dados:', err.message);
    // Em caso de falha, você pode querer encerrar o processo para que o Docker o reinicie
    process.exit(1); 
  });

module.exports = db;