const netsuiteService = require('../netsuite.service');
const { SuiteQLQueries } = require('../suiteql.queries');

class ClassificationService {
    constructor() {
        this.recordType = 'classification';
    }
    async runQueryWithPagination(sql, limit, offset) {
        const params = {};
        if (limit) params.limit = limit;
        if (offset) params.offset = offset;

        return netsuiteService.querySuiteQL(sql, params);
    }
    // ✅ Get all classifications
    async findAll(limit, offset) {
        const sql = `
            SELECT id, name, parent, subsidiary
            FROM classification
            ORDER BY name ASC
        `;

        return this.runQueryWithPagination(sql, limit, offset);
    }

    // ✅ Get classifications by parent ID
    async findAllParentClass(limit, offset) {
        const sql = `
            SELECT id, name, parent, subsidiary
            FROM classification
            WHERE parent IS NOT NULL
            ORDER BY name ASC
        `;

        return this.runQueryWithPagination(sql, limit, offset);
    }
    async findAllChildClass(limit, offset) {
        const sql = `
            SELECT id, name, parent, subsidiary
            FROM classification
            WHERE parent IS NULL
            ORDER BY name ASC
        `;

        return this.runQueryWithPagination(sql, limit, offset);
    }

}

module.exports = new ClassificationService();