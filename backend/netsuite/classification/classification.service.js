const netsuiteService = require('../netsuite.service');
const { SuiteQLQueries } = require('../suiteql.queries');

class ClassificationService {
    constructor() {
        this.recordType = 'classification';
    }

    async findAll(limit, offset) {
        let sql = SuiteQLQueries.getAllClassifications;

        const params = {};
        if (limit) params.limit = limit;
        if (offset) params.offset = offset;

        return netsuiteService.querySuiteQL(sql, params);
    }
}

module.exports = new ClassificationService();