const fileService = require('./file.service');

exports.getFilesByNameLike = async (req, res) => {
  try {
    const { name, limit, offset } = req.query;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
 
    const files = await fileService.findByNameLike(name, limit, offset);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 