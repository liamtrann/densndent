const netsuiteService = require("./netsuite.service");

function runQueryWithPagination(sql, limit, offset) {
  const params = {};
  if (limit) params.limit = limit;
  if (offset) params.offset = offset;
  return netsuiteService.querySuiteQL(sql, params);
}

function filterUniqueByKey(items, key, limit) {
  const seen = new Set();
  const unique = [];

  for (const item of items) {
    const value = item[key];
    if (!seen.has(value)) {
      seen.add(value);
      unique.push(item);
      if (limit && unique.length >= limit) break;
    }
  }

  return unique;
}

module.exports = {
  runQueryWithPagination,
  filterUniqueByKey
};
