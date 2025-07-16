const promotionService = require('./promotion.service');

async function getActivePublic(req, res) {
    try {
        const promotions = await promotionService.getAllActivePublicPromotions();
        res.json(promotions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch promotions.' });
    }
}

async function getPromotionsByProductId(req, res) {
    try {
        const { productId, limit, offset } = req.query;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required.' });
        }

        const promotions = await promotionService.getPromotionsByProductId(productId, limit, offset);
        res.json(promotions);
    } catch (err) {
        console.error('Error fetching promotions by product ID:', err);
        res.status(500).json({ error: 'Failed to fetch promotions for this product.' });
    }
}

module.exports = {
    getActivePublic,
    getPromotionsByProductId,
};
