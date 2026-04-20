function nextId(items) {
  const maxId = items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
  return maxId + 1;
}

module.exports = { nextId };
