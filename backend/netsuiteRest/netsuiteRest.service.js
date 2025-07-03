const { makeRequest } = require('../connectNetsuite');

class NetsuiteRestService {
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

    async patchRecord(recordType, data) {
        // You may want to require an id in data or as a param
        if (!data || !data.id) throw new Error('Missing id for patch');
        const endpoint = `/services/rest/record/v1/${recordType}/${data.id}`;
        return this.makeRequest({
            method: 'PATCH',
            endpoint,
            data
        });
    }
}

module.exports = new NetsuiteRestService();
