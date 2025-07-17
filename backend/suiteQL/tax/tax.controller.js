const taxService = require('./tax.service');

class TaxController {
    // Get tax rates by location
    async getTaxRates(req, res) {
        try {
            const { country, province, city } = req.query;

            if (!country) {
                return res.status(400).json({ error: 'Country is required' });
            }

            const taxRates = await taxService.getTaxRatesByLocation(country, province, city);
            res.json(taxRates);
        } catch (error) {
            console.error('Error getting tax rates:', error);
            res.status(500).json({ error: 'Failed to get tax rates' });
        }
    }

    // Calculate tax for cart items
    async calculateTax(req, res) {
        try {
            const { items, country, province, city, postalCode } = req.body;

            if (!items || !Array.isArray(items)) {
                return res.status(400).json({ error: 'Items array is required' });
            }

            if (!country) {
                return res.status(400).json({ error: 'Country is required' });
            }

            const taxCalculation = await taxService.calculateCartTax(
                items,
                country,
                province,
                city,
                postalCode
            );

            res.json(taxCalculation);
        } catch (error) {
            console.error('Error calculating tax:', error);
            res.status(500).json({ error: 'Failed to calculate tax' });
        }
    }

    // Get tax rates by postal code
    async getTaxRatesByPostalCode(req, res) {
        try {
            const { country, postalCode } = req.params;

            if (!country || !postalCode) {
                return res.status(400).json({ error: 'Country and postal code are required' });
            }

            const taxRates = await taxService.getTaxRatesByPostalCode(country, postalCode);
            res.json(taxRates);
        } catch (error) {
            console.error('Error getting tax rates by postal code:', error);
            res.status(500).json({ error: 'Failed to get tax rates' });
        }
    }
}

module.exports = new TaxController();
