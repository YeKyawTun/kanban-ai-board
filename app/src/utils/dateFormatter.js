function normalizeDueDate(value) {
  if (!value) return null;
  if (typeof value === 'string') return value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function nowIso() {
  return new Date().toISOString();
}

module.exports = {
  normalizeDueDate,
  nowIso
};
