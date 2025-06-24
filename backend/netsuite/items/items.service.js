const netsuiteService = require('../netsuite.service');
const { runQueryWithPagination } = require('../util');

class ItemsService {
    constructor() {
        this.recordType = 'item';
    }
    // Get items by class
    async findByClass(classId, limit, offset) {
        const sql = `
            SELECT id, class, itemid, itemType, subsidiary, isonline
            FROM item
            WHERE isonline='T' AND class = ${classId}
        `;
        return runQueryWithPagination(sql, limit, offset);
    }
}

module.exports = new ItemsService(); 