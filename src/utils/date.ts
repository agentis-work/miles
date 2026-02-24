const toDate = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toLabel = (iso: string, withYear = false) => {
  const date = toDate(iso);
  if (!date) {
    return null;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(withYear ? { year: 'numeric' } : {}),
  });
};

export const formatDateRange = (start?: string, end?: string) => {
  if (!start || !end) {
    return 'Dates to be confirmed';
  }

  const startLabel = toLabel(start);
  const endLabel = toLabel(end, true);

  if (!startLabel || !endLabel) {
    return 'Dates to be confirmed';
  }

  return `${startLabel} - ${endLabel}`;
};

export const getTripDayCount = (start?: string, end?: string) => {
  if (!start || !end) {
    return null;
  }

  const startDate = toDate(start);
  const endDate = toDate(end);

  if (!startDate || !endDate) {
    return null;
  }

  const diff = endDate.getTime() - startDate.getTime();
  if (diff < 0) {
    return null;
  }

  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
};