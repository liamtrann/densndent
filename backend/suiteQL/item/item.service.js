const netsuiteService = require('../netsuite.service');
const { runQueryWithPagination } = require('../util');

class ItemsService {
    constructor() {
        this.recordType = 'item';
    }
    // Get items by class
    async findByClass(classId, limit, offset) {
        const sql = `SELECT i.id, i.class, i.manufacturer, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i WHERE i.isonline = 'T' AND i.class = ${classId};`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results;
    }
    // Get item by id
    async findById(itemId) {
        const sql = `SELECT i.id, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.storedetaileddescription, i.custitemcustitem_dnd_brand, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i WHERE i.id = ${itemId};`;
        const results = await runQueryWithPagination(sql, 1, 0);
        return results;
    }
    // Get items by multiple ids
    async findByIds(itemIds = []) {
        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            throw new Error('itemIds must be a non-empty array');
        }
        const idsString = itemIds.map(id => `'${id}'`).join(",");
        const sql = `SELECT i.id, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.custitemcustitem_dnd_brand, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i WHERE i.id IN (${idsString});`;
        const results = await runQueryWithPagination(sql, itemIds.length, 0);
        return results;
    }
}

module.exports = new ItemsService();