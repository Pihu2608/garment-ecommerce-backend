// utils/gstUtils.js

/**
 * Calculate GST for a given amount
 * @param {number} amount - Base amount (qty * price)
 * @param {number} rate - GST rate (default 18%)
 * @returns {object} GST breakup
 */
function calculateGST(amount, rate = 18) {
  const safeAmount = Number(amount) || 0;
  const safeRate = Number(rate) || 0;

  const gstAmount = (safeAmount * safeRate) / 100;

  return {
    gstRate: safeRate,                    // e.g. 18
    gstAmount: Number(gstAmount.toFixed(2)),
    cgst: Number((gstAmount / 2).toFixed(2)),
    sgst: Number((gstAmount / 2).toFixed(2)),
  };
}

module.exports = { calculateGST };
