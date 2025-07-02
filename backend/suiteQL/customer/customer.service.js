const { runQueryWithPagination } = require('../util');

class CustomerService {
    async findByEmail(email, limit, offset) {
        if (!email) throw new Error('Email is required');
        const sql = `SELECT c.id, c.email, c.entityid, c.companyname, c.firstname, c.lastname, c.phone, c.category, c.searchstage, ba.addressname AS billing_address_name, sa.addressname AS shipping_address_name FROM customer c LEFT JOIN transactionbillingaddressbook ba ON ba.addressbookaddress = c.defaultbillingaddress LEFT JOIN transactionShippingAddressbook sa ON sa.addressbookaddress = c.defaultshippingaddress WHERE c.email = '${email}'`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }

    async findByStage(stage, limit, offset) {
        const allowedStages = ['Lead', 'Customer', 'Prospect'];
        if (!allowedStages.includes(stage)) {
            throw new Error('Invalid stage value');
        }
        const sql = `SELECT c.id, c.email, c.entityid, c.companyname, c.firstname, c.lastname, c.phone, c.category, c.searchstage, ba.addressname AS billing_address_name, sa.addressname AS shipping_address_name FROM customer c LEFT JOIN transactionbillingaddressbook ba ON ba.addressbookaddress = c.defaultbillingaddress LEFT JOIN transactionShippingAddressbook sa ON sa.addressbookaddress = c.defaultshippingaddress WHERE c.searchstage = '${stage}' ORDER BY c.id DESC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }
}

module.exports = new CustomerService();