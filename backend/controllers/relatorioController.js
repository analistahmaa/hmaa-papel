// backend/controllers/relatorioController.js
const pool = require("../db/connection.js");
const PDFDocument = require('pdfkit'); // Não se esqueça de 'npm install pdfkit' no backend

// --- FUNÇÕES PARA O DASHBOARD ---

// 1. Busca o total de resmas do mês para o card principal.
exports.getDashboardData = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT SUM(quantidade_resmas) AS totalResmas
      FROM registros
      WHERE MONTH(data) = MONTH(CURRENT_DATE()) AND YEAR(data) = YEAR(CURRENT_DATE());
    `;
    const [rows] = await connection.query(query);
    connection.release();
    const total = rows[0].totalResmas || 0;
    return res.status(200).json({ totalResmasMes: total });
  } catch (err) {
    console.error("Erro ao buscar dados para o dashboard:", err);
    return res.status(500).json({ message: "Erro interno ao processar dados do dashboard." });
  }
};

// 2. Busca os totais agrupados por setor para o card de "Total por Setor".
exports.getTotalPorSetorMes = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT s.nome, SUM(r.quantidade_resmas) AS total_resmas
      FROM registros r
      JOIN setores s ON r.setor_id = s.id
      WHERE MONTH(r.data) = MONTH(CURRENT_DATE()) AND YEAR(r.data) = YEAR(CURRENT_DATE())
      GROUP BY s.nome
      ORDER BY total_resmas DESC;
    `;
    const [rows] = await connection.query(query);
    connection.release();
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar total por setor:", err);
    return res.status(500).json({ message: "Erro interno ao buscar dados por setor." });
  }
};


// --- FUNÇÕES PARA GERAÇÃO DE RELATÓRIOS PDF ---

// 3. Gera o relatório PDF de consumo por setor no mês.
// O nome foi corrigido para ser único e claro.
exports.gerarRelatorioPorSetor = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT s.nome AS setor_nome, SUM(r.quantidade_resmas) AS total_resmas
      FROM registros r
      JOIN setores s ON r.setor_id = s.id
      WHERE MONTH(r.data) = MONTH(CURRENT_DATE()) AND YEAR(r.data) = YEAR(CURRENT_DATE())
      GROUP BY s.nome
      ORDER BY total_resmas DESC;
    `;
    const [rows] = await connection.query(query);
    connection.release();

    // --- GERAÇÃO DO PDF ---
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Define o cabeçalho da resposta para forçar o download
    const filename = `Relatorio_Consumo_Por_Setor_${new Date().toISOString().slice(0,10)}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Adiciona conteúdo ao PDF
    doc.fontSize(18).font('Helvetica-Bold').text('Relatório de Consumo por Setor', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text(`Mês de Referência: ${new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`, { align: 'center' });
    doc.moveDown(2);

    const tableTop = doc.y;
    const itemX = 50;
    const qtyX = 450;

    // Cabeçalhos da tabela
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Setor', itemX, tableTop);
    doc.text('Total (Resmas)', qtyX, tableTop, { width: 100, align: 'right' });
    doc.moveTo(itemX, doc.y + 5).lineTo(itemX + 500, doc.y + 5).stroke();
    doc.moveDown();
    doc.font('Helvetica');

    let totalGeral = 0;

    // Linhas da tabela
    rows.forEach(item => {
      const y = doc.y;
      doc.text(item.setor_nome, itemX, y, { width: 380 });
      doc.text(item.total_resmas.toString(), qtyX, y, { width: 100, align: 'right' });
      totalGeral += item.total_resmas;
      doc.moveDown();
    });

    // Linha de total
    doc.moveTo(itemX, doc.y + 5).lineTo(itemX + 500, doc.y + 5).stroke();
    doc.moveDown();
    doc.font('Helvetica-Bold');
    doc.text('TOTAL GERAL:', itemX, doc.y);
    doc.text(totalGeral.toString(), qtyX, doc.y, { width: 100, align: 'right' });

    // Finaliza o PDF
    doc.end();

  } catch (err) {
    console.error("Erro ao gerar relatório por setor:", err);
    res.status(500).json({ message: "Erro ao gerar o relatório." });
  }
};