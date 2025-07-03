// Centralized list of API endpoint paths for frontend usage
const endpoint = {
    // SuiteQL Endpoints
    GET_ALL_CLASSIFICATIONS: '/suiteql/classification',
    GET_PRODUCT_BY_ID_WITH_BASE_PRICE: (id) => `/suiteql/item/by-id-with-base-price?id=${id}`,
    GET_ITEMS_BY_CLASS: ({ classId, limit, offset }) => {
        const params = new URLSearchParams();
        if (classId) params.append('classId', classId);
        if (limit) params.append('limit', limit);
        if (offset) params.append('offset', offset);
        return `/suiteql/item/by-class?${params.toString()}`;
    },
    GET_CUSTOMER_BY_EMAIL: (email) => `/suiteql/customer/by-email?email=${email}`,
    // NETSUITE REST API Endpoints
    GET_CUSTOMER: (id) => `/netsuite-rest/customer/${id}`,
    GET_SALES_ORDER: (id) => `/netsuite-rest/salesOrder/${id}`,
};

export default endpoint;
