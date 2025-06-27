const brandsService = require('./brands.service');

async function getAllBrands(req, res) {
    try {
        const brands = await brandsService.getAllBrands();
        res.json(brands);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch brands.' });
    }
}

module.exports = {
    getAllBrands,
};
