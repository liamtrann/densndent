const saleInvoicedService = require('./saleInvoiced.service');

exports.getTopSalesInvoiced = async (req, res) => {
    try {
        const { limit, fromDate } = req.query;
        const data = await saleInvoicedService.getTopSalesInvoiced(limit, fromDate);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTopSalesWithDetails = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const fromDate = req.query.fromDate || '2024-01-01';
        const result = await saleInvoicedService.getTopSalesWithDetails(limit, fromDate);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch top sales with details.' });
    }
};
