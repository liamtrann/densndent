module.exports = {
  consumerKey: process.env.SUITEQL_CONSUMER_KEY,
  consumerSecret: process.env.SUITEQL_CONSUMER_SECRET,
  accessToken: process.env.SUITEQL_ACCESS_TOKEN,
  tokenSecret: process.env.SUITEQL_TOKEN_SECRET,
  realm: process.env.SUITEQL_REALM || '4571901_SB1',
  baseUrl: 'https://4571901-sb1.suitetalk.api.netsuite.com'
};