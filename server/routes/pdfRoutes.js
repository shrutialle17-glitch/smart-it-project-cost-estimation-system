const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { generatePDF } = require('../controllers/pdfController');

const router = express.Router();

router.get('/estimation/:id', protect, generatePDF);

module.exports = router;
