const fetch = require('node-fetch');

async function testVersaPayEndpoints() {
    const baseUrl = 'http://localhost:3001/api/versapay';

    console.log('🧪 Testing VersaPay Integration...\n');

    // Test 1: Health Check
    try {
        console.log('1️⃣ Testing Health Endpoint...');
        const healthResponse = await fetch(`${baseUrl}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Health Check Response:', JSON.stringify(healthData, null, 2));
    } catch (error) {
        console.error('❌ Health Check Failed:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Credential Set 1
    try {
        console.log('2️⃣ Testing Credential Set 1...');
        const set1Response = await fetch(`${baseUrl}/test-credentials/set1`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const set1Data = await set1Response.json();
        console.log('📊 Credential Set 1 Results:');
        console.log('Status:', set1Response.status);
        console.log('Response:', JSON.stringify(set1Data, null, 2));
    } catch (error) {
        console.error('❌ Credential Set 1 Test Failed:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Credential Set 2
    try {
        console.log('3️⃣ Testing Credential Set 2...');
        const set2Response = await fetch(`${baseUrl}/test-credentials/set2`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const set2Data = await set2Response.json();
        console.log('📊 Credential Set 2 Results:');
        console.log('Status:', set2Response.status);
        console.log('Response:', JSON.stringify(set2Data, null, 2));
    } catch (error) {
        console.error('❌ Credential Set 2 Test Failed:', error.message);
    }

    console.log('\n🏁 VersaPay Testing Complete!');
}

// Run the tests
testVersaPayEndpoints().catch(console.error);
