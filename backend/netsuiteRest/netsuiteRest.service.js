const { makeRequest } = require('../connectNetsuite');

class NetsuiteRestService {
    async makeRequest({ method, endpoint, data, params = {} }) {
        return makeRequest({ method, endpoint, data, params });
    }

    async getRecord(recordType, id) {
        return this.makeRequest({
            method: 'GET',
            endpoint: `/services/rest/record/v1/${recordType}/${id}`
        });
    }

    async searchRecords(recordType, queryParams = {}) {
        return this.makeRequest({
            method: 'GET',
            endpoint: `/services/rest/record/v1/${recordType}`,
            params: queryParams
        });
    }
}

module.exports = new NetsuiteRestService();
