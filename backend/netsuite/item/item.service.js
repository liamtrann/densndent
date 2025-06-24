const netsuiteService = require('../netsuite.service');
const { runQueryWithPagination } = require('../util');

class ItemsService {
    constructor() {
        this.recordType = 'item';
    }
    // Get items by class
    async findByClass(classId, limit, offset) {
        const sql = `
            SELECT 
                i.id, 
                i.class, 
                i.manufacturer, 
                i.itemid, 
                i.itemType, 
                i.subsidiary, 
                i.isonline, 
                i.displayname,

                (
                    SELECT f.url
                    FROM file f
                    WHERE f.isonline = 'T'
                    AND f.name LIKE '%' || i.displayname || '%'
                    ORDER BY f.createddate DESC
                    FETCH FIRST 1 ROWS ONLY
                ) AS file_url

                FROM item i
                WHERE i.isonline = 'T'
                AND i.class = ${classId}
            `;
        return runQueryWithPagination(sql, limit, offset);
    }
    // Get item by id
    async findById(itemId) {
        console.log(itemId)
        const sql = `
             SELECT 
            i.id, 
            i.class, 
            i.manufacturer, 
            i.mpn,
            i.itemid, 
            i.itemType, 
            i.subsidiary, 
            i.isonline, 
            i.displayname,
            i.storedetaileddescription
            (
                SELECT f.url 
                FROM file f
                WHERE f.isonline = 'T'
                AND f.name LIKE '%' || i.displayname || '%'
                ORDER BY f.createddate DESC
                FETCH FIRST 1 ROWS ONLY
            ) AS file_url

        FROM item i
        WHERE i.id = ${itemId}  
        `;
        return runQueryWithPagination(sql, 1, 0);
    }
}

module.exports = new ItemsService(); 