const recurringOrderService = require('../suiteQL/recurringOrder/recurringOrder.service');
const restApiService = require('../restapi/restapi.service');

class RecurringOrderCron {
    async processRecurringOrders() {
        console.log('⏰ [CRON] Running daily recurring orders job at:', new Date().toISOString());

        try {
            const dueOrders = await recurringOrderService.getDueOrders();
            console.log(`📋 [CRON] Found ${dueOrders.length} due recurring orders to process`);

            if (dueOrders.length === 0) {
                console.log('� [CRON] No due orders to process');
                return;
            }

            console.log('�🔄 [CRON] Processing due orders...');

            const results = {
                success: 0,
                failed: 0,
                errors: []
            };

            // Process each order with individual error handling
            for (const order of dueOrders) {
                try {
                    await this.processOrder(order);
                    results.success++;
                    console.log(`✅ [CRON] Successfully processed order ID: ${order.id}`);
                } catch (error) {
                    results.failed++;
                    results.errors.push({
                        orderId: order.id,
                        customerId: order.customerid,
                        error: error.message
                    });

                    // Mark order for retry instead of just failing
                    await this.markOrderAsFailedAndRetryLater(order.id, error.message);

                    console.error(`❌ [CRON] Failed to process order ID: ${order.id} - ${error.message}`);
                }
            }

            // Summary report
            console.log(`📊 [CRON] Processing Summary: ${results.success} successful, ${results.failed} failed`);

            if (results.errors.length > 0) {
                console.log('� [CRON] Failed orders:', JSON.stringify(results.errors, null, 2));
            }

        } catch (error) {
            console.error('❌ [CRON] Critical error in recurring orders job:', error.message);
            console.error('❌ [CRON] Stack trace:', error.stack);
        }
    }

    async processOrder(order) {
        console.log(`🔨 [CRON] Processing order ID: ${order.id} for customer: ${order.customerid}`);

        // Validate order data first
        if (!order.customerid || !order.itemid) {
            throw new Error(`Invalid order data: missing customer ID (${order.customerid}) or item ID (${order.itemid})`);
        }

        // Create a unique external ID for recurring orders
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
        const externalId = `recurring-${order.id}-${today}`;

        // Create sales order body
        const salesOrderBody = {
            entity: { id: order.customerid },
            item: {
                items: [
                    {
                        item: { id: order.itemid },
                        quantity: Number(order.quantity) || 1
                    }
                ]
            },
            shipMethod: {
                id: "20412",
            },
            externalId: externalId
        };

        let salesOrder = null;

        try {
            // Create sales order via REST API
            salesOrder = await restApiService.postRecord('salesOrder', salesOrderBody);
            console.log(`💰 [CRON] Created sales order ID: ${salesOrder.id} for recurring order: ${order.id}`);

            // Only update next run date if order creation was successful
            await this.updateNextRunDate(order);
            console.log(`📅 [CRON] Updated next run date for recurring order: ${order.id}`);

        } catch (orderCreationError) {
            // Log the detailed error but don't update next run date
            console.error(`❌ [CRON] Sales order creation failed for recurring order ${order.id}:`, {
                error: orderCreationError.message,
                orderData: salesOrderBody,
                customerId: order.customerid,
                itemId: order.itemid
            });

            // Rethrow with more context
            throw new Error(`Sales order creation failed: ${orderCreationError.message}`);
        }
    }

    async updateNextRunDate(order) {
        try {
            // Calculate next run date based on interval and intervalUnit
            const currentDate = new Date(order.nextrun || new Date());
            const interval = parseInt(order.interval) || 1;
            const intervalunit = (order.intervalunit || 'months').toLowerCase();

            // Calculate next run date based on interval unit
            const nextRunDate = new Date(currentDate);

            switch (intervalunit) {
                case 'weeks':
                    nextRunDate.setDate(currentDate.getDate() + (interval * 7));
                    break;

                case 'months':
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

    async markOrderAsFailedAndRetryLater(orderId, errorMessage) {
        try {
            // Mark order as failed and set retry date (e.g., try again tomorrow)
            const retryDate = new Date();
            retryDate.setDate(retryDate.getDate() + 1); // Retry tomorrow
            const retryFormatted = retryDate.toISOString().slice(0, 10);

            await restApiService.patchRecord('customrecord_recurring_order', orderId, {
                custrecord_ro_next_run: retryFormatted,
                custrecord_ro_retry_count: 1 // You might want to increment this if it exists
            });

            console.log(`🔄 [CRON] Marked order ${orderId} for retry on ${retryFormatted}`);
        } catch (error) {
            console.error(`❌ [CRON] Failed to mark order ${orderId} for retry:`, error.message);
        }
    }
}

module.exports = new RecurringOrderCron();
