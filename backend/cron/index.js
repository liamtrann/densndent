const cron = require('node-cron');
const recurringOrderCron = require('./recurringOrderCron');

class CronManager {
    constructor() {
        this.jobs = [];
    }

    // Initialize all cron jobs
    initializeCronJobs() {
        console.log('🚀 Initializing cron jobs...');

        // Start recurring order cron job
        this.startRecurringOrderCron();

        console.log(`✅ ${this.jobs.length} cron job(s) started successfully`);
    }

    startRecurringOrderCron() {
        const job = cron.schedule('5 0 * * *', async () => {
            await recurringOrderCron.processRecurringOrders();
        }, {
            scheduled: true,
            timezone: "America/New_York"
        });

        this.jobs.push({
            name: 'Recurring Orders',
            schedule: '5 0 * * *',
            job: job
        });

        console.log('⏰ Recurring Orders cron job scheduled: Daily at 00:05');
    }

    // Stop all cron jobs
    stopAllJobs() {
        console.log('🛑 Stopping all cron jobs...');
        this.jobs.forEach(({ name, job }) => {
            job.destroy();
            console.log(`❌ Stopped: ${name}`);
        });
        this.jobs = [];
    }

    // Get status of all jobs
    getJobsStatus() {
        return this.jobs.map(({ name, schedule }) => ({
            name,
            schedule,
            status: 'running'
        }));
    }
}

module.exports = new CronManager();
