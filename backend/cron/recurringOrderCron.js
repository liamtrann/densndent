const recurringOrderService = require('../suiteQL/recurringOrder/recurringOrder.service');
const restApiService = require('../restapi/restapi.service');

class RecurringOrderCron {
    async processRecurringOrders() {
        console.log('⏰ [CRON] Running daily recurring orders job at:', new Date().toISOString());

        try {
            const dueOrders = await recurringOrderService.getDueOrders();
            console.log(`📋 [CRON] Found ${dueOrders.length} due recurring orders to process`);

            if (dueOrders.length > 0) {
                console.log('🔄 [CRON] Processing due orders...');

                // Process each order
                for (const order of dueOrders) {
                    await this.processOrder(order);
                }

                console.log('✅ [CRON] Orders processing completed');
            } else {
                console.log('📝 [CRON] No due orders to process');
            }
        } catch (error) {
            console.error('❌ [CRON] Error processing recurring orders:', error.message);
            console.error('❌ [CRON] Stack trace:', error.stack);
        }
    }

    async processOrder(order) {
        try {
            console.log(`🔨 [CRON] Processing order ID: ${order.id} for customer: ${order.customerid}`);

            // Create a unique external ID for recurring orders
            const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
            const externalId = `recurring-${order.id}-${today}`;

            // Create sales order body
            const salesOrderBody = {
                entity: { id: order.customerid },
                item: [{
                    item: { id: order.itemid },
                    quantity: order.quantity || 1
                }],
                shipMethod: {
                    id: "20412",
                },
                externalId: externalId
            };

            // Create sales order via REST API
            const salesOrder = await restApiService.postRecord('salesOrder', salesOrderBody);
            console.log(`💰 [CRON] Created sales order ID: ${salesOrder.id} for recurring order: ${order.id}`);

            // Update next run date for the recurring order
            await this.updateNextRunDate(order);

            console.log(`✅ [CRON] Successfully processed order ID: ${order.id}`);

        } catch (error) {
            console.error(`❌ [CRON] Failed to process order ID: ${order.id}`, error.message);
            // You might want to mark this order as failed or retry later
        }
    }

    async updateNextRunDate(order) {
        try {
            // Calculate next run date based on interval and intervalUnit
            const currentDate = new Date(order.nextrun || new Date());
            const interval = parseInt(order.interval) || 1;
            const intervalunit = (order.intervalunit || 'Weeks').toLowerCase();

            // Calculate next run date based on interval unit
            const nextRunDate = new Date(currentDate);

            switch (intervalunit) {
                case 'weeks':
                case 'week':
                    nextRunDate.setDate(currentDate.getDate() + (interval * 7));
                    break;

                case 'months':
                case 'month':
                    nextRunDate.setMonth(currentDate.getMonth() + interval);
                    break;

                default:
                    console.warn(`⚠️ [CRON] Unknown interval unit '${order.intervalunit}' for order ${order.id}, defaulting to weeks`);
                    nextRunDate.setDate(currentDate.getDate() + (interval * 7));
            }

            // Format date as YYYY-MM-DD for NetSuite
            const nextRunFormatted = nextRunDate.toISOString().slice(0, 10);

            // Update the recurring order with new next run date
            await restApiService.patchRecord('customrecord_recurring_order', order.id, {
                custrecord_ro_next_run: nextRunFormatted
            });

            console.log(`📅 [CRON] Updated next run date for order ${order.id}: ${nextRunFormatted} (${interval} ${intervalunit})`);

        } catch (error) {
            console.error(`❌ [CRON] Failed to update next run date for order ${order.id}:`, error.message);
            // Don't throw error here - we still want to consider the order processing successful
        }
    }
}

module.exports = new RecurringOrderCron();
