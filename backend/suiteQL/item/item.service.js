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

    // Generalized method for filtering by a field and price range, with pagination and sorting
    async findByField(field, value, limit, offset, sort, minPrice, maxPrice) {
        // Allowed fields for filtering (maps logical name to DB column)
        const allowedFields = {
            class: 'i.class',
            brand: 'i.custitemcustitem_dnd_brand',
            name: 'i.itemid'
        };

        // Get DB column for the field
        const column = allowedFields[field];
        if (!column) {
            throw new Error('Invalid filter field');
        }

        // Build filter conditions
        let conditions = [`i.isonline = 'T'`, `i.isinactive = 'F'`];

        // Field-based filter
        if (field === "name") {
            conditions.push(`LOWER(${column}) LIKE '%' || LOWER('${value}') || '%'`);
        } else {
            conditions.push(`LOWER(${column}) = LOWER('${value}')`);
        }

        // Price range filter
        if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
            conditions.push(`ip.price >= ${parseFloat(minPrice)}`);
        }
        if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
            conditions.push(`ip.price <= ${parseFloat(maxPrice)}`);
        }

        // Sorting
        const sortBy = this._getSortBy(sort);

        // SQL Query
        const sql = `SELECT i.id, i.itemid, i.totalquantityonhand, i.stockdescription, ip.price, i.custitemcustitem_dnd_brand AS branditem, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1 WHERE ${conditions.join(' AND ')} ${sortBy}`;

        // Run with standard function signature
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }


    // Find items by both class and brand
    async findByClassAndBrand(classId, brand, limit, offset, sort) {
        const sortBy = this._getSortBy(sort);
        const sql = `SELECT i.id, i.itemid, i.totalquantityonhand, i.stockdescription, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1 WHERE i.isonline = 'T' AND i.isinactive='F' AND i.class='${classId}' AND i.custitemcustitem_dnd_brand='${brand}' ${sortBy}`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }

    async findById(itemId) {
        const sql = `SELECT i.custitem38, i.custitem39,i.id, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.storedetaileddescription, i.custitemcustitem_dnd_brand AS branditem, i.totalquantityonhand, i.stockdescription, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, ip.item, ip.price FROM item i LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE i.id = '${itemId}' AND i.isinactive='F' AND i.isonline = 'T';`;

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
        const sql = `SELECT i.id, i.itemid, i.stockdescription FROM item i WHERE LOWER(i.itemid) LIKE '%' || LOWER('${name}') || '%' AND i.isinactive='F' AND i.isonline = 'T' ORDER BY i.itemid ASC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results;
    }
    // Generalized count method for class or brand with price filtering
    async countByField(field, value, minPrice, maxPrice) {
        const allowedFields = {
            class: 'i.class',
            brand: 'i.custitemcustitem_dnd_brand',
            name: 'i.itemid'
        };

        // Base conditions
        const conditions = [`i.isonline = 'T'`, `i.isinactive = 'F'`];

        // Add field-specific filter (skip for "all" case)
        if (field !== "all") {
            const column = allowedFields[field];
            if (!column) {
                throw new Error(`Invalid filter field: ${field}`);
            }

            if (field === "name") {
                conditions.push(`LOWER(${column}) LIKE '%' || LOWER('${value}') || '%'`);
            } else {
                conditions.push(`LOWER(${column}) = LOWER('${value}')`);
            }
        }

        // Check if price filtering is needed
        const hasPriceFilter = (minPrice !== undefined && minPrice !== null && minPrice !== '') ||
            (maxPrice !== undefined && maxPrice !== null && maxPrice !== '');

        // Add price range filters
        if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
            conditions.push(`ip.price >= ${parseFloat(minPrice)}`);
        }
        if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
            conditions.push(`ip.price <= ${parseFloat(maxPrice)}`);
        }

        // Build SQL query
        const baseQuery = `SELECT COUNT(*) AS count FROM item i`;
        const priceJoin = ` JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1`;
        const whereClause = ` WHERE ${conditions.join(' AND ')}`;

        const sql = hasPriceFilter
            ? baseQuery + priceJoin + whereClause
            : baseQuery + whereClause;

        const results = await runQueryWithPagination(sql, 1, 0);
        return results.items?.[0]?.count || 0;
    }

    // Find items by category
    async findByCategory(category, limit, offset, sort, minPrice, maxPrice) {
        const sortBy = this._getSortBy(sort);

        // Build price filter conditions
        let priceConditions = '';

        if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
            priceConditions += ` AND ip.price >= ${parseFloat(minPrice)}`;
        }
        if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
            priceConditions += ` AND ip.price <= ${parseFloat(maxPrice)}`;
        }

        const sql = `SELECT i.id, i.itemid, i.totalquantityonhand, i.stockdescription, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM item i INNER JOIN CommerceCategoryItemAssociation cc ON cc.item = i.id INNER JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE cc.category = '${category}' AND i.isonline = 'T' AND i.isinactive = 'F'${priceConditions} ${sortBy}`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }

    // Count items by category with price filtering
    async countByCategory(category, minPrice, maxPrice) {
        // Build price filter conditions
        let conditions = [`cc.category = '${category}'`, `i.isonline = 'T'`, `i.isinactive = 'F'`];

        // Price range filter
        if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
            conditions.push(`ip.price >= ${parseFloat(minPrice)}`);
        }
        if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
            conditions.push(`ip.price <= ${parseFloat(maxPrice)}`);
        }

        const sql = `SELECT COUNT(*) AS count FROM item i INNER JOIN CommerceCategoryItemAssociation cc ON cc.item = i.id INNER JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE ${conditions.join(' AND ')};`;
        const results = await runQueryWithPagination(sql, 1, 0);
        return results.items?.[0]?.count || 0;
    }

    // Method for getting all products with pagination and sorting
    async findAllProducts(limit, offset, sort) {
        let conditions = [`i.isonline = 'T'`, `i.isinactive = 'F'`];

        // Custom sorting logic for findAllProducts
        let sortBy;
        if (sort === 'parent_classification_name') {
            sortBy = ` ORDER BY pc.name ASC`;
        } else if (sort && ['asc', 'desc'].includes(sort.toLowerCase())) {
            sortBy = ` ORDER BY ip.price ${sort.toLowerCase()}`;
        } else {
            sortBy = ` ORDER BY i.itemid ASC`;
        }

        // Use the same SQL structure as findByField for consistency, plus classification joins
        const sql = `SELECT i.id, i.itemid, i.totalquantityonhand, i.stockdescription, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, c.name AS classification_name, pc.name AS parent_classification_name FROM item i JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1 LEFT JOIN classification c ON i.class = c.id LEFT JOIN classification pc ON c.parent = pc.id WHERE ${conditions.join(' AND ')} ${sortBy}`;

        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }

}

module.exports = new ItemsService();