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
