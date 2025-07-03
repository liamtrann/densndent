const netsuiteService = require('../suiteql.service');
const { runQueryWithPagination } = require('../util');

class ItemsService {
    constructor() {
        this.recordType = 'item';
    }
    // Get items by class
    async findByClass(classId, limit, offset) {
        const sql = `SELECT i.id, i.class, i.manufacturer, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.totalquantityonhand, i.stockdescription, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i WHERE i.isonline = 'T' AND i.class = ${classId};`;
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
        const sql = `SELECT i.id, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.storedetaileddescription, i.custitemcustitem_dnd_brand, i.totalquantityonhand, i.stockdescription, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, p.quantity, p.saleunit, p.priceqty, p.unitprice FROM item i LEFT JOIN (SELECT item, quantity, saleunit, priceqty, unitprice FROM pricing WHERE item = ${itemId} FETCH FIRST 1 ROWS ONLY) p ON p.item = i.id WHERE i.id = ${itemId}`;

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
}

module.exports = new ItemsService();