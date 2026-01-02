/**
 * Calculate GST for an item
 * @param {number} amount - base amount (qty * price)
 * @param {number} rate - GST rate (default 5% for garments < 1000)
 */
function calculateGST(amount, rate = 5) {
  const gstAmount = (amount * rate) / 100;

  return {
    gstRate: rate,
    gstAmount,
    cgst: gstAmount / 2,
    sgst: gstAmount / 2,
    igst: 0,
    total: amount + gstAmount,
  };
}

module.exports = { calculateGST };
