const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

/**
 * Extract text from receipt image using OCR
 * @param {string} imagePath - Path to the receipt image
 * @returns {Promise<object>} Extracted data from receipt
 */
async function scanReceipt(imagePath) {
  try {
    console.log('🔍 Scanning receipt:', imagePath);

    // Verify file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error('Image file not found');
    }

    // Perform OCR
    const { data: { text, confidence } } = await Tesseract.recognize(
      imagePath,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${(m.progress * 100).toFixed(0)}%`);
          }
        },
      }
    );

    console.log('✅ OCR complete with confidence:', confidence.toFixed(2));

    // Parse extracted text
    const parsedData = parseReceiptText(text);
    parsedData.confidence = confidence;
    parsedData.rawText = text;

    return parsedData;
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('Failed to scan receipt');
  }
}

/**
 * Parse extracted text to find relevant receipt information
 * @param {string} text - Extracted text from OCR
 * @returns {object} Parsed receipt data
 */
function parseReceiptText(text) {
  const lines = text.split('\n');
  
  const result = {
    merchant: null,
    date: null,
    total: null,
    currency: 'USD',
    items: [],
    tax: null,
    subtotal: null,
  };

  // Common patterns for receipt data extraction
  const patterns = {
    // Date patterns
    date: /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b|\b(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/,
    
    // Currency and amount patterns
    total: /(?:total|amount|balance|grand total)[::\s]*\$?([\d,]+\.?\d*)/i,
    singleAmount: /^\$?([\d,]+\.?\d*)$/,
    
    // Tax patterns
    tax: /(?:tax|vat|gst)[::\s]*\$?([\d,]+\.?\d*)/i,
    
    // Subtotal patterns
    subtotal: /(?:subtotal|net)[::\s]*\$?([\d,]+\.?\d*)/i,
  };

  // Extract merchant name (usually first non-empty line)
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !patterns.date.test(trimmed) && !patterns.total.test(trimmed)) {
      // Skip very short or very long lines
      if (trimmed.length > 2 && trimmed.length < 50) {
        result.merchant = trimmed;
        break;
      }
    }
  }

  // Extract date
  for (const line of lines) {
    const dateMatch = patterns.date.exec(line);
    if (dateMatch) {
      result.date = dateMatch[0];
      break;
    }
  }

  // Extract amounts
  let lastAmount = null;
  for (const line of lines) {
    const trimmed = line.trim().toLowerCase();
    
    // Check for total
    const totalMatch = patterns.total.exec(line);
    if (totalMatch) {
      result.total = parseFloat(totalMatch[1].replace(/,/g, ''));
      continue;
    }

    // Check for tax
    const taxMatch = patterns.tax.exec(line);
    if (taxMatch) {
      result.tax = parseFloat(taxMatch[1].replace(/,/g, ''));
      continue;
    }

    // Check for subtotal
    const subtotalMatch = patterns.subtotal.exec(line);
    if (subtotalMatch) {
      result.subtotal = parseFloat(subtotalMatch[1].replace(/,/g, ''));
      continue;
    }

    // Try to extract standalone amounts (potential line items)
    const amountMatch = patterns.singleAmount.exec(line);
    if (amountMatch && !trimmed.includes(':')) {
      const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
      if (amount > 0 && amount < 10000) { // Reasonable item amount
        lastAmount = amount;
        
        // Try to associate with item description
        const prevLine = lines[lines.indexOf(line) - 1];
        if (prevLine && prevLine.trim().length > 0) {
          result.items.push({
            description: prevLine.trim(),
            amount: amount,
          });
        }
      }
    }
  }

  // If no total found but we have amounts, use the largest
  if (!result.total && lastAmount) {
    result.total = lastAmount;
  }

  // Clean up merchant name
  if (result.merchant) {
    result.merchant = result.merchant.replace(/[^\w\s\-&']/g, '').trim();
  }

  return result;
}

/**
 * Process uploaded receipt file and extract data
 * @param {object} file - Uploaded file object
 * @returns {Promise<object>} Extracted receipt data
 */
async function processReceiptFile(file) {
  try {
    if (!file || !file.path) {
      throw new Error('No file provided');
    }

    // Scan the receipt
    const ocrData = await scanReceipt(file.path);

    // Optionally delete the file after processing
    // fs.unlink(file.path, (err) => {
    //   if (err) console.error('Error deleting temp file:', err);
    // });

    return {
      success: true,
      data: ocrData,
      filename: file.originalname || file.name,
      filepath: file.path,
    };
  } catch (error) {
    console.error('Process receipt error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Validate extracted receipt data
 * @param {object} data - Extracted receipt data
 * @returns {object} Validation result
 */
function validateReceiptData(data) {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!data.merchant) {
    warnings.push('Merchant name could not be extracted');
  }

  if (!data.date) {
    warnings.push('Date could not be extracted');
  }

  if (!data.total) {
    errors.push('Total amount could not be extracted');
  }

  // Confidence check
  if (data.confidence < 50) {
    warnings.push(`Low OCR confidence: ${data.confidence.toFixed(0)}%`);
  }

  // Amount validation
  if (data.total && data.total <= 0) {
    errors.push('Total amount must be greater than zero');
  }

  if (data.total && data.total > 999999) {
    errors.push('Total amount seems unusually high');
  }

  // Tax validation
  if (data.tax && data.subtotal) {
    const expectedTotal = data.subtotal + data.tax;
    if (data.total && Math.abs(data.total - expectedTotal) > 0.01) {
      warnings.push('Total does not match subtotal + tax');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

module.exports = {
  scanReceipt,
  processReceiptFile,
  parseReceiptText,
  validateReceiptData,
};
