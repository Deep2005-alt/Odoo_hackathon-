const axios = require('axios');

// In-memory cache for exchange rates
const rateCache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Base currency for conversion
const BASE_CURRENCY = 'USD';

/**
 * Get exchange rate from cache or API
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @returns {Promise<number>} Exchange rate
 */
async function getExchangeRate(from, to) {
  try {
    // Return 1 if currencies are the same
    if (from === to) {
      return 1;
    }

    // Check cache first
    const cacheKey = `${from}_${to}`;
    const cached = rateCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`💰 Using cached rate for ${from} to ${to}`);
      return cached.rate;
    }

    // Fetch from API
    console.log(`💰 Fetching live rate for ${from} to ${to}`);
    const rate = await fetchRateFromAPI(from, to);
    
    // Update cache
    rateCache.set(cacheKey, {
      rate,
      timestamp: Date.now(),
    });

    return rate;
  } catch (error) {
    console.error('Error getting exchange rate:', error.message);
    // Fallback to cached rate or default
    return getCachedOrFallbackRate(from, to);
  }
}

/**
 * Fetch exchange rate from external API
 */
async function fetchRateFromAPI(from, to) {
  try {
    // Using a free exchange rate API (in production, use a paid service)
    const apiKey = process.env.CURRENCY_API_KEY || 'test_api_key';
    
    // Example using exchangerate-api.com (free tier)
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${from}`,
      {
        timeout: 5000,
        headers: {
          'User-Agent': 'ExpenseApp/1.0',
        },
      }
    );

    if (response.data && response.data.rates && response.data.rates[to]) {
      return response.data.rates[to];
    }

    throw new Error('Invalid API response');
  } catch (error) {
    console.warn('API fetch failed, using fallback rates');
    // Fallback to predefined rates
    return getFallbackRate(from, to);
  }
}

/**
 * Get cached or fallback rate when API fails
 */
function getCachedOrFallbackRate(from, to) {
  // Try to find any cached rate
  const cacheKey = `${from}_${to}`;
  const reverseCacheKey = `${to}_${from}`;
  
  const cached = rateCache.get(cacheKey);
  if (cached) {
    return cached.rate;
  }

  // Try reverse rate
  const reverseCached = rateCache.get(reverseCacheKey);
  if (reverseCached) {
    return 1 / reverseCached.rate;
  }

  // Use fallback rates
  return getFallbackRate(from, to);
}

/**
 * Fallback exchange rates (relative to USD)
 * These are approximate rates for offline scenarios
 */
const FALLBACK_RATES = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  CNY: 6.45,
  INR: 74.5,
  MXN: 20.0,
  BRL: 5.25,
  KRW: 1180.0,
  SGD: 1.35,
  HKD: 7.78,
  NOK: 8.85,
  SEK: 8.75,
  DKK: 6.35,
  NZD: 1.42,
  ZAR: 15.0,
  RUB: 73.5,
};

function getFallbackRate(from, to) {
  const fromRate = FALLBACK_RATES[from] || 1;
  const toRate = FALLBACK_RATES[to] || 1;
  
  // Convert from source to USD, then USD to target
  const rate = toRate / fromRate;
  console.log(`⚠️  Using fallback rate for ${from} to ${to}: ${rate}`);
  return rate;
}

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} from - Source currency code
 * @param {string} to - Target currency code
 * @returns {Promise<object>} Conversion result
 */
async function convertCurrency(amount, from, to) {
  try {
    const rate = await getExchangeRate(from, to);
    const convertedAmount = parseFloat((amount * rate).toFixed(2));

    return {
      original: {
        amount: parseFloat(amount),
        currency: from,
      },
      converted: {
        amount: convertedAmount,
        currency: to,
      },
      rate,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Currency conversion error:', error);
    throw new Error('Failed to convert currency');
  }
}

/**
 * Bulk convert multiple amounts
 * @param {Array} items - Array of {amount, from, to} objects
 * @returns {Promise<Array>} Conversion results
 */
async function bulkConvert(items) {
  const results = [];
  
  for (const item of items) {
    try {
      const result = await convertCurrency(item.amount, item.from, item.to);
      results.push(result);
    } catch (error) {
      results.push({
        ...item,
        error: error.message,
      });
    }
  }
  
  return results;
}

/**
 * Clear the rate cache
 */
function clearCache() {
  rateCache.clear();
  console.log('💰 Currency cache cleared');
}

/**
 * Pre-populate cache with common rates
 */
async function prepopulateCache() {
  const commonCurrencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];
  
  console.log('💰 Pre-populating currency cache...');
  
  for (const currency of commonCurrencies) {
    try {
      await getExchangeRate('USD', currency);
      await getExchangeRate(currency, 'USD');
    } catch (error) {
      console.warn(`Failed to cache ${currency}`);
    }
  }
  
  console.log('💰 Cache pre-population complete');
}

module.exports = {
  convertCurrency,
  getExchangeRate,
  bulkConvert,
  clearCache,
  prepopulateCache,
  BASE_CURRENCY,
};
