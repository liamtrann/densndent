const express = require('express');
const router = express.Router();

// Test VersaPay credentials and connection
router.post('/test-connection', async (req, res) => {
    try {
        const fetch = require('node-fetch');

        console.log('🔍 [VPAY] Testing VersaPay connection...');
        console.log('🔍 [VPAY] Environment variables:', {
            apiToken: process.env.VPAY_API_TOKEN ? `${process.env.VPAY_API_TOKEN.substring(0, 8)}***` : 'NOT SET',
            apiKey: process.env.VPAY_API_KEY || 'NOT SET',
            settlementToken: process.env.VPAY_SETTLEMENT_TOKEN || 'NOT SET'
        });

        if (!process.env.VPAY_API_TOKEN || !process.env.VPAY_API_KEY) {
            return res.status(400).json({
                success: false,
                error: 'VersaPay credentials not configured in environment variables',
                missing: {
                    apiToken: !process.env.VPAY_API_TOKEN,
                    apiKey: !process.env.VPAY_API_KEY,
                    settlementToken: !process.env.VPAY_SETTLEMENT_TOKEN
                }
            });
        }

        // Test both UAT and Production URLs
        const testUrls = [
            { url: 'https://ecommerce-api-uat.versapay.com/api/v2/sessions', env: 'UAT' },
            { url: 'https://ecommerce-api.versapay.com/api/v2/sessions', env: 'Production' }
        ];

        const results = [];

        for (const testCase of testUrls) {
            try {
                console.log(`🔍 [VPAY] Testing ${testCase.env} environment...`);

                const response = await fetch(testCase.url, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify({
                        gatewayAuthorization: {
                            apiToken: process.env.VPAY_API_TOKEN,
                            apiKey: process.env.VPAY_API_KEY,
                        },
                        options: {}
                    }),
                });

                const data = await response.json();

                results.push({
                    environment: testCase.env,
                    url: testCase.url,
                    status: response.status,
                    success: response.ok,
                    response: data
                });

                console.log(`📊 [VPAY] ${testCase.env} Result:`, {
                    status: response.status,
                    success: response.ok,
                    hasSessionId: data.id ? true : false
                });

            } catch (error) {
                console.error(`❌ [VPAY] ${testCase.env} Error:`, error.message);
                results.push({
                    environment: testCase.env,
                    url: testCase.url,
                    status: 'ERROR',
                    success: false,
                    error: error.message
                });
            }
        }

        res.json({
            message: 'VersaPay credential test completed',
            timestamp: new Date().toISOString(),
            credentials: {
                apiToken: process.env.VPAY_API_TOKEN ? `${process.env.VPAY_API_TOKEN.substring(0, 8)}***` : 'NOT SET',
                apiKey: process.env.VPAY_API_KEY ? '***SET***' : 'NOT SET',
                settlementToken: process.env.VPAY_SETTLEMENT_TOKEN ? '***SET***' : 'NOT SET'
            },
            results: results,
            summary: {
                totalTests: results.length,
                successful: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length
            }
        });

    } catch (error) {
        console.error('❌ [VPAY] Test Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Failed to test VersaPay connection'
        });
    }
});

// Test specific credential sets directly
router.post('/test-credentials/:set', async (req, res) => {
    try {
        const fetch = require('node-fetch');
        const { set } = req.params;

        // Your specific credential sets
        const credentials = {
            set1: {
                name: 'Credential Set 1',
                apiToken: '44sHrnhkX9387Y2DWd4sJaCkHaP975sH',
                apiKey: '10044995',
                settlementToken: '25651540015'
            },
            set2: {
                name: 'Credential Set 2',
                apiToken: 'ty6m3jrvn3E56B7DbjrFu4g4aq3WsBcF',
                apiKey: '10044813',
                settlementToken: '83404630014'
            }
        };

        if (!credentials[set]) {
            return res.status(400).json({
                success: false,
                error: 'Invalid credential set. Use set1 or set2',
                availableSets: Object.keys(credentials)
            });
        }

        const creds = credentials[set];

        console.log(`🔍 [VPAY] Testing ${creds.name}:`, {
            apiToken: `${creds.apiToken.substring(0, 8)}***`,
            apiKey: creds.apiKey,
            settlementToken: creds.settlementToken
        });

        // Test both environments with this credential set
        const testUrls = [
            { url: 'https://ecommerce-api-uat.versapay.com/api/v2/sessions', env: 'UAT' },
            { url: 'https://ecommerce-api.versapay.com/api/v2/sessions', env: 'Production' }
        ];

        const results = [];

        for (const testCase of testUrls) {
            try {
                console.log(`🔍 [VPAY] Testing ${creds.name} on ${testCase.env}...`);

                const response = await fetch(testCase.url, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify({
                        gatewayAuthorization: {
                            apiToken: creds.apiToken,
                            apiKey: creds.apiKey,
                        },
                        options: {}
                    }),
                });

                const data = await response.json();

                results.push({
                    environment: testCase.env,
                    url: testCase.url,
                    status: response.status,
                    success: response.ok,
                    response: data
                });

                console.log(`📊 [VPAY] ${testCase.env} Result:`, {
                    status: response.status,
                    success: response.ok,
                    hasSessionId: data.id ? true : false
                });

            } catch (error) {
                console.error(`❌ [VPAY] ${testCase.env} Error:`, error.message);
                results.push({
                    environment: testCase.env,
                    url: testCase.url,
                    status: 'ERROR',
                    success: false,
                    error: error.message
                });
            }
        }

        res.json({
            credentialSet: set,
            credentialName: creds.name,
            timestamp: new Date().toISOString(),
            credentials: {
                apiToken: `${creds.apiToken.substring(0, 8)}***`,
                apiKey: creds.apiKey,
                settlementToken: creds.settlementToken
            },
            results: results,
            summary: {
                totalTests: results.length,
                successful: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length,
                recommendation: results.find(r => r.success) ?
                    `Use ${results.find(r => r.success).environment} environment` :
                    'No working environment found - check credentials with VersaPay'
            }
        });

    } catch (error) {
        console.error(`❌ [VPAY] Credential test error:`, error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Simple health check for VersaPay routes
router.get('/health', (req, res) => {
    res.json({
        status: 'VersaPay routes active',
        timestamp: new Date().toISOString(),
        endpoints: [
            'POST /api/versapay/test-connection',
            'POST /api/versapay/test-credentials/set1',
            'POST /api/versapay/test-credentials/set2',
            'GET /api/versapay/health'
        ]
    });
});

module.exports = router;
