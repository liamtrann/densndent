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
