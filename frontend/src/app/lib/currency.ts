const VND_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const LEGACY_USD_TO_VND_RATE = 26000;
const LEGACY_PRICE_THRESHOLD = 100000;

export function normalizeCatalogPriceVnd(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return value > 0 && value < LEGACY_PRICE_THRESHOLD
    ? Math.round(value * LEGACY_USD_TO_VND_RATE)
    : Math.round(value);
}

export function formatVnd(value: number) {
  return VND_FORMATTER.format(value);
}

export function formatCatalogPriceVnd(value: number) {
  return formatVnd(normalizeCatalogPriceVnd(value));
}
