const itemsService = require('./item.service');
const { validateUserAccess } = require('../../auth/middleware');

exports.getItemsByClass = async (req, res) => {
  try {
    const { classId, limit, offset, sort, minPrice, maxPrice } = req.query;
    if (!classId) {
      return res.status(400).json({ error: 'classId is required' });
    }
    const items = await itemsService.findByField('class', classId, limit, offset, sort, minPrice, maxPrice);
    if (!items) {
      return res.status(404).json({ error: 'Items not found' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemsByBrand = async (req, res) => {
  try {
    const { brand, limit, offset, sort, minPrice, maxPrice } = req.query;
    if (!brand) {
      return res.status(400).json({ error: 'brand is required' });
    }
    const items = await itemsService.findByField('brand', brand, limit, offset, sort, minPrice, maxPrice);
    if (!items) {
      return res.status(404).json({ error: 'Items not found' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getItemsByClassAndBrand = async (req, res) => {
  try {
    const { classId, brand, limit, offset, sort, minPrice, maxPrice } = req.query;
    if (!classId || !brand) {
      return res.status(400).json({ error: 'classId and brand are required' });
    }
    const items = await itemsService.findByClassAndBrand(classId, brand, limit, offset, sort, minPrice, maxPrice);
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

exports.postGetItemsByParent = async (req, res) => {
  try {
    const { limit, offset, sort, minPrice, maxPrice } = req.query;
    let { parent } = req.body;
    if (!parent) {
      return res.status(400).json({ error: 'parent is required in body' });
    }
    const items = await itemsService.findByParent(parent, limit, offset, sort, minPrice, maxPrice);
    if (!items) {
      return res.status(404).json({ error: 'Items not found' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemsByIds = async (req, res) => {
  try {
    const { limit, offset, sort, minPrice, maxPrice } = req.query;
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
    const items = await itemsService.findByIds(ids, limit, offset, sort, minPrice, maxPrice);
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
    const { limit, offset, sort, minPrice, maxPrice } = req.query;
    let { ids } = req.body;
    if (!ids) {
      return res.status(400).json({ error: 'ids is required in body' });
    }
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids must be a non-empty array' });
    }
    const items = await itemsService.findByIds(ids, limit, offset, sort, minPrice, maxPrice);
    if (!items) {
      return res.status(404).json({ error: 'Items not found' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.getItemByIdWithBasePrice = async (req, res) => {
//   try {
//     const { id } = req.query;
//     if (!id) {
//       return res.status(400).json({ error: 'id is required' });
//     }
//     const item = await itemsService.findItemByIdWithBasePrice(id);
//     if (!item) {
//       return res.status(404).json({ error: 'Item not found' });
//     }
//     res.json(item);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.postItemsByNameLike = async (req, res) => {
  try {
    const { limit, offset, sort, minPrice, maxPrice } = req.query;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing name in request body' });
    }
    const items = await itemsService.findByField("name", name, limit, offset, sort, minPrice, maxPrice);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCountByClass = async (req, res) => {
  try {
    const { classId, minPrice, maxPrice } = req.query;
    if (!classId) {
      return res.status(400).json({ error: 'classId is required' });
    }
    const count = await itemsService.countByField('class', classId, minPrice, maxPrice);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getCountByName = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    const count = await itemsService.countByField('name', name, minPrice, maxPrice);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCountByBrand = async (req, res) => {
  try {
    const { brand, minPrice, maxPrice } = req.query;
    if (!brand) {
      return res.status(400).json({ error: 'brand is required' });
    }
    const count = await itemsService.countByField('brand', brand, minPrice, maxPrice);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemsByCategory = async (req, res) => {
  try {
    const { category, limit, offset, sort, minPrice, maxPrice } = req.query;
    if (!category) {
      return res.status(400).json({ error: 'category is required' });
    }
    const items = await itemsService.findByCategory(category, limit, offset, sort, minPrice, maxPrice);
    if (!items) {
      return res.status(404).json({ error: 'Items not found' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCountByCategory = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    if (!category) {
      return res.status(400).json({ error: 'category is required' });
    }
    const count = await itemsService.countByCategory(category, minPrice, maxPrice);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { limit, offset, sort, minPrice, maxPrice } = req.query;
    const items = await itemsService.findAllProducts(limit, offset, sort, minPrice, maxPrice);
    if (!items) {
      return res.status(404).json({ error: 'Items not found' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCountAllProducts = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    const count = await itemsService.countByField('all', null, minPrice, maxPrice);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


