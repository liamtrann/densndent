const fetch = require('node-fetch');

class VersaPayService {
    constructor() {
        this.baseUrls = {
            uat: 'https://ecommerce-api-uat.versapay.com/api/v2',
            production: 'https://ecommerce-api.versapay.com/api/v2'
        };

        // Default to environment variables
        this.defaultCredentials = {
            apiToken: process.env.VPAY_API_TOKEN,
            apiKey: process.env.VPAY_API_KEY,
            settlementToken: process.env.VPAY_SETTLEMENT_TOKEN
        };

        // Specific credential sets for testing
        this.credentialSets = {
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

        this.currentEnvironment = 'uat'; // Default to UAT for testing
    }

    // Set environment (uat or production)
    setEnvironment(env) {
        if (['uat', 'production'].includes(env)) {
            this.currentEnvironment = env;
            console.log(`🔧 [VPAY] Environment set to: ${env.toUpperCase()}`);
        } else {
            throw new Error('Environment must be "uat" or "production"');
        }
    }

    // Get base URL for current environment
    getBaseUrl() {
        return this.baseUrls[this.currentEnvironment];
    }

    // Test connection with specific credentials
    async testConnection(credentialSet = null) {
        try {
            const creds = credentialSet ?
                this.credentialSets[credentialSet] :
                this.defaultCredentials;

            if (!creds || !creds.apiToken || !creds.apiKey) {
                throw new Error('Missing required credentials (apiToken, apiKey)');
            }

            console.log('🔍 [VPAY] Testing connection with:', {
                environment: this.currentEnvironment,
                apiToken: `${creds.apiToken.substring(0, 8)}***`,
                apiKey: creds.apiKey,
                credentialSet: credentialSet || 'environment'
            });

            const response = await this.makeRequest('/sessions', {
                method: 'POST',
                body: {
                    gatewayAuthorization: {
                        apiToken: creds.apiToken,
                        apiKey: creds.apiKey,
                    },
                    options: {}
                }
            });

            if (response.success) {
                console.log('✅ [VPAY] Connection successful! Session ID:', response.data.id);
                return {
                    success: true,
                    sessionId: response.data.id,
                    environment: this.currentEnvironment,
                    credentialSet: credentialSet
                };
            } else {
                throw new Error(`Connection failed: ${response.error}`);
            }

        } catch (error) {
            console.error('❌ [VPAY] Connection test failed:', error.message);
            return {
                success: false,
                error: error.message,
                environment: this.currentEnvironment,
                credentialSet: credentialSet
            };
        }
    }

    // Create payment session
    async createPaymentSession(orderData, credentialSet = null) {
        try {
            const creds = credentialSet ?
                this.credentialSets[credentialSet] :
                this.defaultCredentials;

            if (!creds || !creds.apiToken || !creds.apiKey) {
                throw new Error('Missing required credentials');
            }

            const sessionData = {
                gatewayAuthorization: {
                    apiToken: creds.apiToken,
                    apiKey: creds.apiKey,
                },
                transaction: {
                    amount: orderData.amount || 100, // Default $1.00 for testing
                    currency: orderData.currency || 'CAD',
                    reference: orderData.reference || `ORDER-${Date.now()}`,
                    description: orderData.description || 'Test Order'
                },
                customer: {
                    email: orderData.customerEmail || 'test@example.com',
                    firstName: orderData.firstName || 'Test',
                    lastName: orderData.lastName || 'Customer',
                    phone: orderData.phone || '555-1234'
                },
                options: {
                    returnUrl: orderData.returnUrl || 'https://yourdomain.com/payment/success',
                    cancelUrl: orderData.cancelUrl || 'https://yourdomain.com/payment/cancel'
                }
            };

            console.log('💳 [VPAY] Creating payment session:', {
                amount: sessionData.transaction.amount,
                currency: sessionData.transaction.currency,
                reference: sessionData.transaction.reference,
                environment: this.currentEnvironment
            });

            const response = await this.makeRequest('/sessions', {
                method: 'POST',
                body: sessionData
            });

            if (response.success) {
                console.log('✅ [VPAY] Payment session created:', response.data.id);
                return {
                    success: true,
                    sessionId: response.data.id,
                    paymentUrl: response.data.iframe_url,
                    data: response.data
                };
            } else {
                throw new Error(`Session creation failed: ${response.error}`);
            }

        } catch (error) {
            console.error('❌ [VPAY] Payment session creation failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get session status
    async getSessionStatus(sessionId, credentialSet = null) {
        try {
            const creds = credentialSet ?
                this.credentialSets[credentialSet] :
                this.defaultCredentials;

            if (!sessionId) {
                throw new Error('Session ID is required');
            }

            console.log(`🔍 [VPAY] Getting session status for: ${sessionId}`);

            const response = await this.makeRequest(`/sessions/${sessionId}`, {
                method: 'GET',
                credentials: creds
            });

            if (response.success) {
                console.log('📊 [VPAY] Session status:', response.data.status);
                return {
                    success: true,
                    status: response.data.status,
                    data: response.data
                };
            } else {
                throw new Error(`Status check failed: ${response.error}`);
            }

        } catch (error) {
            console.error('❌ [VPAY] Session status check failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Generic request helper
    async makeRequest(endpoint, options = {}) {
        try {
            const url = `${this.getBaseUrl()}${endpoint}`;
            const creds = options.credentials || this.defaultCredentials;

            const requestOptions = {
                method: options.method || 'GET',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json',
                    ...options.headers
                }
            };

            // Add body for POST requests
            if (options.body) {
                requestOptions.body = JSON.stringify(options.body);
            }

            // Add authorization if credentials provided and not already in body
            if (creds && !options.body?.gatewayAuthorization && options.method === 'GET') {
                requestOptions.headers['Authorization'] = `Bearer ${creds.apiToken}`;
            }

            console.log(`🌐 [VPAY] ${options.method || 'GET'} ${url}`);

            const response = await fetch(url, requestOptions);
            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    status: response.status,
                    data: data
                };
            } else {
                return {
                    success: false,
                    status: response.status,
                    error: data.message || data.error || 'Unknown error',
                    data: data
                };
            }

        } catch (error) {
            console.error('🚨 [VPAY] Request failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get available credential sets for testing
    getCredentialSets() {
        return Object.keys(this.credentialSets).map(key => ({
            key,
            name: this.credentialSets[key].name,
            apiKey: this.credentialSets[key].apiKey,
            settlementToken: this.credentialSets[key].settlementToken
        }));
    }

    // Test all credential sets across all environments
    async testAllCredentials() {
        const results = [];
        const environments = ['uat', 'production'];
        const credentialSets = ['set1', 'set2'];

        for (const env of environments) {
            this.setEnvironment(env);

            for (const credSet of credentialSets) {
                const result = await this.testConnection(credSet);
                results.push({
                    environment: env,
                    credentialSet: credSet,
                    credentialName: this.credentialSets[credSet].name,
                    ...result
                });
            }
        }

        return results;
    }
}

module.exports = VersaPayService;
