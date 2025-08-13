// Test script to verify Bull Queue setup
require('dotenv').config();

const { enqueueOrder } = require('./queue/orderQueue');

async function testQueue() {
    console.log('🧪 [TEST] Testing Bull Queue setup...');
    console.log(`🌍 [TEST] Environment: ${process.env.NODE_ENV || 'development'}`);

    // Test order data
    const testOrder = {
        id: 'test-' + Date.now(),
        customerid: '12345', // Replace with real customer ID from your NetSuite
        itemid: '67890',     // Replace with real item ID from your NetSuite
        quantity: 2,
        interval: 1,
        intervalunit: 'months',
        nextrun: new Date().toISOString().slice(0, 10)
    };

    try {
        console.log('📤 [TEST] Enqueuing test order:', testOrder);
        const job = await enqueueOrder(testOrder);
        console.log(`✅ [TEST] Test order enqueued successfully! Job ID: ${job.id}`);

        console.log('⏳ [TEST] Waiting 10 seconds to see processing...');
        console.log('💡 [TEST] Check your main app console for worker processing logs');

        setTimeout(() => {
            console.log('🏁 [TEST] Test completed. Check the main app logs for processing results.');
            console.log('🔍 [TEST] You can also check: http://localhost:3001/api/queue/status');
            process.exit(0);
        }, 10000); // Wait 10 seconds

    } catch (error) {
        console.error('❌ [TEST] Queue test failed:', error.message);
        console.error('💡 [TEST] Make sure Redis is running: redis-server');
        process.exit(1);
    }
}

testQueue();