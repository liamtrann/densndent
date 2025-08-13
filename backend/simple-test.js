// Simple test to verify Bull Queue is working
// Run this with: node simple-test.js

require('dotenv').config();

async function simpleTest() {
    console.log('🧪 [TEST] Starting simple Bull Queue test...');

    try {
        // Import the cron job
        const RecurringOrderCron = require('./cron/recurringOrderCron');

        console.log('⏰ [TEST] Running processRecurringOrders...');
        await RecurringOrderCron.processRecurringOrders();

        console.log('✅ [TEST] Test completed successfully!');
        console.log('💡 [TEST] Check your main app console for processing logs');

    } catch (error) {
        console.error('❌ [TEST] Test failed:', error.message);
    }

    process.exit(0);
}

simpleTest();
