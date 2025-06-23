const classificationService = require('./classification.service');

exports.getAllClassifications = async (req, res) => {
  try {
    const { limit, offset, parent, parentId } = req.query;
    const classifications = await classificationService.findAll(limit, offset, parent, parentId);
    res.json(classifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
