const netsuiteService = require("./netsuite.service");

function runQueryWithPagination(sql, limit, offset) {
  const params = {};
  if (limit) params.limit = limit;
  if (offset) params.offset = offset;
  return netsuiteService.querySuiteQL(sql, params);
}

module.exports = {
  runQueryWithPagination,
};