const { runQueryWithPagination } = require('../util');

class PricingService {
    async findByItemId(itemId, limit, offset) {
        const sql = `
            SELECT item, quantity, saleunit, priceqty, unitprice
            FROM pricing
            WHERE item = ${itemId}
        `;
        return runQueryWithPagination(sql, limit, offset);
    }
}

module.exports = new PricingService(); 