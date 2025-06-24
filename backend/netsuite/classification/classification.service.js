const netsuiteService = require('../netsuite.service');
const { runQueryWithPagination } = require('../util');

class ClassificationService {
    constructor() {
        this.recordType = 'classification';
    }
    async findAll(limit, offset) {
        const sql = `
            SELECT id, name, parent, subsidiary
            FROM classification
            ORDER BY name ASC
        `;

        return runQueryWithPagination(sql, limit, offset);
    }

    // ✅ Get classifications by parent ID
    async findAllParentClass(limit, offset) {
        const sql = `
            SELECT id, name, parent, subsidiary
            FROM classification
            WHERE parent IS NOT NULL
            ORDER BY name ASC
        `;

        return runQueryWithPagination(sql, limit, offset);
    }
    async findAllChildClass(limit, offset) {
        const sql = `
            SELECT id, name, parent, subsidiary
            FROM classification
            WHERE parent IS NULL
            ORDER BY name ASC
        `;

        return runQueryWithPagination(sql, limit, offset);
    }

}

module.exports = new ClassificationService();