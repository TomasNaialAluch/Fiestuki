export const formatPrice = (price) => {
  return price?.toLocaleString();
};

export const formatPriceWithoutTax = (price) => {
  return Math.round(price / 1.215)?.toLocaleString();
};