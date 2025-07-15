const { runQueryWithPagination } = require('../util');

class ItemsService {
    constructor() {
        this.recordType = 'item';
    }

    // Helper method for generating sort clause
    _getSortBy(sort) {
        const allowedOrders = ['asc', 'desc'];
        if (sort && allowedOrders.includes(sort.toLowerCase())) {
            return ` ORDER BY ip.price ${sort.toLowerCase()}`;
        } else {
            return ` ORDER BY i.itemid ASC`;
        }
    }

    // Generalized method for filtering by a field
    async findByField(field, value, limit, offset, sort) {
        const allowedFields = {
            class: 'i.class',
            brand: 'i.custitemcustitem_dnd_brand',
            name: 'i.itemid'
        };
        const sortBy = this._getSortBy(sort);
        if (!allowedFields[field]) {
            throw new Error('Invalid filter field');
        }

        let condition;
        if (field === "name") {
            // Substring search, case-insensitive
            condition = `LOWER(${allowedFields[field]}) LIKE '%' || LOWER('${value}') || '%'`;
        } else {
            // Exact match, case-insensitive
            condition = `LOWER(${allowedFields[field]}) = LOWER('${value}')`;
        }

        const sql = `SELECT i.id, i.itemid, i.totalquantityonhand, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1 WHERE i.isonline = 'T' AND i.isinactive = 'F' AND ${condition} ${sortBy}`;

        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }


    // Find items by both class and brand
    async findByClassAndBrand(classId, brand, limit, offset, sort) {
        const sortBy = this._getSortBy(sort);
        const sql = `SELECT i.id, i.itemid, i.totalquantityonhand, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1 WHERE i.isonline = 'T' AND i.isinactive='F' AND i.class='${classId}' AND i.custitemcustitem_dnd_brand='${brand}' ${sortBy}`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }

    async findById(itemId) {
        const sql = `SELECT i.id, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.storedetaileddescription, i.custitemcustitem_dnd_brand AS branditem, i.totalquantityonhand, i.stockdescription, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, ip.item, ip.price FROM item i LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE i.id = '${itemId}' AND i.isinactive='F' AND i.isonline = 'T'`;

        const result = await runQueryWithPagination(sql, 1, 0);
        return result.items?.[0] || null;
    }
    async findByParent(parent) {
        const sql = `SELECT i.id, i.itemid, i.custitem38 FROM item i WHERE i.custitem39 = '${parent}' AND i.isinactive = 'F' AND i.isonline = 'T' ORDER BY i.custitem40`;

        const result = await runQueryWithPagination(sql);
        return result.items || [];
    }
    // Get items by multiple ids
    async findByIds(itemIds = []) {
        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            throw new Error('itemIds must be a non-empty array');
        }
        const idsString = itemIds.map(id => `'${id}'`).join(",");
        const sql = `SELECT i.id, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.custitemcustitem_dnd_brand AS branditem, i.totalquantityonhand, i.stockdescription, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i WHERE i.id IN (${idsString}) AND i.isinactive='F' AND i.isonline = 'T';`;
        const results = await runQueryWithPagination(sql, itemIds.length, 0);
        return results.items || [];
    }

    async findByNameLike(name, limit, offset) {
        // Use the same fields as other item queries
        const sql = `SELECT i.id, i.itemid FROM item i WHERE LOWER(i.itemid) LIKE '%' || LOWER('${name}') || '%' AND i.isinactive='F' AND i.isonline = 'T' ORDER BY i.itemid ASC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results;
    }
    // Generalized count method for class or brand
    async countByField(field, value) {
        const allowedFields = {
            class: 'i.class',
            brand: 'i.custitemcustitem_dnd_brand',
            name: 'i.itemid'
        };
        let sql;

        if (field === "name") {
            sql = `SELECT COUNT(*) AS count FROM item i WHERE i.isonline = 'T' AND i.isinactive = 'F' AND LOWER(${allowedFields[field]}) LIKE '%' || LOWER('${value}') || '%';`;
        } else {
            sql = `SELECT COUNT(*) AS count FROM item i WHERE i.isonline = 'T' AND i.isinactive = 'F' AND LOWER(${allowedFields[field]}) = LOWER('${value}');`;
        }

        const results = await runQueryWithPagination(sql, 1, 0);
        return results.items?.[0]?.count || 0;
    }

    // Find items by category
    async findByCategory(category, limit, offset, sort) {
        const sortBy = this._getSortBy(sort);
        const sql = `SELECT i.id, i.itemid, i.totalquantityonhand, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i INNER JOIN CommerceCategoryItemAssociation cc ON cc.item = i.id INNER JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE cc.category = '${category}' AND i.isonline = 'T' AND i.isinactive = 'F' ${sortBy}`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }

    // Find items by user order history
    async findByUserOrderHistory(id, limit, offset) {
        const sql = `SELECT i.id, i.itemid, i.totalquantityonhand, ip.price, tli.linecreateddate, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM (SELECT tl.item, MAX(tl.linecreateddate) AS linecreateddate FROM transactionLine tl WHERE tl.itemtype = 'InvtPart' AND tl.entity = '${id}' GROUP BY tl.item) tli JOIN item i ON tli.item = i.id LEFT JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1 ORDER BY tli.linecreateddate DESC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }
}

module.exports = new ItemsService();