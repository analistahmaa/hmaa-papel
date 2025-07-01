// backend/controllers/relatorioController.js
const db = require("../db/connection.js");

exports.getDashboardSummary = (req, res) => {
    // A lógica é a mesma, mas agora sobre a coluna `quantidade_resmas`
    const q = `
        SELECT SUM(quantidade_resmas) * 500 AS totalFolhas 
        FROM registros 
        WHERE MONTH(data) = MONTH(CURDATE()) AND YEAR(data) = YEAR(CURDATE());
    `;

    db.query(q, (err, data) => {
        if (err) {
            console.error("Erro no banco de dados:", err);
            return res.status(500).json({ message: "Erro ao buscar dados do dashboard." });
        }
        const total = data[0].totalFolhas || 0;
        return res.status(200).json({ totalFolhasMes: total });
    });
};