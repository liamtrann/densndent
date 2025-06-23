const netsuiteService = require('../netsuite.service');
const { SuiteQLQueries } = require('../suiteql.queries');

class ClassificationService {
    constructor() {
        this.recordType = 'classification';
    }

    async findAll(limit, offset, parent, parentId) {
        let whereClause = '';
        if (parent === 'true' || parent === true) {

            whereClause = parentId ? `WHERE parent IS NOT NULL AND parent='${parentId}'` : `WHERE parent IS NOT NULL`;
        } else if (parent === 'false' || parent === false) {
            whereClause = 'WHERE parent IS NULL';
        }
        const sql = `
        SELECT *
        FROM classification
        ${whereClause}
        ORDER BY name ASC
    `;

        const params = {};
        if (limit) params.limit = limit;
        if (offset) params.offset = offset;

        return netsuiteService.querySuiteQL(sql, params);
    }
}

module.exports = new ClassificationService();