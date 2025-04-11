const PDFDocument = require('pdfkit');

exports.saveSuggestionAsPDF = async (req, res) => {
  const { suggestion, doctor } = req.body;

  const doc = new PDFDocument();
  const chunks = [];

  doc.on('data', chunk => chunks.push(chunk));
  doc.on('end', () => {
    const pdfData = Buffer.concat(chunks);
    res.setHeader('Content-Disposition', 'attachment; filename=suggestion.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfData);
  });

  doc.fontSize(16).text('AI Symptom Checker Result', { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Suggestion: ${suggestion}`);
  doc.moveDown();
  doc.fontSize(12).text(`Recommended Doctor: ${doctor}`);
  doc.end();
};
