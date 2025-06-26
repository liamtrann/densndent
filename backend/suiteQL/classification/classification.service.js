const netsuiteService = require('../netsuite.service');
const { runQueryWithPagination } = require('../util');

class ClassificationService {
    constructor() {
        this.recordType = 'classification';
    }
    async findAll(limit, offset) {
        const sql = `SELECT id, name, parent, subsidiary FROM classification ORDER BY name ASC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results;
    }

    // ✅ Get classifications by parent ID
    async findAllParentClass(limit, offset) {
        const sql = `SELECT id, name, parent, subsidiary FROM classification WHERE parent IS NOT NULL ORDER BY name ASC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results;
    }
    async findAllChildClass(limit, offset) {
        const sql = `SELECT id, name, parent, subsidiary FROM classification WHERE parent IS NULL ORDER BY name ASC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results;
    }
    async findByIds(classificationIds = []) {
        if (!Array.isArray(classificationIds) || classificationIds.length === 0) {
            throw new Error('classificationIds must be a non-empty array');
        }
        const idsString = classificationIds.map(id => `'${id}'`).join(",");
        const sql = `SELECT id, name, parent, subsidiary FROM classification WHERE id IN (${idsString}) ORDER BY name ASC`;
        const results = await runQueryWithPagination(sql, classificationIds.length, 0);
        return results;
    }

}

module.exports = new ClassificationService();