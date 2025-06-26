const { runQueryWithPagination } = require('../util');

class CustomerService {
    async findByEmail(email) {
        if (!email) throw new Error('Email is required');
        const sql = `SELECT id, email, entityid, companyname, firstname, lastname, phone FROM customer WHERE email = '${email}' FETCH FIRST 1 ROWS ONLY`;
        const results = await runQueryWithPagination(sql, 1, 0);
        return results.items?.[0] || null;
    }

    async findByStage(stage, limit = 20, offset = 0) {
        const allowedStages = ['Lead', 'Customer', 'Prospect'];
        if (!allowedStages.includes(stage)) {
            throw new Error('Invalid stage value');
        }
        const sql = `SELECT id, email, entityid, companyname, firstname, lastname, phone, searchstage FROM customer WHERE searchstage = '${stage}' ORDER BY id DESC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }
}

module.exports = new CustomerService();