// backend/controllers/relatorioController.js
const pool = require("../db/connection.js");
const PDFDocument = require('pdfkit');

// --- FUNÇÕES PARA O DASHBOARD (sem alterações) ---

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


// --- FUNÇÕES PARA GERAÇÃO DE RELATÓRIOS PDF (CORRIGIDAS) ---

exports.gerarRelatorioPorSetorPDF = async (req, res) => {
  try {
    const { data_inicio, data_fim, setor_id } = req.query;

    if (!data_inicio || !data_fim) {
      return res.status(400).json({ message: 'Data de início e data de fim são obrigatórias.' });
    }

    let query = `
      SELECT s.nome AS setor_nome, SUM(r.quantidade_resmas) AS total_resmas
      FROM registros r JOIN setores s ON r.setor_id = s.id
      WHERE r.data BETWEEN ? AND ?
    `;
    const params = [data_inicio, data_fim];

    if (setor_id) {
      query += " AND r.setor_id = ?";
      params.push(setor_id);
    }

    query += " GROUP BY s.nome ORDER BY total_resmas DESC;";

    const [rows] = await pool.query(query, params);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `Relatorio_Setor_${data_inicio}_a_${data_fim}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(18).font('Helvetica-Bold').text('Relatório de Consumo por Setor', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text(`Período: ${new Date(data_inicio).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} a ${new Date(data_fim).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}`, { align: 'center' });
    doc.moveDown(2);

    if (rows.length === 0) {
      doc.fontSize(14).text('Nenhum dado encontrado para os filtros selecionados.', { align: 'center' });
    } else {
      const tableTop = doc.y;
      const itemX = 50;
      const qtyX = 450;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Setor', itemX, tableTop);
      doc.text('Total (Resmas)', qtyX, tableTop, { width: 100, align: 'right' });
      doc.moveTo(itemX - 10, doc.y + 5).lineTo(itemX + 510, doc.y + 5).stroke();
      doc.moveDown();
      doc.font('Helvetica');

      let totalGeral = 0;
      rows.forEach(item => {
        const y = doc.y;
        doc.text(item.setor_nome, itemX, y, { width: 380 });
        doc.text(item.total_resmas.toString(), qtyX, y, { width: 100, align: 'right' });
        totalGeral += Number(item.total_resmas);
        doc.moveDown(0.8);
      });

      doc.moveTo(itemX - 10, doc.y + 10).lineTo(itemX + 510, doc.y + 10).stroke();
      doc.moveDown(1.5);
      doc.font('Helvetica-Bold');
      doc.text('TOTAL GERAL:', itemX, doc.y, { width: 380 });
      doc.text(totalGeral.toString(), qtyX, doc.y, { width: 100, align: 'right' });
    }
    
    doc.end();

  } catch (err) {
    console.error("Erro em gerarRelatorioPorSetorPDF:", err);
    res.status(500).json({ message: "Erro ao gerar o relatório PDF." });
  }
};

exports.gerarRelatorioGastoTotalPDF = async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;
    if (!data_inicio || !data_fim) {
      return res.status(400).json({ message: 'Data de início e data de fim são obrigatórias.' });
    }

    const query = `
      SELECT SUM(quantidade_resmas) AS total_geral_resmas
      FROM registros
      WHERE data BETWEEN ? AND ?;
    `;
    const params = [data_inicio, data_fim];
    const [rows] = await pool.query(query, params);
    
    const totalGeral = Number(rows[0].total_geral_resmas) || 0;

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `Gasto_Total_Hospital_${data_inicio}_a_${data_fim}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(20).font('Helvetica-Bold').text('Relatório de Gasto Total do Hospital', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(14).font('Helvetica').text(`Período de Análise: `, { continued: true }).font('Helvetica-Bold').text(`${new Date(data_inicio).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} a ${new Date(data_fim).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}`);
    doc.moveDown(2.5);
    doc.fontSize(16).font('Helvetica').text('Total de resmas consumidas no período:', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(48).font('Helvetica-Bold').text(totalGeral.toString(), { align: 'center' });
    doc.fontSize(22).font('Helvetica').text('resmas', { align: 'center' });

    doc.end();

  } catch (err) { // O erro estava aqui, faltava a chave de abertura do catch
    console.error("Erro em gerarRelatorioGastoTotalPDF:", err);
    res.status(500).json({ message: "Erro ao gerar o relatório PDF de gasto total." });
  }
};