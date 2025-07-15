const endpoint = {
    // SuiteQL Endpoints
    GET_ALL_CLASSIFICATIONS: '/suiteql/classification',
    GET_PRODUCT_BY_ID: (id) => `/suiteql/item/by-id?id=${id}`,
    POST_GET_PRODUCT_BY_PARENT: () => `/suiteql/item/by-parent`,
    GET_ITEMS_BY_CLASS: ({ classId, limit, offset, sort }) => {
        const params = new URLSearchParams();
        if (classId) params.append('classId', classId);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        if (sort) params.append('sort', sort);
        return `/suiteql/item/by-class?${params.toString()}`;
    },
    GET_ITEMS_BY_BRAND: ({ brand, limit, offset, sort }) => {
        const params = new URLSearchParams();
        if (brand) params.append('brand', brand);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        if (sort) params.append('sort', sort);
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
    GET_ITEMS_BY_CATEGORY: ({ category, limit, offset, sort }) => {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        if (sort) params.append('sort', sort);
        return `/suiteql/item/by-category?${params.toString()}`;
    },
    GET_CUSTOMER_BY_EMAIL: (email) => `/suiteql/customer/by-email?email=${email}`,
    GET_COUNT_BY_CLASS: (classId) => `/suiteql/item/count-by-class?classId=${classId}`,
    GET_COUNT_BY_BRAND: (brand) => `/suiteql/item/count-by-brand?brand=${brand}`,
    POST_GET_COUNT_BY_NAME: () => `/suiteql/item/count-by-name`,
    GET_ITEMS_ORDER_HISTORY_BY_USER: ({ userId, limit, offset }) => {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        return `/suiteql/transaction/by-user-order-history?${params.toString()}`;
    },
    GET_TRANSACTION_BY_ID: ({ id, limit, offset, sort }) => {
        const params = new URLSearchParams();
        if (id) params.append('id', id);
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
    POST_GET_ITEMS_BY_NAME: ({ limit, offset, sort }) => {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        if (sort) params.append('sort', sort);
        return `/suiteql/item/search-by-name-like?${params.toString()}`

    },
    GET_SHIPPING_METHOD: (id) => `/suiteql/shipItem/${id}`,
    POST_CHECK_INVENTORY: () => '/suiteql/inventory/check-inventory',

    // NETSUITE REST API Endpoints
    GET_CUSTOMER: (id) => `/restapi/customer/${id}`,
    GET_SALES_ORDER: (id) => `/restapi/salesOrder/${id}`,
    PATCH_UPDATE_CUSTOMER: (id) => `/restapi/customer/${id}`,
    POST_CREATE_CUSTOMER: () => `/restapi/customer`,
};

export default endpoint;
