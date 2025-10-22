export const formatNumber = (value: unknown, locale = 'en-US') => {
  const n = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(n) ? n.toLocaleString(locale) : '0';
};

export const formatDateTime = (
  value: unknown,
  locale = 'en-US',
  options?: Intl.DateTimeFormatOptions
) => {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value as any);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString(locale, options);
};