const { runQueryWithPagination } = require("../util");


class TransactionService {
    async findByEntityId(id, limit, offset) {
        let sql = `SELECT t.entity, ts.name AS status, t.shipcarrier, t.shippingaddress, t.trandate, t.trandisplayname, t.transactionnumber, t.custbody_stc_amount_after_discount AS amountAfterDiscount, t.custbody_stc_tax_after_discount AS taxAfterDiscount, t.custbody_stc_total_after_discount AS totalAfterDiscount, t.foreigntotal, t.totalcostestimate, ea.addrtext AS shipping_addrtext FROM transaction t LEFT JOIN transactionstatus ts ON t.status = ts.id AND t.type = ts.trantype LEFT JOIN entityaddress ea ON ea.nkey = t.shippingaddress WHERE t.entity='${id}' ORDER BY t.trandate DESC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }
}

module.exports = new TransactionService();
