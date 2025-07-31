const { runQueryWithPagination } = require('../util');

async function getAllActivePublicPromotions(queryParams = {}) {
    const { limit, offset } = queryParams;
    const sql = `SELECT * FROM promotionCode WHERE (enddate IS NULL OR enddate >= TRUNC(SYSDATE)) AND AND startdate >= TRUNC(SYSDATE) AND ispublic = 'T' AND isinactive = 'F'`;
    const results = await runQueryWithPagination(sql, limit, offset);
    return results;
}

async function getPromotionsByProductId(productId, limit, offset) {
    const sql = `SELECT pc.id AS promotioncode_id, pc.code AS promotion_code, pc.name AS promotion_name, pc.startdate, pc.enddate, pc.ispublic, pc.isinactive, pc.fixedprice, pc.itemquantifier, i.id AS item_id, i.itemid AS item_number, i.displayname AS item_displayname FROM promotionCodeDiscountedItems pcdi INNER JOIN promotionCode pc ON pcdi.promotionCode = pc.id INNER JOIN item i ON pcdi.discounteditem = i.id WHERE i.id = '${productId}' AND pc.startdate <= TRUNC(SYSDATE) AND (pc.enddate IS NULL OR pc.enddate >= TRUNC(SYSDATE)) AND pc.isinactive = 'F'`;
    const results = await runQueryWithPagination(sql, limit, offset);
   
    return results.items || [];
}

module.exports = {
    getAllActivePublicPromotions,
    getPromotionsByProductId,
};
