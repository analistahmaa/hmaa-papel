// backend/controllers/relatorioController.js
const pool = require("../db/connection.js");
const PDFDocument = require('pdfkit');

// Função para o card de Total Geral no Dashboard
exports.getDashboardData = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT SUM(quantidade_resmas) AS totalResmas FROM registros
      WHERE MONTH(data) = MONTH(CURRENT_DATE()) AND YEAR(data) = YEAR(CURRENT_DATE())
    `);
    const total = rows[0].totalResmas || 0;
    return res.status(200).json({ totalResmasMes: total });
  } catch (err) {
    console.error("Erro em getDashboardData:", err);
    return res.status(500).json({ message: "Erro ao buscar dados do dashboard." });
  }
};

// Função para o card de Total por Setor no Dashboard
exports.getTotalPorSetorMes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.nome, SUM(r.quantidade_resmas) AS total_resmas
      FROM registros r
      JOIN setores s ON r.setor_id = s.id
      WHERE MONTH(r.data) = MONTH(CURRENT_DATE()) AND YEAR(r.data) = YEAR(CURRENT_DATE())
      GROUP BY s.nome ORDER BY total_resmas DESC
    `);
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erro em getTotalPorSetorMes:", err);
    return res.status(500).json({ message: "Erro ao buscar dados por setor." });
  }
};

// Função para GERAR O PDF do relatório por setor
exports.gerarRelatorioPorSetorPDF = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.nome AS setor_nome, SUM(r.quantidade_resmas) AS total_resmas
      FROM registros r JOIN setores s ON r.setor_id = s.id
      WHERE MONTH(r.data) = MONTH(CURRENT_DATE()) AND YEAR(r.data) = YEAR(CURRENT_DATE())
      GROUP BY s.nome ORDER BY total_resmas DESC
    `);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `Relatorio_Setor_${new Date().toISOString().slice(0,10)}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    // Lógica para desenhar o PDF
    doc.fontSize(18).text('Relatório de Consumo por Setor', { align: 'center' });
    doc.moveDown();
    rows.forEach(item => {
        doc.fontSize(12).text(`${item.setor_nome}: ${item.total_resmas} resmas`);
    });

    doc.end();
  } catch (err) {
    console.error("Erro em gerarRelatorioPorSetorPDF:", err);
    res.status(500).json({ message: "Erro ao gerar o relatório PDF." });
  }
};