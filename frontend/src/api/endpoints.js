// Centralized list of API endpoint paths for frontend usage
const endpoint = {
    // SuiteQL Endpoints
    GET_ALL_CLASSIFICATIONS: '/suiteql/classification',
    GET_PRODUCT_BY_ID: (id) => `/suiteql/item/by-id?id=${id}`,
    GET_ITEMS_BY_CLASS: ({ classId, limit, offset }) => {
        const params = new URLSearchParams();
        if (classId) params.append('classId', classId);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        return `/suiteql/item/by-class?${params.toString()}`;
    },
    GET_CUSTOMER_BY_EMAIL: (email) => `/suiteql/customer/by-email?email=${email}`,
    POST_ITEMS_BY_NAME: () => '/suiteql/item/by-name',
    GET_COUNT_BY_CLASS: (classId) => `/suiteql/item/count-by-class?classId=${classId}`,
    GET_TRANSACTION_BY_ID: (id) => `/suiteql/transaction/by-id?id=${id}`,

    // NETSUITE REST API Endpoints
    GET_CUSTOMER: (id) => `/netsuite-rest/customer/${id}`,
    GET_SALES_ORDER: (id) => `/netsuite-rest/salesOrder/${id}`,
};

export default endpoint;
