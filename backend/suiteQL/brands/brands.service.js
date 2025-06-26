const { runQueryWithPagination } = require('../util');

async function getAllBrands(queryParams = {}) {
    const { limit, offset } = queryParams;
    const query = `SELECT id, name FROM Customlist_dnd_web_brands`;
    const results = await runQueryWithPagination(query, [], limit, offset);
    return results;
}

module.exports = {
    getAllBrands,
};
