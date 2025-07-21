const { runQueryWithPagination } = require('../util');

class CommerceCategoryService {
    async findAll(limit, offset) {
        const sql = `SELECT id, name, parent, description FROM commerceCategory ORDER BY name ASC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results;
    }

    async findById(id) {
        const sql = `SELECT id, name, description FROM commerceCategory WHERE id = '${id}'`;
        const results = await runQueryWithPagination(sql, 1, 0);
        return results.items?.[0] || null;
    }

    async getSubCategoryByParentById(id) {
        const sql = `SELECT * from CommerceCategory where primaryparent='${id}' AND (enddate IS NULL OR enddate >= TRUNC(SYSDATE)) AND displayinsite = 'T' AND isinactive = 'F'`;
        const results = await runQueryWithPagination(sql);
        return results
    }
}

module.exports = new CommerceCategoryService();
