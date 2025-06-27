const config = require('./config');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const axios = require('axios');
const qs = require('qs');

function createOAuth() {
    return OAuth({
        consumer: {
            key: config.consumerKey,
            secret: config.consumerSecret
        },
        signature_method: 'HMAC-SHA256',
        realm: config.realm,
        hash_function: (base_string, key) => {
            return crypto
                .createHmac('sha256', key)
                .update(base_string)
                .digest('base64');
        }
    });
}

const token = {
    key: config.accessToken,
    secret: config.tokenSecret
};

async function makeRequest({ method, endpoint, data, params = {} }) {
    const oauth = createOAuth();
    const queryString = qs.stringify(params);
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    const url = `${config.baseUrl}${fullEndpoint}`;
    const requestData = { url, method };
    try {
        const headers = oauth.toHeader(
            oauth.authorize(requestData, token)
        );
        const response = await axios({
            method,
            url,
            data,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Prefer': 'transient'
            }
        });
        const { links, ...rest } = response.data;
        return rest;
    } catch (error) {
        console.error('Netsuite API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method
        });
        throw error;
    }
}

module.exports = {
    makeRequest,
    createOAuth,
    token,
};
