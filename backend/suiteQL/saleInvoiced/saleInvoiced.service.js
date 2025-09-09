const { runQueryWithPagination, filterUniqueByKey } = require("../util");
class SaleInvoicedService {
  async getTopSalesInvoiced(limit = 10, fromDate = "2024-01-01") {
    const sql = `SELECT item, amount FROM salesInvoiced WHERE item IS NOT NULL AND amount IS NOT NULL AND trandate >= TO_DATE('${fromDate}', 'YYYY-MM-DD') ORDER BY amount DESC FETCH FIRST ${limit} ROWS ONLY`;
    const result = await runQueryWithPagination(sql, limit, 0);
    const uniqueItems = filterUniqueByKey(result.items, "item", limit);

    return {
      count: uniqueItems.length,
      hasMore: uniqueItems.length < result.items.length,
      items: uniqueItems,
      offset: 0,
      totalResults: uniqueItems.length,
    };
  }

  async getTopSalesWithDetails(limit = 10, fromDate = "2024-01-01") {
    const sql = `SELECT s.item as id, s.amount, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.custitemcustitem_dnd_brand, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, ip.price FROM (SELECT item, amount, ROW_NUMBER() OVER (PARTITION BY item ORDER BY amount DESC) AS rn FROM salesInvoiced WHERE item IS NOT NULL AND amount IS NOT NULL AND trandate >= TO_DATE('${fromDate}', 'YYYY-MM-DD')) s JOIN item i ON s.item = i.id LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE s.rn = 1 AND i.itemType = 'InvtPart' ORDER BY s.amount DESC FETCH FIRST ${limit} ROWS ONLY`;

    const result = await runQueryWithPagination(sql, limit, 0);
    return result;
  }
}

module.exports = new SaleInvoicedService();
