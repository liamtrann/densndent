const { runQueryWithPagination } = require("../util");

// Helper method for generating sort clause (similar to item.service.js)
function _getSortBy(sort) {
  const allowedOrders = ["asc", "desc"];
  if (sort && allowedOrders.includes(sort.toLowerCase())) {
    return ` ORDER BY ip.price ${sort.toLowerCase()}`;
  } else {
    return ` ORDER BY i.itemid ASC`;
  }
}

async function getAllActivePublicPromotions(queryParams = {}) {
  const { limit, offset } = queryParams;
  const sql = `SELECT * FROM promotionCode WHERE (enddate IS NULL OR enddate >= TRUNC(SYSDATE)) AND startdate <= TRUNC(SYSDATE) AND ispublic = 'T' AND isinactive = 'F'`;
  const results = await runQueryWithPagination(sql, limit, offset);
  return results;
}

async function getPromotionsByProductId(productId, limit, offset) {
  const sql = `SELECT pc.id AS promotioncode_id, pc.code AS promotion_code, pc.name AS promotion_name, pc.startdate, pc.enddate, pc.ispublic, pc.isinactive, pc.fixedprice, pc.itemquantifier, i.id AS item_id, i.itemid AS item_number, i.displayname AS item_displayname FROM promotionCodeDiscountedItems pcdi INNER JOIN promotionCode pc ON pcdi.promotionCode = pc.id INNER JOIN item i ON pcdi.discounteditem = i.id WHERE i.id = '${productId}' AND pc.startdate <= TRUNC(SYSDATE) AND (pc.enddate IS NULL OR pc.enddate >= TRUNC(SYSDATE)) AND pc.isinactive = 'F'`;
  const results = await runQueryWithPagination(sql, limit, offset);

  return results.items || [];
}

async function getAllProductsWithActivePromotions(
  limit,
  offset,
  sort,
  minPrice,
  maxPrice
) {
  // Build filter conditions
  let conditions = [
    `i.isinactive = 'F'`,
    `i.isonline = 'T'`,
    `pc.startdate <= TRUNC(SYSDATE)`,
    `(pc.enddate IS NULL OR pc.enddate >= TRUNC(SYSDATE))`,
    `pc.isinactive = 'F'`,
  ];

  // Price range filter
  if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
    conditions.push(`ip.price >= ${parseFloat(minPrice)}`);
  }
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
    conditions.push(`ip.price <= ${parseFloat(maxPrice)}`);
  }

  // Sorting
  const sortBy = _getSortBy(sort);

  // Combine fields from findByIds and promotion data from getPromotionsByProductId
  const sql = `SELECT i.id, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.custitemcustitem_dnd_brand AS branditem, i.totalquantityonhand, i.stockdescription, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, ip.item, ip.price, pc.id AS promotioncode_id, pc.code AS promotion_code, pc.name AS promotion_name, TO_CHAR(pc.startdate,'YYYY-MM-DD') AS startdate, TO_CHAR(pc.enddate,'YYYY-MM-DD') AS enddate, pc.ispublic, pc.isinactive, pc.fixedprice, pc.itemquantifier FROM promotionCodeDiscountedItems pcdi INNER JOIN promotionCode pc ON pcdi.promotionCode = pc.id INNER JOIN item i ON pcdi.discounteditem = i.id LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE ${conditions.join(" AND ")} ${sortBy}`;

  const results = await runQueryWithPagination(sql, limit, offset);
  return results.items || [];
}

async function countProductsWithActivePromotions(minPrice, maxPrice) {
  // Build filter conditions
  let conditions = [
    `i.isinactive = 'F'`,
    `i.isonline = 'T'`,
    `pc.startdate <= TRUNC(SYSDATE)`,
    `(pc.enddate IS NULL OR pc.enddate >= TRUNC(SYSDATE))`,
    `pc.isinactive = 'F'`,
  ];

  // Price range filter
  if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
    conditions.push(`ip.price >= ${parseFloat(minPrice)}`);
  }
  if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
    conditions.push(`ip.price <= ${parseFloat(maxPrice)}`);
  }

  const sql = `SELECT COUNT(DISTINCT i.id) AS count FROM promotionCodeDiscountedItems pcdi INNER JOIN promotionCode pc ON pcdi.promotionCode = pc.id INNER JOIN item i ON pcdi.discounteditem = i.id LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE ${conditions.join(" AND ")}`;

  const results = await runQueryWithPagination(sql, 1, 0);
  return results.items?.[0]?.count || 0;
}

module.exports = {
  getAllActivePublicPromotions,
  getPromotionsByProductId,
  getAllProductsWithActivePromotions,
  countProductsWithActivePromotions,
};
