const express = require('express');
const router = express.Router();
const netsuiteRestService = require('./netsuiteRest.service');

// GET /* - get any resource or collection
router.get('/*', async (req, res) => {
    try {
        const recordType = req.params[0];
        const result = await netsuiteRestService.searchRecords(recordType, req.query);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message || 'Failed to fetch record.', details: err.response?.data || null });
    }
});

// POST /* - create any resource or nested resource
router.post('/*', async (req, res) => {
    try {
        const recordType = req.params[0];
        const result = await netsuiteRestService.postRecord(recordType, req.body);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message || 'Failed to create record.', details: err.response?.data || null });
    }
});

// PATCH /* - update any resource or nested resource
router.patch('/*', async (req, res) => {
    try {
        const recordType = req.params[0];
        const result = await netsuiteRestService.patchRecord(recordType, req.body);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message || 'Failed to update record.', details: err.response?.data || null });
    }
});

module.exports = router;
