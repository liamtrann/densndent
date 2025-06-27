const { makeRequest } = require('../connectNetsuite');

class SuiteQLService {
  async makeRequest({ method, endpoint, data, params = {} }) {
    return makeRequest({ method, endpoint, data, params });
  }

  async querySuiteQL(sql, params = {}) {
    return this.makeRequest({
      method: 'POST',
      endpoint: '/services/rest/query/v1/suiteql',
      data: { q: sql },
      params
    });
  }
}

module.exports = new SuiteQLService();