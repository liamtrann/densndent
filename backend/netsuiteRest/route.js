const express = require('express');
const router = express.Router();
const netsuiteRestService = require('./netsuiteRest.service');

// GET /:recordType/:id - get a record by id
router.get('/:recordType/:id', async (req, res) => {
    try {
        const { recordType, id } = req.params;
        const result = await netsuiteRestService.getRecord(recordType, id);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message || 'Failed to fetch record.', details: err.response?.data || null });
    }
});

// GET /:recordType - search records
router.get('/:recordType', async (req, res) => {
    try {
        const { recordType } = req.params;
        const result = await netsuiteRestService.searchRecords(recordType, req.query);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message || 'Failed to search records.', details: err.response?.data || null });
    }
});

// POST /:recordType - create a new record
router.post('/:recordType', async (req, res) => {
    try {
        const { recordType } = req.params;
        const result = await netsuiteRestService.postRecord(recordType, req.body);
        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message || 'Failed to create record.', details: err.response?.data || null });
    }
});

module.exports = router;
