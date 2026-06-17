export const formatCurrency = (amount) => {
  return (
    'EGP ' +
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  );
};
