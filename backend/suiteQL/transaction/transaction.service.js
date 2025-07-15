const { runQueryWithPagination } = require("../util");


class TransactionService {
    async findByEntityId(id, limit, offset) {
        let sql = `SELECT t.id, t.entity, ts.name AS status, t.shipcarrier, t.shippingaddress, t.trandate, t.trandisplayname, t.transactionnumber, t.custbody_stc_amount_after_discount AS amountAfterDiscount, t.custbody_stc_tax_after_discount AS taxAfterDiscount, t.custbody_stc_total_after_discount AS totalAfterDiscount, t.foreigntotal, t.totalcostestimate, ea.addrtext AS shipping_addrtext FROM transaction t LEFT JOIN transactionstatus ts ON t.status = ts.id AND t.type = ts.trantype LEFT JOIN entityaddress ea ON ea.nkey = t.shippingaddress WHERE t.entity='${id}' ORDER BY t.trandate DESC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }

    async findByEmail(email, limit, offset) {
        let sql = `SELECT t.email, t.entity, ts.name AS status, t.shipcarrier, t.shippingaddress, t.trandate, t.trandisplayname, t.transactionnumber, t.custbody_stc_amount_after_discount AS amountAfterDiscount, t.custbody_stc_tax_after_discount AS taxAfterDiscount, t.custbody_stc_total_after_discount AS totalAfterDiscount, t.foreigntotal, t.totalcostestimate, ea.addrtext AS shipping_addrtext FROM transaction t LEFT JOIN transactionstatus ts ON t.status = ts.id AND t.type = ts.trantype LEFT JOIN entityaddress ea ON ea.nkey = t.shippingaddress WHERE t.email='${email}' ORDER BY t.trandate DESC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }



    
        // const sql = `SELECT tl.linecreateddate, i.id, i.itemid, i.totalquantityonhand, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM transactionLine tl INNER JOIN item i ON tl.item = i.id LEFT JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1 WHERE tl.entity = '${userId}' AND tl.itemtype = 'InvtPart' AND i.isonline = 'T' AND i.isinactive = 'F' GROUP BY tl.linecreateddate, i.id, i.itemid, i.totalquantityonhand, ip.price, i.displayname ORDER BY tl.linecreateddate DESC`;
}

module.exports = new TransactionService();
