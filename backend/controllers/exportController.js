// backend/controllers/exportController.js

const pool = require("../db/connection.js");
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// Função auxiliar para buscar os dados (reutilizando a lógica de filtro)
const getFilteredData = async (filters) => {
  const { setor_id, responsavel, data_inicio, data_fim } = filters;

  let query = `
    SELECT s.nome AS setor, r.responsavel, r.quantidade_resmas, DATE_FORMAT(r.data, '%d/%m/%Y') AS data
    FROM registros r JOIN setores s ON r.setor_id = s.id
  `;

  const params = [];
  const conditions = [];

  if (setor_id) {
    conditions.push("r.setor_id = ?");
    params.push(setor_id);
  }
  if (responsavel) {
    conditions.push("r.responsavel LIKE ?");
    params.push(`%${responsavel}%`);
  }
  if (data_inicio && data_fim) {
    conditions.push("r.data BETWEEN ? AND ?");
    params.push(data_inicio, data_fim);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  
  query += " ORDER BY r.data DESC, r.id DESC";

  const [rows] = await pool.query(query, params);
  return rows;
};

// --- FUNÇÃO PARA EXPORTAR PARA EXCEL ---
exports.exportToExcel = async (req, res) => {
  try {
    const data = await getFilteredData(req.query);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Lançamentos');

    // Cabeçalhos da planilha
    worksheet.columns = [
      { header: 'Setor', key: 'setor', width: 30 },
      { header: 'Responsável', key: 'responsavel', width: 30 },
      { header: 'Quantidade (Resmas)', key: 'quantidade_resmas', width: 20 },
      { header: 'Data', key: 'data', width: 15 },
    ];
    
    // Adiciona os dados
    worksheet.addRows(data);

    // Configura a resposta para forçar o download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=lancamentos.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Erro ao exportar para Excel:", error);
    res.status(500).send("Erro ao gerar o arquivo Excel.");
  }
};

// --- FUNÇÃO PARA EXPORTAR PARA PDF ---
exports.exportToPdf = async (req, res) => {
  try {
    const data = await getFilteredData(req.query);
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    // Configura a resposta para forçar o download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=lancamentos.pdf');

    // Pipe do PDF diretamente para a resposta
    doc.pipe(res);

    // Título do documento
    doc.fontSize(16).text('Relatório de Lançamentos de Papel', { align: 'center' });
    doc.moveDown();

    // Tabela
    const tableTop = 100;
    const itemHeight = 20;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Setor', 30, tableTop);
    doc.text('Responsável', 200, tableTop);
    doc.text('Qtd (Resmas)', 400, tableTop, { width: 90, align: 'right'});
    doc.text('Data', 470, tableTop, { width: 90, align: 'right'});
    doc.font('Helvetica');

    data.forEach((item, i) => {
        const y = tableTop + (i + 1) * itemHeight;
        doc.text(item.setor, 30, y);
        doc.text(item.responsavel, 200, y);
        doc.text(item.quantidade_resmas.toString(), 400, y, { width: 90, align: 'right' });
        doc.text(item.data, 470, y, { width: 90, align: 'right'});
    });
    
    // Finaliza o PDF
    doc.end();

  } catch (error) {
    console.error("Erro ao exportar para PDF:", error);
    res.status(500).send("Erro ao gerar o arquivo PDF.");
  }
};