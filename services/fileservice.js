const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const path = require('path');
const crypto = require('crypto');

// File processing cache to avoid reprocessing same files
const fileCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Supported file types and their processors
const FILE_PROCESSORS = {
  '.pdf': 'processPDF',
  '.txt': 'processText',
  '.doc': 'processDocument',
  '.docx': 'processDocument',
  '.jpg': 'processImage',
  '.jpeg': 'processImage',
  '.png': 'processImage',
  '.gif': 'processImage',
  '.bmp': 'processImage',
  '.tiff': 'processImage',
};

// Generate cache key for file
const generateCacheKey = (filePath, fileSize, lastModified) => {
  return crypto
    .createHash('md5')
    .update(`${filePath}-${fileSize}-${lastModified}`)
    .digest('hex');
};

// Check if cache entry is valid
const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_TTL;
};

// PDF processing with optimization
const processPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer, {
      // PDF parsing options for better performance
      max: 0, // Parse all pages
      version: 'v1.10.100', // Use specific PDF version
    });
    
    // Clean and optimize extracted text
    return data.text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();
  } catch (error) {
    console.error('PDF processing error:', error);
    throw new Error('Failed to process PDF file');
  }
};

// Text file processing
const processText = async (filePath) => {
  try {
    const text = await fs.readFile(filePath, 'utf8');
    return text.trim();
  } catch (error) {
    console.error('Text processing error:', error);
    throw new Error('Failed to process text file');
  }
};

// Document processing (placeholder for future implementation)
const processDocument = async (filePath) => {
  // TODO: Implement doc/docx processing with mammoth or similar library
  return 'Document uploaded - manual analysis required';
};

// Image processing (placeholder for future OCR implementation)
const processImage = async (filePath) => {
  // TODO: Implement OCR with Tesseract.js or similar
  return 'Image uploaded - visual analysis required';
};

// Main file processing function with caching and optimization
const processFile = async (filePath) => {
  try {
    // Get file stats for cache key
    const stats = await fs.stat(filePath);
    const cacheKey = generateCacheKey(filePath, stats.size, stats.mtime.getTime());
    
    // Check cache first
    if (fileCache.has(cacheKey)) {
      const cacheEntry = fileCache.get(cacheKey);
      if (isCacheValid(cacheEntry)) {
        console.log(`📁 Using cached result for: ${path.basename(filePath)}`);
        return cacheEntry.data;
      } else {
        // Remove expired cache entry
        fileCache.delete(cacheKey);
      }
    }
    
    const fileExtension = path.extname(filePath).toLowerCase();
    const processor = FILE_PROCESSORS[fileExtension];
    
    if (!processor) {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }
    
    console.log(`🔄 Processing file: ${path.basename(filePath)} (${fileExtension})`);
    const startTime = Date.now();
    
    let extractedText;
    switch (processor) {
      case 'processPDF':
        extractedText = await processPDF(filePath);
        break;
      case 'processText':
        extractedText = await processText(filePath);
        break;
      case 'processDocument':
        extractedText = await processDocument(filePath);
        break;
      case 'processImage':
        extractedText = await processImage(filePath);
        break;
      default:
        throw new Error(`Unknown processor: ${processor}`);
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ File processed in ${processingTime}ms: ${path.basename(filePath)}`);
    
    // Cache the result
    fileCache.set(cacheKey, {
      data: extractedText,
      timestamp: Date.now(),
    });
    
    // Clean up old cache entries periodically
    if (fileCache.size > 100) {
      cleanupCache();
    }
    
    return extractedText;
  } catch (error) {
    console.error('File processing error:', error);
    throw new Error(`File processing failed: ${error.message}`);
  }
};

// Clean up expired cache entries
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, entry] of fileCache.entries()) {
    if (!isCacheValid(entry)) {
      fileCache.delete(key);
    }
  }
  console.log(`🧹 Cache cleanup completed. Entries: ${fileCache.size}`);
};

// Get file processing statistics
const getProcessingStats = () => {
  return {
    cacheSize: fileCache.size,
    cacheEntries: Array.from(fileCache.keys()),
  };
};

// Clear cache (useful for testing or manual cleanup)
const clearCache = () => {
  fileCache.clear();
  console.log('🗑️ File processing cache cleared');
};

module.exports = { 
  processFile, 
  getProcessingStats, 
  clearCache,
  FILE_PROCESSORS 
};