const promotionService = require('./promotion.service');

async function getActivePublic(req, res) {
    try {
        const promotions = await promotionService.findAllActivePublic();
        res.json(promotions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch promotions.' });
    }
}

module.exports = {
    getActivePublic,
};
