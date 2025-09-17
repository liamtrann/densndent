const { runQueryWithPagination } = require("../util");

class ItemsService {
  constructor() {
    this.recordType = "item";
  }

  // Inline view that gets individual promotion records per item
  _getPromotion(alias = "i") {
    return `LEFT JOIN (SELECT pcdi.discounteditem AS item_id, pc.id AS promotioncode_id, pc.code AS promotion_code, pc.name AS promotion_name, TO_CHAR(pc.startdate,'YYYY-MM-DD') AS startdate, TO_CHAR(pc.enddate,'YYYY-MM-DD') AS enddate, pc.ispublic, pc.isinactive, pc.fixedprice, pc.itemquantifier FROM promotionCodeDiscountedItems pcdi JOIN promotionCode pc ON pcdi.promotionCode = pc.id WHERE (pc.startdate IS NULL OR pc.startdate <= TRUNC(SYSDATE)) AND (pc.enddate IS NULL OR pc.enddate >= TRUNC(SYSDATE)) AND pc.isinactive = 'F') promo ON promo.item_id = ${alias}.id`;
  }

  // Helper method for generating sort clause
  _getSortBy(sort, customSort = null) {
    if (customSort) return customSort;
    
    const allowedOrders = ["asc", "desc"];
    if (sort && allowedOrders.includes(sort.toLowerCase())) {
      return ` ORDER BY ip.price ${sort.toLowerCase()}`;
    } else {
      return ` ORDER BY i.itemid ASC`;
    }
  }

  // Helper method for building base item conditions
  _getBaseConditions() {
    return [`i.isonline = 'T'`, `i.isinactive = 'F'`];
  }

  // Helper method for adding price filter conditions
  _addPriceConditions(conditions, minPrice, maxPrice) {
    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      conditions.push(`ip.price >= ${parseFloat(minPrice)}`);
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      conditions.push(`ip.price <= ${parseFloat(maxPrice)}`);
    }
  }

  // Helper method to check if price filtering is needed
  _hasPriceFilter(minPrice, maxPrice) {
    return (minPrice !== undefined && minPrice !== null && minPrice !== "") ||
           (maxPrice !== undefined && maxPrice !== null && maxPrice !== "");
  }

  // Standard item fields for most queries
  _getStandardFields() {
    return `i.id, i.itemid, i.totalquantityonhand, i.stockdescription, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, promo.promotioncode_id, promo.promotion_code, promo.promotion_name, promo.startdate, promo.enddate, promo.ispublic, promo.isinactive, promo.fixedprice, promo.itemquantifier`;
  }

  // Extended item fields for detailed queries
  _getExtendedFields() {
    return `i.id, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.custitemcustitem_dnd_brand AS branditem, i.totalquantityonhand, i.stockdescription, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, ip.item, ip.price, promo.promotioncode_id, promo.promotion_code, promo.promotion_name, promo.startdate, promo.enddate, promo.ispublic, promo.isinactive, promo.fixedprice, promo.itemquantifier`;
  }

  // Basic item fields for simple queries
  _getBasicFields() {
    return `i.id, i.itemid, i.stockdescription, ip.price, promo.promotioncode_id, promo.promotion_code, promo.promotion_name, promo.startdate, promo.enddate, promo.ispublic, promo.isinactive, promo.fixedprice, promo.itemquantifier`;
  }

  // Standard table joins for most queries
  _getStandardJoins(joinType = "JOIN") {
    return `${joinType} itemprice ip ON i.id = ip.item AND ip.pricelevel = 1 ${this._getPromotion("i")}`;
  }

  // Generic query builder for items
  async _buildAndExecuteQuery(fields, joins, baseConditions, additionalConditions, sortBy, limit, offset) {
    const conditions = [...baseConditions, ...additionalConditions];
    const sql = `SELECT ${fields} FROM item i ${joins} WHERE ${conditions.join(" AND ")} ${sortBy}`;
    const results = await runQueryWithPagination(sql, limit, offset);
    return results.items || [];
  }

  // Generic count query builder
  async _buildAndExecuteCountQuery(baseConditions, additionalConditions, needsPriceJoin = false) {
    const conditions = [...baseConditions, ...additionalConditions];
    const baseQuery = `SELECT COUNT(*) AS count FROM item i`;
    const priceJoin = needsPriceJoin ? ` JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1` : '';
    const sql = `${baseQuery}${priceJoin} WHERE ${conditions.join(" AND ")}`;
    const results = await runQueryWithPagination(sql, 1, 0);
    return results.items?.[0]?.count || 0;
  }

  // Generalized method for filtering by a field and price range, with pagination and sorting
  async findByField(field, value, limit, offset, sort, minPrice, maxPrice) {
    // Allowed fields for filtering (maps logical name to DB column)
    const allowedFields = {
      class: "i.class",
      brand: "i.custitemcustitem_dnd_brand",
      name: "i.itemid",
    };

    // Get DB column for the field
    const column = allowedFields[field];
    if (!column) {
      throw new Error("Invalid filter field");
    }

    // Build filter conditions
    const baseConditions = this._getBaseConditions();
    const additionalConditions = [];

    // Field-based filter
    if (field === "name") {
      additionalConditions.push(`LOWER(${column}) LIKE '%' || LOWER('${value}') || '%'`);
    } else {
      additionalConditions.push(`LOWER(${column}) = LOWER('${value}')`);
    }

    // Price range filter
    this._addPriceConditions(additionalConditions, minPrice, maxPrice);

    // Execute query
    const fields = `${this._getStandardFields()}, i.custitemcustitem_dnd_brand AS branditem`;
    const joins = this._getStandardJoins();
    const sortBy = this._getSortBy(sort);

    return await this._buildAndExecuteQuery(fields, joins, baseConditions, additionalConditions, sortBy, limit, offset);
  }

  // Find items by both class and brand
  async findByClassAndBrand(classId, brand, limit, offset, sort, minPrice, maxPrice) {
    const sortBy = this._getSortBy(sort);
    
    // Build filter conditions
    let conditions = [
      `i.isonline = 'T'`,
      `i.isinactive='F'`,
      `i.class='${classId}'`,
      `i.custitemcustitem_dnd_brand='${brand}'`
    ];

    // Price range filter
    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      conditions.push(`ip.price >= ${parseFloat(minPrice)}`);
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      conditions.push(`ip.price <= ${parseFloat(maxPrice)}`);
    }

    const sql = `SELECT i.id, i.itemid, i.totalquantityonhand, i.stockdescription, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, promo.promotioncode_id, promo.promotion_code, promo.promotion_name, promo.startdate, promo.enddate, promo.ispublic, promo.isinactive, promo.fixedprice, promo.itemquantifier FROM item i JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1 ${this._getPromotion("i")} WHERE ${conditions.join(" AND ")} ${sortBy}`;
    const results = await runQueryWithPagination(sql, limit, offset);

    return results.items || [];
  }

  async findById(itemId) {
    const sql = `SELECT i.id, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.storedetaileddescription, i.custitemcustitem_dnd_brand AS branditem, i.totalquantityonhand, i.stockdescription, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, ip.item, ip.price, promo.promotioncode_id, promo.promotion_code, promo.promotion_name, promo.startdate, promo.enddate, promo.ispublic, promo.isinactive, promo.fixedprice, promo.itemquantifier FROM item i LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 ${this._getPromotion("i")} WHERE i.id = '${itemId}' AND i.isinactive='F' AND i.isonline = 'T';`; // i.custitem38, i.custitem39 including later if needed

    const result = await runQueryWithPagination(sql, 1, 0);
    const item = result.items?.[0] || null;

    return item;
  }
  async findByParent(parent, limit, offset, sort, minPrice, maxPrice) {
    // Custom sort logic for findByParent - primary sort by custitem40, secondary by provided sort
    let orderBy = ` ORDER BY i.custitem40`;
    
    if (sort && ["asc", "desc"].includes(sort.toLowerCase())) {
      // Add secondary sorting by price if specified
      orderBy += `, ip.price ${sort.toLowerCase()}`;
    } else {
      // Default secondary sort by itemid
      orderBy += `, i.itemid ASC`;
    }

    // Build filter conditions
    let conditions = [
      `i.custitem39 = '${parent}'`,
      `i.isinactive = 'F'`,
      `i.isonline = 'T'`
    ];

    // Price range filter
    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      conditions.push(`ip.price >= ${parseFloat(minPrice)}`);
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      conditions.push(`ip.price <= ${parseFloat(maxPrice)}`);
    }

    const sql = `SELECT i.id, i.itemid FROM item i LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE ${conditions.join(" AND ")}${orderBy}`; //i.custitem38, custitem39 if need  `SELECT i.id, i.itemid, i.custitem38 FROM item i WHERE i.custitem39 = '${parent}' AND i.isinactive = 'F' AND i.isonline = 'T' ORDER BY i.custitem40`;

    const result = await runQueryWithPagination(sql, limit, offset);
    return result.items || [];
  }
  // Get items by multiple ids
  async findByIds(itemIds = [], limit, offset, sort, minPrice, maxPrice) {
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      throw new Error("itemIds must be a non-empty array");
    }
    const idsString = itemIds.map((id) => `'${id}'`).join(",");
    const sortBy = this._getSortBy(sort);
    
    // Build filter conditions
    let conditions = [
      `i.id IN (${idsString})`,
      `i.isinactive='F'`,
      `i.isonline = 'T'`
    ];

    // Price range filter
    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      conditions.push(`ip.price >= ${parseFloat(minPrice)}`);
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      conditions.push(`ip.price <= ${parseFloat(maxPrice)}`);
    }

    const sql = `SELECT i.id, i.class, i.manufacturer, i.mpn, i.itemid, i.itemType, i.subsidiary, i.isonline, i.displayname, i.custitemcustitem_dnd_brand AS branditem, i.totalquantityonhand, i.stockdescription, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, ip.item, ip.price, promo.promotioncode_id, promo.promotion_code, promo.promotion_name, promo.startdate, promo.enddate, promo.ispublic, promo.isinactive, promo.fixedprice, promo.itemquantifier FROM item i LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 ${this._getPromotion("i")} WHERE ${conditions.join(" AND ")} ${sortBy}`;
    const results = await runQueryWithPagination(sql, limit || itemIds.length, offset || 0);

    return results.items || [];
  }

  async findByNameLike(name, limit, offset, sort, minPrice, maxPrice) {
    const sortBy = this._getSortBy(sort);
    
    // Build filter conditions
    let conditions = [
      `LOWER(i.itemid) LIKE '%' || LOWER('${name}') || '%'`,
      `i.isinactive='F'`,
      `i.isonline = 'T'`
    ];

    // Price range filter
    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      conditions.push(`ip.price >= ${parseFloat(minPrice)}`);
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      conditions.push(`ip.price <= ${parseFloat(maxPrice)}`);
    }

    // Use the same fields as other item queries and include price for sorting
    const sql = `SELECT i.id, i.itemid, i.stockdescription, ip.price, promo.promotioncode_id, promo.promotion_code, promo.promotion_name, promo.startdate, promo.enddate, promo.ispublic, promo.isinactive, promo.fixedprice, promo.itemquantifier FROM item i LEFT JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 ${this._getPromotion("i")} WHERE ${conditions.join(" AND ")} ${sortBy}`;
    const results = await runQueryWithPagination(sql, limit, offset);

    return results;
  }
  // Generalized count method for class or brand with price filtering
  async countByField(field, value, minPrice, maxPrice) {
    const allowedFields = {
      class: "i.class",
      brand: "i.custitemcustitem_dnd_brand",
      name: "i.itemid",
    };

    // Base conditions
    const conditions = [`i.isonline = 'T'`, `i.isinactive = 'F'`];

    // Add field-specific filter (skip for "all" case)
    if (field !== "all") {
      const column = allowedFields[field];
      if (!column) {
        throw new Error(`Invalid filter field: ${field}`);
      }

      if (field === "name") {
        conditions.push(
          `LOWER(${column}) LIKE '%' || LOWER('${value}') || '%'`
        );
      } else {
        conditions.push(`LOWER(${column}) = LOWER('${value}')`);
      }
    }

    // Check if price filtering is needed
    const hasPriceFilter =
      (minPrice !== undefined && minPrice !== null && minPrice !== "") ||
      (maxPrice !== undefined && maxPrice !== null && maxPrice !== "");

    // Add price range filters
    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      conditions.push(`ip.price >= ${parseFloat(minPrice)}`);
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      conditions.push(`ip.price <= ${parseFloat(maxPrice)}`);
    }

    // Build SQL query
    const baseQuery = `SELECT COUNT(*) AS count FROM item i`;
    const priceJoin = ` JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1`;
    const whereClause = ` WHERE ${conditions.join(" AND ")}`;

    const sql = hasPriceFilter
      ? baseQuery + priceJoin + whereClause
      : baseQuery + whereClause;

    const results = await runQueryWithPagination(sql, 1, 0);
    return results.items?.[0]?.count || 0;
  }

  // Find items by category
  async findByCategory(category, limit, offset, sort, minPrice, maxPrice) {
    const sortBy = this._getSortBy(sort);

    // Build price filter conditions
    let priceConditions = "";

    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      priceConditions += ` AND ip.price >= ${parseFloat(minPrice)}`;
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      priceConditions += ` AND ip.price <= ${parseFloat(maxPrice)}`;
    }

    const sql = `SELECT i.id, i.itemid, i.totalquantityonhand, i.stockdescription, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, promo.promotioncode_id, promo.promotion_code, promo.promotion_name, promo.startdate, promo.enddate, promo.ispublic, promo.isinactive, promo.fixedprice, promo.itemquantifier FROM item i INNER JOIN CommerceCategoryItemAssociation cc ON cc.item = i.id INNER JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 ${this._getPromotion("i")} WHERE cc.category = '${category}' AND i.isonline = 'T' AND i.isinactive = 'F'${priceConditions} ${sortBy}`;
    const results = await runQueryWithPagination(sql, limit, offset);

    return results.items || [];
  }

  // Count items by category with price filtering
  async countByCategory(category, minPrice, maxPrice) {
    // Build price filter conditions
    let conditions = [
      `cc.category = '${category}'`,
      `i.isonline = 'T'`,
      `i.isinactive = 'F'`,
    ];

    // Price range filter
    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      conditions.push(`ip.price >= ${parseFloat(minPrice)}`);
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      conditions.push(`ip.price <= ${parseFloat(maxPrice)}`);
    }

    const sql = `SELECT COUNT(*) AS count FROM item i INNER JOIN CommerceCategoryItemAssociation cc ON cc.item = i.id INNER JOIN itemprice ip ON ip.item = i.id AND ip.pricelevel = 1 WHERE ${conditions.join(" AND ")};`;
    const results = await runQueryWithPagination(sql, 1, 0);
    return results.items?.[0]?.count || 0;
  }

  // Method for getting all products with pagination and sorting
  async findAllProducts(limit, offset, sort, minPrice, maxPrice) {
    let conditions = [`i.isonline = 'T'`, `i.isinactive = 'F'`];

    // Price range filter
    if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
      conditions.push(`ip.price >= ${parseFloat(minPrice)}`);
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
      conditions.push(`ip.price <= ${parseFloat(maxPrice)}`);
    }

    // Custom sorting logic for findAllProducts
    let sortBy;
    if (sort === "parent_classification_name") {
      sortBy = ` ORDER BY pc.name ASC`;
    } else if (sort && ["asc", "desc"].includes(sort.toLowerCase())) {
      sortBy = ` ORDER BY ip.price ${sort.toLowerCase()}`;
    } else {
      sortBy = ` ORDER BY i.itemid ASC`;
    }

    // Use the same SQL structure as findByField for consistency, plus classification joins
    const sql = `SELECT i.id, i.itemid, i.totalquantityonhand, i.stockdescription, ip.price, (SELECT f.url FROM file f WHERE f.isonline = 'T' AND f.name LIKE '%' || i.displayname || '%' ORDER BY f.createddate DESC FETCH FIRST 1 ROWS ONLY) AS file_url, c.name AS classification_name, pc.name AS parent_classification_name, promo.promotioncode_id, promo.promotion_code, promo.promotion_name, promo.startdate, promo.enddate, promo.ispublic, promo.isinactive, promo.fixedprice, promo.itemquantifier FROM item i JOIN itemprice ip ON i.id = ip.item AND ip.pricelevel = 1 LEFT JOIN classification c ON i.class = c.id LEFT JOIN classification pc ON c.parent = pc.id ${this._getPromotion("i")} WHERE ${conditions.join(" AND ")} ${sortBy}`;

    const results = await runQueryWithPagination(sql, limit, offset);

    return results.items || [];
  }
}

module.exports = new ItemsService();
