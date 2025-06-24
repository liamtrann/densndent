const pricingService = require('./pricing.service');

exports.getPricingByItemId = async (req, res) => {
  try {
    const { itemId, limit, offset } = req.query;
    if (!itemId) {
      return res.status(400).json({ error: 'itemId is required' });
    }
    const pricing = await pricingService.findByItemId(itemId, limit, offset);
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 