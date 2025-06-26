const { runQueryWithPagination } = require('../util');

class PricingService {
    async findByItemId(itemId, limit, offset) {
        const sql = `SELECT item, quantity, saleunit, priceqty, unitprice FROM pricing WHERE item = ${itemId}`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results;
    }
}

module.exports = new PricingService();