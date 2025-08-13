// Test script for the full cron job with Bull Queue
require('dotenv').config();

const RecurringOrderCron = require('./cron/recurringOrderCron');

async function testCronJob() {
    console.log('🧪 [TEST] Testing Cron Job with Bull Queue...');
    console.log(`🌍 [TEST] Environment: ${process.env.NODE_ENV || 'development'}`);

    try {
        console.log('⏰ [TEST] Running processRecurringOrders...');
        await RecurringOrderCron.processRecurringOrders();
        console.log('✅ [TEST] Cron job completed successfully');

        console.log('⏳ [TEST] Waiting 15 seconds to see queue processing...');
        console.log('💡 [TEST] Check your main app console for worker processing logs');

        setTimeout(() => {
            console.log('🏁 [TEST] Cron test completed');
            console.log('🔍 [TEST] Check queue status: http://localhost:3001/api/queue/status');
            process.exit(0);
        }, 15000); // Wait 15 seconds

    } catch (error) {
        console.error('❌ [TEST] Cron job test failed:', error.message);
        console.error('💡 [TEST] Make sure your app is running with: npm run dev');
        process.exit(1);
    }
}

testCronJob();
