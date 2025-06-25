const { runQueryWithPagination } = require('../util');

class FileService {
    async findByNameLike(namePattern, limit, offset) {
        const sql = `SELECT id, isonline, folder, url, name FROM file WHERE isonline='T' AND name LIKE '%${namePattern}%' ORDER BY createddate DESC';`;
        return runQueryWithPagination(sql, limit, offset);
    }
}

module.exports = new FileService(); 