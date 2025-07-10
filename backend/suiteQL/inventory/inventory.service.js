const { runQueryWithPagination } = require('../util');

class InventoryService {
    // Check inventory balances for multiple item IDs
    async checkInventoryBalances(itemIds = []) {
        if (!Array.isArray(itemIds) || itemIds.length === 0) {
            throw new Error('itemIds must be a non-empty array');
        }
        const idsString = itemIds.map(id => `'${id}'`).join(",");
        const sql = `SELECT ib.quantityavailable, ib.quantityonhand, ib.item, ib.location, ib.binnumber FROM InventoryBalance ib INNER JOIN item i ON ib.item = i.id WHERE ib.item IN (${idsString}) AND i.isonline = 'T' AND i.isinactive = 'F'`;
        const results = await runQueryWithPagination(sql, itemIds.length, 0);
        return results;
    }
}

module.exports = new InventoryService();
