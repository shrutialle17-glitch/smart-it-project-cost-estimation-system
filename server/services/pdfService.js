const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Generate a professional PDF quotation for an estimation.
 * Uses PDFKit to create a branded PDF with cost breakdown, timeline, and tech stack.
 *
 * @param {object} estimation - Full estimation document (populated)
 * @param {object} client - Client user document
 * @returns {Promise<string>} Path to the generated PDF file
 */
const generateEstimationPDF = async (estimation, client) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfDir = process.env.PDF_OUTPUT_DIR || './pdfs';
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }

      // Generate quotation number: QT-YYYY-XXXXXX
      const year = new Date().getFullYear();
      const randomId = crypto.randomUUID().replace(/-/g, '').substring(0, 6).toUpperCase();
      const quotationNumber = `QT-${year}-${randomId}`;

      const fileName = `${quotationNumber}.pdf`;
      const filePath = path.join(pdfDir, fileName);

      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `Quotation - ${estimation.projectName}`,
          Author: 'Smart Estimate Pro',
          Subject: 'IT Project Cost Estimation',
        },
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // ---- Header ----
      doc.rect(0, 0, doc.page.width, 100).fill('#4F46E5');
      doc.fontSize(24).fillColor('#FFFFFF').font('Helvetica-Bold')
        .text('Smart Estimate Pro', 50, 30);
      doc.fontSize(10).fillColor('#C7D2FE').font('Helvetica')
        .text('Professional IT Project Cost Estimation', 50, 60);
      doc.fontSize(10).fillColor('#C7D2FE')
        .text(quotationNumber, doc.page.width - 200, 35, { width: 150, align: 'right' });
      doc.fontSize(9).fillColor('#C7D2FE')
        .text(`Generated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, doc.page.width - 200, 55, { width: 150, align: 'right' });

      doc.fillColor('#1E293B'); // Reset text color
      let y = 120;

      // ---- Client Details ----
      doc.fontSize(12).font('Helvetica-Bold').text('Client Details', 50, y);
      y += 20;
      doc.fontSize(10).font('Helvetica');
      doc.text(`Name: ${client.name}`, 50, y);
      y += 15;
      if (client.company) {
        doc.text(`Company: ${client.company}`, 50, y);
        y += 15;
      }
      doc.text(`Email: ${client.email}`, 50, y);
      y += 25;

      // ---- Project Details ----
      doc.fontSize(12).font('Helvetica-Bold').text('Project Details', 50, y);
      y += 20;
      doc.fontSize(10).font('Helvetica');
      doc.text(`Project Name: ${estimation.projectName}`, 50, y);
      y += 15;
      const ptName = typeof estimation.projectType === 'object' ? (estimation.projectType.name || 'Unknown') : String(estimation.projectType).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      doc.text(`Project Type: ${ptName}`, 50, y);
      y += 15;
      doc.text(`Complexity: ${estimation.complexity.level.toUpperCase()} (Score: ${estimation.complexity.score})`, 50, y);
      y += 30;

      // ---- Cost Breakdown Table ----
      doc.fontSize(12).font('Helvetica-Bold').text('Cost Breakdown', 50, y);
      y += 20;

      // Table header
      const tableLeft = 50;
      const colWidths = [200, 80, 80, 120];
      doc.rect(tableLeft, y, 480, 22).fill('#4F46E5');
      doc.fontSize(9).fillColor('#FFFFFF').font('Helvetica-Bold');
      doc.text('Item', tableLeft + 8, y + 6, { width: colWidths[0] });
      doc.text('Hours', tableLeft + colWidths[0] + 8, y + 6, { width: colWidths[1] });
      doc.text('Rate', tableLeft + colWidths[0] + colWidths[1] + 8, y + 6, { width: colWidths[2] });
      doc.text('Cost', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 8, y + 6, { width: colWidths[3] });
      y += 22;

      doc.fillColor('#1E293B').font('Helvetica').fontSize(9);

      // Base project row
      const bgLight = '#F8FAFC';
      const bgWhite = '#FFFFFF';
      doc.rect(tableLeft, y, 480, 20).fill(bgLight);
      doc.fillColor('#1E293B');
      doc.text('Base Project Setup', tableLeft + 8, y + 5, { width: colWidths[0] });
      doc.text(`${estimation.calculation.baseHours}`, tableLeft + colWidths[0] + 8, y + 5, { width: colWidths[1] });
      doc.text(`₹${estimation.calculation.hourlyRate}/hr`, tableLeft + colWidths[0] + colWidths[1] + 8, y + 5, { width: colWidths[2] });
      doc.text(`₹${estimation.calculation.baseCost.toLocaleString('en-IN')}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 8, y + 5, { width: colWidths[3] });
      y += 20;

      // Feature rows
      estimation.selectedFeatures.forEach((f, i) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
        doc.rect(tableLeft, y, 480, 20).fill(i % 2 === 0 ? bgWhite : bgLight);
        doc.fillColor('#1E293B');
        doc.text(f.name, tableLeft + 8, y + 5, { width: colWidths[0] });
        doc.text(`${f.hours}`, tableLeft + colWidths[0] + 8, y + 5, { width: colWidths[1] });
        doc.text(`₹${estimation.calculation.hourlyRate}/hr`, tableLeft + colWidths[0] + colWidths[1] + 8, y + 5, { width: colWidths[2] });
        doc.text(`₹${f.cost.toLocaleString('en-IN')}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 8, y + 5, { width: colWidths[3] });
        y += 20;
      });

      y += 5;

      // Totals section
      const totalsX = tableLeft + colWidths[0] + colWidths[1];
      doc.fontSize(9).font('Helvetica');
      doc.text('Subtotal:', totalsX + 8, y, { width: colWidths[2] });
      doc.text(`₹${(estimation.calculation.baseCost + estimation.calculation.featureCost).toLocaleString('en-IN')}`, totalsX + colWidths[2] + 8, y, { width: colWidths[3] });
      y += 15;
      doc.text(`Complexity (×${estimation.calculation.complexityMultiplier}):`, totalsX + 8, y, { width: colWidths[2] });
      doc.text(`₹${estimation.calculation.subtotal.toLocaleString('en-IN')}`, totalsX + colWidths[2] + 8, y, { width: colWidths[3] });
      y += 15;
      doc.text(`Tax (${(estimation.calculation.taxRate * 100).toFixed(0)}%):`, totalsX + 8, y, { width: colWidths[2] });
      doc.text(`₹${estimation.calculation.taxAmount.toLocaleString('en-IN')}`, totalsX + colWidths[2] + 8, y, { width: colWidths[3] });
      y += 20;

      // Grand total
      doc.rect(totalsX, y, colWidths[2] + colWidths[3], 25).fill('#4F46E5');
      doc.fontSize(11).fillColor('#FFFFFF').font('Helvetica-Bold');
      doc.text('TOTAL:', totalsX + 8, y + 6, { width: colWidths[2] });
      doc.text(`₹${estimation.calculation.totalCost.toLocaleString('en-IN')}`, totalsX + colWidths[2] + 8, y + 6, { width: colWidths[3] });
      y += 40;

      doc.fillColor('#1E293B');

      // ---- Timeline ----
      if (y > 650) { doc.addPage(); y = 50; }
      doc.fontSize(12).font('Helvetica-Bold').text('Project Timeline', 50, y);
      y += 5;
      doc.fontSize(10).font('Helvetica')
        .text(`Estimated Duration: ${estimation.timeline.totalWeeks} weeks`, 50, y + 15);
      y += 35;

      estimation.timeline.phases.forEach((phase) => {
        if (y > 720) { doc.addPage(); y = 50; }
        doc.fontSize(9).font('Helvetica-Bold').text(`${phase.name} — ${phase.weeks} week(s)`, 60, y);
        doc.fontSize(8).font('Helvetica').fillColor('#64748B').text(phase.description, 60, y + 12);
        doc.fillColor('#1E293B');
        y += 28;
      });

      y += 10;

      // ---- Tech Stack ----
      if (y > 650) { doc.addPage(); y = 50; }
      doc.fontSize(12).font('Helvetica-Bold').text('Recommended Tech Stack', 50, y);
      y += 20;
      doc.fontSize(9).font('Helvetica');
      const ts = estimation.recommendedTechStack;
      if (ts.frontend && ts.frontend.length) { doc.text(`Frontend: ${ts.frontend.join(', ')}`, 60, y); y += 15; }
      if (ts.backend && ts.backend.length) { doc.text(`Backend: ${ts.backend.join(', ')}`, 60, y); y += 15; }
      if (ts.database && ts.database.length) { doc.text(`Database: ${ts.database.join(', ')}`, 60, y); y += 15; }
      if (ts.mobile && ts.mobile.length) { doc.text(`Mobile: ${ts.mobile.join(', ')}`, 60, y); y += 15; }
      if (ts.devops && ts.devops.length) { doc.text(`DevOps: ${ts.devops.join(', ')}`, 60, y); y += 15; }

      // ---- Footer ----
      y = doc.page.height - 80;
      doc.rect(0, y, doc.page.width, 80).fill('#F1F5F9');
      doc.fontSize(8).fillColor('#64748B').font('Helvetica');
      doc.text('Terms & Conditions: This quotation is valid for 30 days from the date of generation.', 50, y + 10, { width: doc.page.width - 100 });
      doc.text('Prices are estimates and may vary based on final project scope and requirements.', 50, y + 22);
      doc.text('© Smart Estimate Pro. All rights reserved.', 50, y + 40);
      doc.text('_________________________', doc.page.width - 200, y + 35, { width: 150, align: 'right' });
      doc.text('Authorized Signature', doc.page.width - 200, y + 50, { width: 150, align: 'right' });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateEstimationPDF };
