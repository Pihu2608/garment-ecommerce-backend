// utils/gstUtils.js

function calculateGST(total, rate = 12) {
  const gstAmount = (total * rate) / 100;
  const half = gstAmount / 2;

  return {
    taxable: total,
    gstRate: rate,
    cgst: half,
    sgst: half,
    igst: 0,
    totalWithGST: total + gstAmount,
  };
}

module.exports = calculateGST;
