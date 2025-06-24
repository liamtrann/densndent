const itemsService = require('./items.service');


exports.getItemsByClass = async (req, res) => {
  try {
    const { classId, limit, offset } = req.query;
    if (!classId) {
      return res.status(400).json({ error: 'classId is required' });
    }
    const items = await itemsService.findByClass(classId, limit, offset);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 