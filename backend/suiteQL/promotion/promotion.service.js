const { runQueryWithPagination } = require('../util');

async function getAllActivePublicPromotions(queryParams = {}) {
    const { limit, offset } = queryParams;
    const sql = `SELECT * FROM promotionCode WHERE (enddate IS NULL OR enddate >= TRUNC(SYSDATE)) AND ispublic = 'T' AND isinactive = 'F'`;
    const results = await runQueryWithPagination(sql, limit, offset);
    return results;
}

module.exports = {
    getAllActivePublicPromotions,
};
