const classificationService = require('./classification.service');

exports.getAllClassifications = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const classifications = await classificationService.findAll(limit, offset);
    res.json(classifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllParentClass = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const classifications = await classificationService.findAllParentClass(limit, offset);
    res.json(classifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllChildClass = async (req, res) => {
  try {
    const { limit, offset } = req.query;

    const classifications = await classificationService.findAllChildClass(limit, offset);
    res.json(classifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postClassificationsByIds = async (req, res) => {
  try {
    let { ids } = req.body;
    if (!ids) {
      return res.status(400).json({ error: 'ids is required in body' });
    }
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids must be a non-empty array' });
    }
    const classifications = await classificationService.findByIds(ids);
    if (!classifications) {
      return res.status(404).json({ error: 'Classifications not found' });
    }
    res.json(classifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
