// restapi.service.js
// General service for REST API operations
const { makeRequest } = require('../connectNetsuite');

class RestApiService {
    async makeRequest({ method, endpoint, data, params = {} }) {
        return makeRequest({ method, endpoint, data, params });
    }

    async getRecord(recordType, id) {
        const endpoint = id
            ? `/services/rest/record/v1/${recordType}/${id}`
            : `/services/rest/record/v1/${recordType}`;
        return this.makeRequest({
            method: 'GET',
            endpoint
        });
    }

    async searchRecords(recordType, queryParams = {}) {
        return this.makeRequest({
            method: 'GET',
            endpoint: `/services/rest/record/v1/${recordType}`,
            params: queryParams
        });
    }

    async postRecord(recordType, data) {
        return this.makeRequest({
            method: 'POST',
            endpoint: `/services/rest/record/v1/${recordType}`,
            data
        });
    }

    async patchRecord(recordType, id, data) {
        return this.makeRequest({
            method: 'PATCH',
            endpoint: `/services/rest/record/v1/${recordType}/${id}`,
            data
        });
    }
}

module.exports = new RestApiService();
