const { runQueryWithPagination } = require('../util');

class SaleInvoicedService {
    async getTopSalesInvoiced(limit = 10, fromDate = '2024-01-01') {
        const sql = `SELECT item, amount FROM salesInvoiced WHERE item IS NOT NULL AND amount IS NOT NULL AND trandate >= TO_DATE('${fromDate}', 'YYYY-MM-DD') ORDER BY amount DESC FETCH FIRST ${limit} ROWS ONLY`;
        return runQueryWithPagination(sql, limit, 0);
    }
}

module.exports = new SaleInvoicedService();
