const endpoint = {
    // SuiteQL Endpoints
    GET_ALL_CLASSIFICATIONS: '/suiteql/classification',
    GET_SUB_CATEGORIES_BY_PARENT: (id) => `/suiteql/commerceCategory/sub-category-by-parent/${id}`,
    GET_PRODUCT_BY_ID: (id) => `/suiteql/item/by-id?id=${id}`,
    POST_GET_PRODUCT_BY_PARENT: () => `/suiteql/item/by-parent`,
    POST_GET_ITEM_BY_IDS: () => `/suiteql/item/by-ids`,
    GET_ITEMS_BY_CLASS: ({ classId, limit, offset, sort, minPrice, maxPrice }) => {
        const params = new URLSearchParams();
        if (classId) params.append('classId', classId);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        if (sort) params.append('sort', sort);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        return `/suiteql/item/by-class?${params.toString()}`;
    },
    GET_ITEMS_BY_BRAND: ({ brand, limit, offset, sort, minPrice, maxPrice }) => {
        const params = new URLSearchParams();
        if (brand) params.append('brand', brand);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        if (sort) params.append('sort', sort);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        return `/suiteql/item/by-brand?${params.toString()}`;
    },
    GET_ITEMS_BY_CLASS_AND_BRAND: ({ classId, brand, limit, offset, sort }) => {
        const params = new URLSearchParams();
        if (classId) params.append('classId', classId);
        if (brand) params.append('brand', brand);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        if (sort) params.append('sort', sort);
        return `/suiteql/item/by-class-and-brand?${params.toString()}`;
    },
    GET_ITEMS_BY_CATEGORY: ({ category, limit, offset, sort, minPrice, maxPrice }) => {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        if (sort) params.append('sort', sort);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        return `/suiteql/item/by-category?${params.toString()}`;
    },
    GET_CUSTOMER_BY_EMAIL: (email) => `/suiteql/customer/by-email?email=${email}`,
    GET_COUNT_BY_CLASS: ({ classId, minPrice, maxPrice }) => {
        const params = new URLSearchParams();
        if (classId) params.append('classId', classId);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        return `/suiteql/item/count-by-class?${params.toString()}`;
    },
    GET_COUNT_BY_BRAND: ({ brand, minPrice, maxPrice }) => {
        const params = new URLSearchParams();
        if (brand) params.append('brand', brand);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        return `/suiteql/item/count-by-brand?${params.toString()}`;
    },
    POST_GET_COUNT_BY_NAME: ({ minPrice, maxPrice }) => {
        const params = new URLSearchParams();
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        return `/suiteql/item/count-by-name?${params.toString()}`;
    },
    GET_COUNT_BY_CATEGORY: ({ category, minPrice, maxPrice }) => {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        return `/suiteql/item/count-by-category?${params.toString()}`;
    },
    GET_ITEMS_ORDER_HISTORY_BY_USER: ({ userId, limit, offset }) => {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        return `/suiteql/transaction/by-user-order-history?${params.toString()}`;
    },
    GET_TRANSACTION_BY_ID: ({ userId, limit, offset, sort }) => {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        if (sort) params.append('sort', sort);
        return `/suiteql/transaction/by-id?${params.toString()}`;
    },
    // GET_TRANSACTION_BY_EMAIL: ({ email, limit, offset }) => {
    //     const params = new URLSearchParams();
    //     if (email) params.append('email', email);
    //     if (limit) params.append('limit', limit);
    //     if (offset) params.append('offset', offset);
    //     return `/suiteql/transaction/by-email?${params.toString()}`;
    // },
    POST_GET_ITEMS_BY_NAME: ({ limit, offset, sort, minPrice, maxPrice }) => {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        if (sort) params.append('sort', sort);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        return `/suiteql/item/search-by-name-like?${params.toString()}`

    },
    GET_SHIPPING_METHOD: (id) => `/suiteql/shipItem/${id}`, // get id = 20412
    POST_CHECK_INVENTORY: () => '/suiteql/inventory/check-inventory',
    GET_ACTIVE_PROMOTIONS: () => '/suiteql/promotion',
    GET_TOP_SALE: ({ limit, fromDate }) => {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit);
        if (fromDate) params.append('fromDate', fromDate);
        return `/suiteql/saleInvoiced/top-sale-details?${params.toString()}`;
    },
    GET_PROMOTIONS_BY_PRODUCT: ({ productId, limit, offset }) => {
        const params = new URLSearchParams();
        if (productId) params.append('productId', productId);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        return `/suiteql/promotion/by-product?${params.toString()}`;
    },

    // Tax Endpoints
    GET_TAX_RATES: ({ country, province, city }) => {
        const params = new URLSearchParams();
        if (country) params.append('country', country);
        if (province) params.append('province', province);
        if (city) params.append('city', city);
        return `/suiteql/tax/rates?${params.toString()}`;
    },
    POST_CALCULATE_TAX: () => '/suiteql/tax/calculate',
    // GET_TAX_RATES_BY_POSTAL_CODE: (country, postalCode) => `/suiteql/tax/rates/${country}/${postalCode}`,

    // NETSUITE REST API Endpoints
    GET_CUSTOMER: (id) => `/restapi/customer/${id}`,
    GET_SALES_ORDER: (id) => `/restapi/salesOrder/${id}`,
    POST_SALES_ORDER: () => `/restapi/salesOrder`,
    PATCH_UPDATE_CUSTOMER: (id) => `/restapi/customer/${id}`,
    POST_CREATE_CUSTOMER: () => `/restapi/customer`,
};

export default endpoint;
