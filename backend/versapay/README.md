# VersaPay Integration Testing Guide

## 🚀 Testing Your VersaPay Credentials

Your VersaPay integration is now set up! Here's how to test it:

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```

### 2. Test Endpoints Available

#### Health Check
```
GET http://localhost:3001/api/versapay/health
```

#### Test Environment Variables (if set)
```
POST http://localhost:3001/api/versapay/test-connection
```

#### Test Specific Credential Sets
```
POST http://localhost:3001/api/versapay/test-credentials/set1
POST http://localhost:3001/api/versapay/test-credentials/set2
```

### 3. Postman Collection

Import these requests into Postman:

#### Request 1: Health Check
- **Method**: GET
- **URL**: `http://localhost:3001/api/versapay/health`
- **Expected**: Status info and available endpoints

#### Request 2: Test Credential Set 1
- **Method**: POST  
- **URL**: `http://localhost:3001/api/versapay/test-credentials/set1`
- **Body**: None required
- **Expected**: Connection test results for both UAT and Production environments

#### Request 3: Test Credential Set 2
- **Method**: POST
- **URL**: `http://localhost:3001/api/versapay/test-credentials/set2`
- **Body**: None required
- **Expected**: Connection test results for both UAT and Production environments

### 4. Environment Variables Setup (Optional)

If you want to test using environment variables, add these to your `.env` file:

```env
# VersaPay Credentials - Set 1
VPAY_API_TOKEN=44sHrnhkX9387Y2DWd4sJaCkHaP975sH
VPAY_API_KEY=10044995
VPAY_SETTLEMENT_TOKEN=25651540015

# Or use Set 2
# VPAY_API_TOKEN=ty6m3jrvn3E56B7DbjrFu4g4aq3WsBcF
# VPAY_API_KEY=10044813
# VPAY_SETTLEMENT_TOKEN=83404630014
```

### 5. Expected Results

✅ **Successful Response Example**:
```json
{
  "credentialSet": "set1",
  "credentialName": "Credential Set 1",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "credentials": {
    "apiToken": "44sHrnhk***",
    "apiKey": "10044995",
    "settlementToken": "25651540015"
  },
  "results": [
    {
      "environment": "UAT",
      "url": "https://ecommerce-api-uat.versapay.com/api/v2/sessions",
      "status": 200,
      "success": true,
      "response": {
        "id": "session_12345..."
      }
    }
  ],
  "summary": {
    "totalTests": 2,
    "successful": 1,
    "failed": 1,
    "recommendation": "Use UAT environment"
  }
}
```

❌ **Error Response Example**:
```json
{
  "environment": "Production",
  "status": 401,
  "success": false,
  "response": {
    "error": "Unauthorized",
    "message": "Invalid API credentials"
  }
}
```

### 6. What to Look For

1. **Status 200 + Session ID**: ✅ Credentials work perfectly
2. **Status 401**: ❌ Invalid credentials
3. **Status 404**: ❌ Wrong environment or endpoint
4. **Network Error**: ❌ Connection issues

### 7. Next Steps After Testing

Once you confirm which credentials and environment work:

1. **Update Environment Variables**: Set the working credentials in your production `.env`
2. **Configure Environment**: Use UAT for testing, Production for live transactions
3. **Test Payment Flow**: Create actual payment sessions
4. **Integration**: Connect to your checkout process

### 8. Troubleshooting

#### Common Issues:
- **"fetch is not defined"**: ✅ Fixed - node-fetch installed
- **401 Unauthorized**: Check if credentials are correct
- **Network timeout**: VersaPay servers might be down
- **CORS errors**: Only applies to frontend requests

#### Debug Mode:
Watch the console logs when making requests - they show detailed information:
```
🔍 [VPAY] Testing Credential Set 1...
🔍 [VPAY] Testing UAT environment...
📊 [VPAY] UAT Result: { status: 200, success: true, hasSessionId: true }
✅ [VPAY] Connection successful! Session ID: sess_abc123...
```

### 9. VersaPay Service Usage

For custom testing, you can also use the VersaPay service directly:

```javascript
const VersaPayService = require('./versapay/versapay.service');

const vpay = new VersaPayService();
vpay.setEnvironment('uat'); // or 'production'

// Test connection
const result = await vpay.testConnection('set1');

// Create payment session
const session = await vpay.createPaymentSession({
  amount: 2500, // $25.00 in cents
  currency: 'CAD',
  customerEmail: 'customer@example.com',
  reference: 'ORDER-12345'
});
```

---

🎯 **Ready to test! Run the server and try the endpoints above.**
