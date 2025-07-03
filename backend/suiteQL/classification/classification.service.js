const netsuiteService = require('../suiteql.service');
const { runQueryWithPagination } = require('../util');

class ClassificationService {
    constructor() {
        this.recordType = 'classification';
    }
    async findAll(limit, offset) {
        const sql = `SELECT id, name, parent FROM classification ORDER BY name ASC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results;
    }

    // ✅ Get classifications by parent ID
    async findAllParentClass(limit, offset) {
        const sql = `SELECT id, name, parent FROM classification WHERE parent IS NULL ORDER BY name ASC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results;
    }
    async findAllChildClass(limit, offset) {
        const sql = `SELECT id, name, parent FROM classification WHERE parent IS NOT NULL ORDER BY name ASC`;
        const results = await runQueryWithPagination(sql, limit, offset);
        return results;
    }
    async findByIds(classificationIds = []) {
        if (!Array.isArray(classificationIds) || classificationIds.length === 0) {
            throw new Error('classificationIds must be a non-empty array');
        }
        const idsString = classificationIds.map(id => `'${id}'`).join(",");
        const sql = `SELECT id, name, parent FROM classification WHERE id IN (${idsString}) ORDER BY name ASC`;
        const results = await runQueryWithPagination(sql, classificationIds.length, 0);
        return results;
    }
    async findByName(name, limit = 50, offset = 0) {
        if (!name) throw new Error('Name is required');
        const sql = `SELECT id, name, parent FROM classification WHERE LOWER(name) = LOWER(?) ORDER BY name ASC`;
        const results = await runQueryWithPagination(sql, limit, offset, [name]);
        return results;
    }

}

module.exports = new ClassificationService();