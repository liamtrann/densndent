// Centralized list of API endpoint paths for frontend usage
const endpoint = {
    GET_PRODUCT_BY_ID_WITH_BASE_PRICE: (id) => `/suiteql/item/by-id-with-base-price?id=${id}`,
    GET_ITEMS_BY_CLASS: (classId) => `/suiteql/item/by-class?classId=${classId}`,
    GET_CUSTOMER: (id) => `/netsuite-rest/customer/${id}`,
    GET_SALES_ORDER: (id) => `/netsuite-rest/salesOrder/${id}`,
    GET_CUSTOMER_BY_EMAIL: (email) => `/suiteql/customer/by-email?email=${encodeURIComponent(email)}`,
    // Add more endpoints as needed
};

export default endpoint;
