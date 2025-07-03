// backend/db/connection.js

const mysql = require('mysql2');

// 1. Cria o pool de conexões base.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4' // Primeira linha de defesa
});

// 2. A CORREÇÃO MAIS IMPORTANTE: Evento que força o charset em CADA nova conexão.
// Isso garante que a sessão entre Node e MySQL sempre fale em UTF-8.
pool.on('connection', function (connection) {
  console.log('Uma nova conexão foi estabelecida com o DB. Forçando charset para utf8mb4.');
  connection.query("SET NAMES 'utf8mb4'");
  connection.query("SET CHARACTER SET utf8mb4");
});

// 3. Exporta a interface de Promises, que seus controllers usam.
const db = pool.promise();

// 4. Testa a conexão na inicialização para feedback.
db.getConnection()
  .then(connection => {
    console.log('✅ Conexão com o banco de dados MySQL estabelecida com sucesso!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ ERRO ao conectar com o banco de dados:', err.message);
    process.exit(1); 
  });

// 5. Exporta a conexão para o resto da aplicação.
module.exports = db;