// backend/suiteQL/shipItem/shipItem.service.js
const SuiteQLService = require('../suiteql.service');

class ShipItemService {
    async getShippingMethod(id) {
        if (!id) throw new Error('ID is required');
        const sql = `SELECT itemid, description, id, shippingflatrateamount, subsidiary, freeifordertotalisoveramount FROM ShipItem WHERE id = '${id}'`;
        const result = await SuiteQLService.querySuiteQL(sql);
        return result.items || [];
    }

    // Add more methods as needed
}

module.exports = new ShipItemService();
