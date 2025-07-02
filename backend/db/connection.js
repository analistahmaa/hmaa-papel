// backend/db/connection.js

const mysql = require('mysql2');

// 1. Cria o pool de conexões base, sem chamar .promise() ainda.
// Guardamos a referência dele na variável 'pool'.
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // Lê do docker-compose.yml (valor: 'db')
  user: process.env.DB_USER,         // Lê do docker-compose.yml (valor: 'root')
  password: process.env.DB_PASSWORD, // Lê do docker-compose.yml (valor: 'HMaa.25')
  database: process.env.DB_NAME,     // Lê do docker-compose.yml (valor: 'hmaa_controle_papel')
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4' // Mantemos esta linha, pois é uma boa prática.
});

// 2. Usamos a referência 'pool' para registrar o listener de evento.
// Este é o passo crucial para forçar o charset em cada nova conexão.
pool.on('connection', function (connection) {
  console.log('Uma nova conexão foi estabelecida com o DB. Configurando charset...');
  // Executa comandos SQL para garantir que a sessão da conexão use utf8mb4.
  // Usamos connection.query aqui, pois é a interface de callback do objeto de conexão base.
  connection.query("SET NAMES 'utf8mb4'");
  connection.query("SET CHARACTER SET utf8mb4");
});

// 3. Agora, criamos a versão com promessas a partir do pool já configurado.
const db = pool.promise();

// 4. Testa a conexão usando a interface de promessas 'db'
db.getConnection()
  .then(connection => {
    console.log('✅ Conexão com o banco de dados MySQL estabelecida com sucesso!');
    connection.release(); // Libera a conexão de volta para o pool
  })
  .catch(err => {
    console.error('❌ ERRO ao conectar com o banco de dados:', err); // Loga o erro completo
    // Em caso de falha na inicialização, encerrar o processo é uma boa estratégia em containers.
    process.exit(1); 
  });

// 5. Exporta a interface de promessas para o resto da sua aplicação usar com async/await.
module.exports = db;