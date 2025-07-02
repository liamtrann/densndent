const { runQueryWithPagination } = require('../util');

class CustomerService {
    async findByEmail(email, limit, offset) {
        if (!email) throw new Error('Email is required');
        const sql = `SELECT id, email, entityid, companyname, firstname, lastname, phone, category, searchstage FROM customer WHERE email = '${email}'`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }

    async findByStage(stage, limit, offset) {
        const allowedStages = ['Lead', 'Customer', 'Prospect'];
        if (!allowedStages.includes(stage)) {
            throw new Error('Invalid stage value');
        }
        const sql = `SELECT id, email, entityid, companyname, firstname, lastname, phone, category, searchstage FROM customer WHERE searchstage = '${stage}' ORDER BY id DESC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results.items || [];
    }
}

module.exports = new CustomerService();