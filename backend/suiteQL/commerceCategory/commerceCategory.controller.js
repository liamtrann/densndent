const commerceCategoryService = require('./commerceCategory.service');

exports.getAllCommerceCategories = async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const categories = await commerceCategoryService.findAll(limit, offset);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCommerceCategoryById = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'id is required' });
        }
        const category = await commerceCategoryService.findById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSubCategoryByParentById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'id is required' });
        }
        const parent = await commerceCategoryService.getSubCategoryByParentById(id);
        res.json({ parent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
