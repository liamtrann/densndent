const { runQueryWithPagination } = require("../util");

class TransactionService {
  async findByEntityId(userId, limit, offset) {
    let sql = `SELECT t.id, t.entity, ts.name AS status, t.shipcarrier, t.shippingaddress, t.trandate, t.trandisplayname, t.transactionnumber, t.externalid, t.custbody_stc_amount_after_discount AS amountAfterDiscount, t.custbody_stc_tax_after_discount AS taxAfterDiscount, t.custbody_stc_total_after_discount AS totalAfterDiscount, t.foreigntotal, t.totalcostestimate, ea.addrtext AS shipping_addrtext FROM transaction t LEFT JOIN transactionstatus ts ON t.status = ts.id AND t.type = ts.trantype LEFT JOIN entityaddress ea ON ea.nkey = t.shippingaddress WHERE t.entity='${userId}' ORDER BY t.trandate DESC`;
    const results = await runQueryWithPagination(sql, limit, offset);
    return results.items || [];
  }

  async findByEmail(email, limit, offset) {
    let sql = `SELECT t.email, t.entity, ts.name AS status, t.shipcarrier, t.shippingaddress, t.trandate, t.trandisplayname, t.transactionnumber, t.externalid, t.custbody_stc_amount_after_discount AS amountAfterDiscount, t.custbody_stc_tax_after_discount AS taxAfterDiscount, t.custbody_stc_total_after_discount AS totalAfterDiscount, t.foreigntotal, t.totalcostestimate, ea.addrtext AS shipping_addrtext FROM transaction t LEFT JOIN transactionstatus ts ON t.status = ts.id AND t.type = ts.trantype LEFT JOIN entityaddress ea ON ea.nkey = t.shippingaddress WHERE t.email='${email}' ORDER BY t.trandate DESC`;
    const results = await runQueryWithPagination(sql, limit, offset);
    return results.items || [];
  }

  async findByExternalId(externalId, limit, offset) {
    if (!externalId) throw new Error("External ID is required");

    let sql = `SELECT t.id, t.entity, t.email, ts.name AS status, t.shipcarrier, t.shippingaddress, t.trandate, t.trandisplayname, t.transactionnumber, t.externalid, t.custbody_stc_amount_after_discount AS amountAfterDiscount, t.custbody_stc_tax_after_discount AS taxAfterDiscount, t.custbody_stc_total_after_discount AS totalAfterDiscount, t.foreigntotal, t.totalcostestimate, t.memo, ea.addrtext AS shipping_addrtext FROM transaction t LEFT JOIN transactionstatus ts ON t.status = ts.id AND t.type = ts.trantype LEFT JOIN entityaddress ea ON ea.nkey = t.shippingaddress WHERE t.externalid='${externalId}' ORDER BY t.trandate DESC`;
    const results = await runQueryWithPagination(sql, limit, offset);
    return results.items || [];
  }

  // Find items by user order history
  async findByUserOrderHistory(id, limit, offset) {
    const sql = `SELECT i.id, i.itemid, i.totalquantityonhand, ip.price, tli.linecreateddate, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM (SELECT tl.item, MAX(tl.linecreateddate) AS linecreateddate FROM transactionLine tl WHERE tl.itemtype = 'InvtPart' AND tl.entity = '${id}' GROUP BY tl.item) tli JOIN item i ON tli.item = i.id LEFT JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1 ORDER BY tli.linecreateddate DESC`;
    const results = await runQueryWithPagination(sql, limit, offset);
    return results.items || [];
  }

  // Get order details by transaction ID with grouping by itemtype
  async getOrderDetailsByTransaction(transactionId, limit, offset) {
    if (!transactionId) throw new Error("Transaction ID is required");

    const sql = `SELECT tl.item, tl.itemtype, tl.memo, tl.rate, tl.rateamount, tl.netamount, SUM(tl.quantity) AS total_quantity, COUNT(*) AS line_count, i.itemid, i.displayname, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM transactionLine tl LEFT JOIN item i ON tl.item = i.id WHERE tl.itemtype = 'InvtPart' AND tl.transaction = '${transactionId}' GROUP BY tl.item, tl.itemtype, tl.memo, tl.rate, tl.rateamount, tl.netamount, i.itemid, i.displayname ORDER BY tl.itemtype, tl.item`;

    const results = await runQueryWithPagination(sql, limit, offset);
    return results.items || [];
  }

  // const sql = `SELECT tl.linecreateddate, i.id, i.itemid, i.totalquantityonhand, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM transactionLine tl INNER JOIN item i ON tl.item = i.id LEFT JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1 WHERE tl.entity = '${userId}' AND tl.itemtype = 'InvtPart' AND i.isonline = 'T' AND i.isinactive = 'F' GROUP BY tl.linecreateddate, i.id, i.itemid, i.totalquantityonhand, ip.price, i.displayname ORDER BY tl.linecreateddate DESC`;
}

module.exports = new TransactionService();
