const promotionService = require("./promotion.service");

async function getActivePublic(req, res) {
  try {
    const promotions = await promotionService.getAllActivePublicPromotions();
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch promotions." });
  }
}

async function getPromotionsByProductId(req, res) {
  try {
    const { productId, limit, offset } = req.query;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    const promotions = await promotionService.getPromotionsByProductId(
      productId,
      limit,
      offset
    );
    res.json(promotions);
  } catch (err) {
    console.error("Error fetching promotions by product ID:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch promotions for this product." });
  }
}

async function getAllProductsWithActivePromotions(req, res) {
  try {
    const { limit, offset, sort, minPrice, maxPrice } = req.query;
    const products = await promotionService.getAllProductsWithActivePromotions(
      limit,
      offset,
      sort,
      minPrice,
      maxPrice
    );
    res.json(products);
  } catch (err) {
    console.error("Error fetching products with active promotions:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch products with active promotions." });
  }
}

async function countProductsWithActivePromotions(req, res) {
  try {
    const { minPrice, maxPrice } = req.query;
    const count = await promotionService.countProductsWithActivePromotions(
      minPrice,
      maxPrice
    );
    res.json({ count });
  } catch (err) {
    console.error("Error counting products with active promotions:", err);
    res
      .status(500)
      .json({ error: "Failed to count products with active promotions." });
  }
}

module.exports = {
  getActivePublic,
  getPromotionsByProductId,
  getAllProductsWithActivePromotions,
  countProductsWithActivePromotions,
};
