const { runQueryWithPagination } = require('../util');

class RecurringOrderService {
    constructor() {
        this.NS_CUSTOM_RECORD_SCRIPTID = 'customrecord_recurring_order';
    }

    async getDueOrders(limit, offset) {
        const sql = `SELECT ro.id, ro.custrecord_ro_customer AS customerid, ro.custrecord_ro_item AS itemid, ro.custrecord_ro_quantity AS quantity, ro.custrecord_ro_interval AS interval, iu.name AS intervalunit, ro.custrecord_ro_next_run AS nextrun, i.itemid, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM ${this.NS_CUSTOM_RECORD_SCRIPTID} ro LEFT JOIN customlist_interval_unit iu ON iu.id = ro.custrecord_ro_interval_unit LEFT JOIN customlist_recurring_order_status st ON st.id = ro.custrecord_ro_status LEFT JOIN item i ON i.id = ro.custrecord_ro_item LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE st.name = 'Active' AND ro.custrecord_ro_next_run <= CURRENT_DATE ORDER BY ro.custrecord_ro_next_run ASC`;

        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }

    async getAllRecurringOrders(limit, offset) {
        const sql = `SELECT ro.id, ro.custrecord_ro_customer AS customerid, ro.custrecord_ro_item AS itemid, ro.custrecord_ro_quantity AS quantity, ro.custrecord_ro_interval AS interval, iu.name AS intervalunit, ro.custrecord_ro_next_run AS nextrun, st.name AS status, i.itemid, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM ${this.NS_CUSTOM_RECORD_SCRIPTID} ro LEFT JOIN customlist_interval_unit iu ON iu.id = ro.custrecord_ro_interval_unit LEFT JOIN customlist_recurring_order_status st ON st.id = ro.custrecord_ro_status LEFT JOIN item i ON i.id = ro.custrecord_ro_item LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 ORDER BY ro.custrecord_ro_next_run DESC`;

        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }

    async getRecurringOrderById(id) {
        if (!id) throw new Error('ID is required');

        const sql = `SELECT ro.id, ro.custrecord_ro_customer AS customerid, ro.custrecord_ro_item AS itemid, ro.custrecord_ro_quantity AS quantity, ro.custrecord_ro_interval AS interval, iu.name AS intervalunit, ro.custrecord_ro_next_run AS nextrun, st.name AS status, i.itemid, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM ${this.NS_CUSTOM_RECORD_SCRIPTID} ro LEFT JOIN customlist_interval_unit iu ON iu.id = ro.custrecord_ro_interval_unit LEFT JOIN customlist_recurring_order_status st ON st.id = ro.custrecord_ro_status LEFT JOIN item i ON i.id = ro.custrecord_ro_item LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE ro.id = '${id}'`;

        const results = await runQueryWithPagination(sql, 1, 0);
        return results.items && results.items.length > 0 ? results.items[0] : null;
    }

    async getRecurringOrdersByCustomer(customerId, limit, offset) {
        if (!customerId) throw new Error('Customer ID is required');

        const sql = `SELECT ro.id, ro.custrecord_ro_customer AS customerid, ro.custrecord_ro_item AS itemid, ro.custrecord_ro_quantity AS quantity, ro.custrecord_ro_interval AS interval, iu.name AS intervalunit, ro.custrecord_ro_next_run AS nextrun, st.name AS status, i.itemid, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM ${this.NS_CUSTOM_RECORD_SCRIPTID} ro LEFT JOIN customlist_interval_unit iu ON iu.id = ro.custrecord_ro_interval_unit LEFT JOIN customlist_recurring_order_status st ON st.id = ro.custrecord_ro_status LEFT JOIN item i ON i.id = ro.custrecord_ro_item LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE ro.custrecord_ro_customer = '${customerId}' ORDER BY ro.custrecord_ro_next_run DESC`;

        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }

    async getActiveRecurringOrders(limit, offset) {
        const sql = `SELECT ro.id, ro.custrecord_ro_customer AS customerid, ro.custrecord_ro_item AS itemid, ro.custrecord_ro_quantity AS quantity, ro.custrecord_ro_interval AS interval, iu.name AS intervalunit, ro.custrecord_ro_next_run AS nextrun, st.name AS status, i.itemid, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url FROM ${this.NS_CUSTOM_RECORD_SCRIPTID} ro LEFT JOIN customlist_interval_unit iu ON iu.id = ro.custrecord_ro_interval_unit LEFT JOIN customlist_recurring_order_status st ON st.id = ro.custrecord_ro_status LEFT JOIN item i ON i.id = ro.custrecord_ro_item LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE st.name = 'Active' ORDER BY ro.custrecord_ro_next_run ASC`;

        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }
}

module.exports = new RecurringOrderService();
