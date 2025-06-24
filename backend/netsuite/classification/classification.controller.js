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
