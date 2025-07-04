// backend/controllers/relatorioController.js
const pool = require("../db/connection.js");

// Função para buscar os dados para os cards do Dashboard
exports.getDashboardData = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Query para somar o total de resmas no mês e ano atuais
    const query = `
      SELECT SUM(quantidade_resmas) AS totalResmas
      FROM registros
      WHERE MONTH(data) = MONTH(CURRENT_DATE())
        AND YEAR(data) = YEAR(CURRENT_DATE());
    `;

    const [rows] = await connection.query(query);
    connection.release();

    // Se não houver lançamentos, SUM retorna null. Tratamos isso retornando 0.
    const total = rows[0].totalResmas || 0;
    
    // Responde com um objeto JSON contendo os dados
    return res.status(200).json({
      totalResmasMes: total,
    });

  } catch (err) {
    console.error("Erro ao buscar dados para o dashboard:", err);
    return res.status(500).json({ message: "Erro interno ao processar dados do dashboard." });
  }
};

// --- Funções de Placeholder para futuros relatórios ---

exports.relatorioPorSetor = async (req, res) => {
  // TODO: Implementar a lógica para buscar dados por setor
  res.status(501).json({ message: "Relatório por setor ainda não implementado." });
};

exports.relatorioPorSetor = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const query = `
      SELECT s.nome AS setor_nome, SUM(r.quantidade_resmas) AS total_resmas
      FROM registros r
      JOIN setores s ON r.setor_id = s.id
      WHERE MONTH(r.data) = MONTH(CURRENT_DATE())
        AND YEAR(r.data) = YEAR(CURRENT_DATE())
      GROUP BY s.nome
      ORDER BY total_resmas DESC;
    `;

    const [rows] = await connection.query(query);
    connection.release();

    // --- GERAÇÃO DO PDF ---
    const doc = new PDFDocument({ margin: 50 });

    // Define o cabeçalho da resposta para forçar o download
    const filename = `Relatorio_Por_Setor_${new Date().toISOString().slice(0,10)}.pdf`;
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    // "Conecta" o documento PDF à resposta da requisição
    doc.pipe(res);

    // Adiciona conteúdo ao PDF
    doc.fontSize(18).text('Relatório de Consumo por Setor', { align: 'center' });
    doc.fontSize(12).text(`Mês de Referência: ${new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`, { align: 'center' });
    doc.moveDown(2);

    // Cabeçalhos da tabela
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Setor', 50, doc.y, { width: 300 });
    doc.text('Total de Resmas', 400, doc.y, { width: 100, align: 'right' });
    doc.moveDown();
    doc.font('Helvetica');

    let totalGeral = 0;

    // Linhas da tabela
    rows.forEach(item => {
      doc.text(item.setor_nome, 50, doc.y, { width: 300 });
      doc.text(item.total_resmas.toString(), 400, doc.y, { width: 100, align: 'right' });
      totalGeral += item.total_resmas;
      doc.moveDown(0.5);
    });
    
    // Linha de total
    doc.moveDown();
    doc.font('Helvetica-Bold');
    doc.text('Total Geral de Resmas:', 50, doc.y, { width: 300 });
    doc.text(totalGeral.toString(), 400, doc.y, { width: 100, align: 'right' });

    // Finaliza o PDF
    doc.end();

  } catch (err) {
    console.error("Erro ao gerar relatório por setor:", err);
    res.status(500).json({ message: "Erro ao gerar o relatório." });
  }
};

exports.getTotalPorSetorMes = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Query que agrupa os registros por setor e soma as resmas
    const query = `
      SELECT s.nome, SUM(r.quantidade_resmas) AS total_resmas
      FROM registros r
      JOIN setores s ON r.setor_id = s.id
      WHERE MONTH(r.data) = MONTH(CURRENT_DATE())
        AND YEAR(r.data) = YEAR(CURRENT_DATE())
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

exports.getUltimosLancamentos = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id,
        s.nome AS setor_nome,
        DATE_FORMAT(r.data, '%d/%m/%Y') AS data_formatada
      FROM registros r
      JOIN setores s ON r.setor_id = s.id
      ORDER BY r.data DESC, r.id DESC
      LIMIT 5;
    `;
    const [rows] = await pool.query(query);
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar últimos lançamentos:", err);
    return res.status(500).json({ message: "Erro interno ao buscar últimos lançamentos." });
  }
};