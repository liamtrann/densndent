const itemsService = require('./item.service');
const customerService = require('../customer/customer.service');


exports.getItemsByClass = async (req, res) => {
  try {
    const { classId, limit, offset, sort } = req.query;
    if (!classId) {
      return res.status(400).json({ error: 'classId is required' });
    }
    const items = await itemsService.findByField('class', classId, limit, offset, sort);
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
    const { brand, limit, offset, sort } = req.query;
    if (!brand) {
      return res.status(400).json({ error: 'brand is required' });
    }
    const items = await itemsService.findByField('brand', brand, limit, offset, sort);
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
    const { classId, brand, limit, offset, sort } = req.query;
    if (!classId || !brand) {
      return res.status(400).json({ error: 'classId and brand are required' });
    }
    const items = await itemsService.findByClassAndBrand(classId, brand, limit, offset, sort);
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
    let { parent } = req.body;
    if (!parent) {
      return res.status(400).json({ error: 'parent is required in body' });
    }
    const items = await itemsService.findByParent(parent);
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
    const { limit, offset, sort } = req.query;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing name in request body' });
    }
    const items = await itemsService.findByField("name", name, limit, offset, sort);
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
    const count = await itemsService.countByField('class', classId);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getCountByName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    const count = await itemsService.countByField('name', name);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCountByBrand = async (req, res) => {
  try {
    const { brand } = req.query;
    if (!brand) {
      return res.status(400).json({ error: 'brand is required' });
    }
    const count = await itemsService.countByField('brand', brand);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemsByCategory = async (req, res) => {
  try {
    const { category, limit, offset, sort } = req.query;
    if (!category) {
      return res.status(400).json({ error: 'category is required' });
    }
    const items = await itemsService.findByCategory(category, limit, offset, sort);
    if (!items) {
      return res.status(404).json({ error: 'Items not found' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemsByUserOrderHistory = async (req, res) => {
  try {
    const { userId, limit, offset } = req.query;

    // Get Auth0 user info from the JWT token (req.auth is set by checkJwt middleware)
    const userEmail = req.auth?.['https://densdente.com/email'];

    if (!userEmail) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Find user in your system by email to get their database user ID
    const customers = await customerService.findByEmail(userEmail, 1, 0);
    const customer = customers?.[0];

    if (!customer) {
      return res.status(404).json({ error: 'User not found in system' });
    }

    // Check if the requested userId matches the authenticated user's database ID
    if (userId !== customer.id) {
      return res.status(403).json({ error: 'Forbidden: You can only access your own order history' });
    }

    const items = await itemsService.findByUserOrderHistory(userId, limit, offset);
    if (!items) {
      return res.status(404).json({ error: 'Items not found' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

