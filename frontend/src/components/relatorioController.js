// backend/controllers/relatorioController.js

const db = require("../db/connection.js");

// ... (suas outras funções, como getRelatorios, etc.)

// NOVA FUNÇÃO PARA O DASHBOARD
const getDashboardSummary = (req, res) => {
    // Query para somar a quantidade de folhas do mês e ano atuais
    const q = `
        SELECT SUM(quantidade) AS totalFolhas 
        FROM registros 
        WHERE MONTH(data) = MONTH(CURDATE()) AND YEAR(data) = YEAR(CURDATE());
    `;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        // Se não houver registros, o resultado pode ser null. Tratamos isso.
        const total = data[0].totalFolhas || 0;
        return res.status(200).json({ totalFolhasMes: total });
    });
};

// Não se esqueça de exportar a nova função
module.exports = {
    // ... (suas outras exportações)
    getDashboardSummary
};