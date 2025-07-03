const itemsService = require('./item.service');


exports.getItemsByClass = async (req, res) => {
  try {
    const { classId, limit, offset } = req.query;
    if (!classId) {
      return res.status(400).json({ error: 'classId is required' });
    }
    const items = await itemsService.findByClass(classId, limit, offset);
    if (!items) {
      return res.status(404).json({ error: 'Items not found' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }
    const item = await itemsService.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemsByIds = async (req, res) => {
  try {
    let { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ error: 'ids is required' });
    }
    // Support both comma-separated string and array
    if (typeof ids === 'string') {
      ids = ids.split(',').map(id => id.trim()).filter(Boolean);
    }
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids must be a non-empty array' });
    }
    const items = await itemsService.findByIds(ids);
    if (!items) {
      return res.status(404).json({ error: 'Items not found' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postItemsByIds = async (req, res) => {
  try {
    let { ids } = req.body;
    if (!ids) {
      return res.status(400).json({ error: 'ids is required in body' });
    }
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids must be a non-empty array' });
    }
    const items = await itemsService.findByIds(ids);
    if (!items) {
      return res.status(404).json({ error: 'Items not found' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemByIdWithBasePrice = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }
    const item = await itemsService.findItemByIdWithBasePrice(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemsByNameLike = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: 'Missing name query parameter' });
    }
    const items = await itemsService.findByNameLike(name);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postItemsByNameLike = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing name in request body' });
    }
    const items = await itemsService.findByNameLike(name);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCountByClass = async (req, res) => {
  try {
    const { classId } = req.query;
    if (!classId) {
      return res.status(400).json({ error: 'classId is required' });
    }
    const count = await itemsService.countByClass(classId);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};