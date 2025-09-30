// src/utils/price.js tính giá giảm 

/**
 * Tính phần trăm giảm giá từ oldPrice và price
 * @param {number} oldPrice - Giá gốc
 * @param {number} price - Giá hiện tại
 * @returns {number} phần trăm giảm, làm tròn xuống (floor)
 */
export function calculateDiscount(oldPrice, price) {
  if (!oldPrice || !price || oldPrice <= price) return 0;
  return Math.floor(((oldPrice - price) / oldPrice) * 100);
}
