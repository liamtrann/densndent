const netsuiteService = require('../suiteql.service');
const { runQueryWithPagination } = require('../util');

class ItemsService {
    constructor() {
        this.recordType = 'item';
    }
    // Get items by class
    async findByClass(classId, limit, offset) {
        const sql = `SELECT i.id, i.itemid, i.totalquantityonhand, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1 WHERE i.isonline = 'T' AND i.class =${classId}`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results;
    }
    // Get item by id
    async findById(itemId) {
        const sql = `SELECT i.id, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.storedetaileddescription, i.custitemcustitem_dnd_brand, i.totalquantityonhand, i.stockdescription, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i WHERE i.id = ${itemId};`;
        const results = await runQueryWithPagination(sql, 1, 0);
        return results;
    }
    // Get items by multiple ids
    async findByIds(itemIds = []) {
        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            throw new Error('itemIds must be a non-empty array');
        }
        const idsString = itemIds.map(id => `'${id}'`).join(",");
        const sql = `SELECT i.id, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.custitemcustitem_dnd_brand, i.totalquantityonhand, i.stockdescription, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i WHERE i.id IN (${idsString});`;
        const results = await runQueryWithPagination(sql, itemIds.length, 0);
        return results;
    }

    async findItemByIdWithBasePrice(itemId) {
        const sql = `SELECT i.id, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.storedetaileddescription, i.custitemcustitem_dnd_brand, i.totalquantityonhand, i.stockdescription, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, ip.item, ip.price, ip.priceqty FROM item i LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE i.id = ${itemId}`;

        const result = await runQueryWithPagination(sql, 1, 0);
        return result.items?.[0] || null;
    }

    async findByNameLike(name) {
        // Use the same fields as other item queries
        const sql = `SELECT i.id, i.itemid FROM item i WHERE LOWER(i.itemid) LIKE '%' || LOWER('${name}') || '%' ORDER BY i.itemid ASC
`;
        const results = await runQueryWithPagination(sql);
        return results;
    }
    // Get count of items by class
    async countByClass(classId) {
        const sql = `SELECT COUNT(*) AS count FROM item i WHERE i.isonline = 'T' AND i.class = ${classId};`;
        const results = await runQueryWithPagination(sql, 1, 0);
        return results.items?.[0]?.count || 0;
    }
}

module.exports = new ItemsService();