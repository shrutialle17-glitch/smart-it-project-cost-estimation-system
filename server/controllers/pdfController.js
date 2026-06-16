const Estimation = require('../models/Estimation');
const User = require('../models/User');
const { generateEstimationPDF } = require('../services/pdfService');
const path = require('path');
const fs = require('fs');

const generatePDF = async (req, res, next) => {
  try {
    const estimation = await Estimation.findById(req.params.id).populate('projectType');
    if (!estimation) return res.status(404).json({ success: false, message: 'Estimation not found' });

    // Only the client who owns the estimation or an admin can generate the PDF
    if (req.user.role === 'client' && estimation.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const client = await User.findById(estimation.client);
    const filePath = await generateEstimationPDF(estimation, client);

    // Update estimation with PDF path
    estimation.pdfPath = filePath;
    await estimation.save();

    // Stream the PDF file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (error) { next(error); }
};

module.exports = { generatePDF };
