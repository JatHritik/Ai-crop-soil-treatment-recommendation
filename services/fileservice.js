const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const path = require('path');

const processFile = async (filePath) => {
  try {
    const fileExtension = path.extname(filePath).toLowerCase();
    
    if (fileExtension === '.pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (['.txt', '.doc', '.docx'].includes(fileExtension)) {
      // For text files, read directly
      if (fileExtension === '.txt') {
        const text = await fs.readFile(filePath, 'utf8');
        return text;
      }
      // For doc/docx files, you might want to use additional libraries
      // For now, return a placeholder
      return 'Document uploaded - manual analysis required';
    } else {
      // For image files, return a placeholder
      // You can integrate OCR here if needed
      return 'Image uploaded - visual analysis required';
    }
  } catch (error) {
    console.error('File processing error:', error);
    return 'File uploaded - processing error occurred';
  }
};

module.exports = { processFile };