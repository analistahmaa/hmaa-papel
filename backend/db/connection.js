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

// 2. A "Bala de Prata": Evento que é disparado para CADA nova conexão.
// Isso força o charset para a sessão, sobrepondo qualquer padrão do servidor.
pool.on('connection', function (connection) {
  console.log('Uma nova conexão foi estabelecida com o DB. Forçando charset para utf8mb4.');
  connection.query("SET NAMES 'utf8mb4'");
  connection.query("SET CHARACTER SET utf8mb4");
});

// 3. Exporta a interface de Promises, que todos os seus controllers usam.
const db = pool.promise();

// 4. Testa a conexão na inicialização para feedback rápido.
db.getConnection()
  .then(connection => {
    console.log('✅ Conexão com o banco de dados MySQL estabelecida com sucesso!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ ERRO ao conectar com o banco de dados:', err.message);
    process.exit(1); 
  });

// 5. Exporta a conexão configurada para o resto da aplicação.
module.exports = db;