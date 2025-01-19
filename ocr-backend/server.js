const express = require('express');
const Tesseract = require('tesseract.js');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit to handle large Base64 strings

// Route to process Base64 image and extract text
app.post('/extract-text', async (req, res) => {
  const { base64Image } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: 'Base64 image data is required' });
  }

  try {
    console.log('Starting OCR...');
    const result = await Tesseract.recognize(
      Buffer.from(base64Image, 'base64'), // Convert Base64 to Buffer
      'eng', // Language for OCR (e.g., English)
      {
        logger: (info) => console.log(info), // Logs progress
      }
    );

    const extractedText = result.data.text; // Extracted text
    console.log('OCR Complete:', extractedText);

    res.json({ text: extractedText });
  } catch (error) {
    console.error('Error during OCR:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`OCR backend server is running on http://localhost:${PORT}`);
});