const endpoint = {
  // SuiteQL Endpoints
  GET_ALL_CLASSIFICATIONS: '/suiteql/classification',
  GET_PRODUCT_BY_ID: (id) => `/suiteql/item/by-id?id=${id}`,
  GET_ITEMS_BY_CLASS: ({ classId, limit, offset, sort }) => {
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    if (sort) params.append('sort', sort);
    return `/suiteql/item/by-class?${params.toString()}`;
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
  GET_CUSTOMER_BY_EMAIL: (email) => `/suiteql/customer/by-email?email=${email}`,
  UPDATE_CUSTOMER_BY_EMAIL: (email) => `/suiteql/customer/update-by-email?email=${email}`,
  POST_ITEMS_BY_NAME: () => '/suiteql/item/by-name',
  GET_COUNT_BY_CLASS: (classId) => `/suiteql/item/count-by-class?classId=${classId}`,
  GET_TRANSACTION_BY_ID: (id) => `/suiteql/transaction/by-id?id=${id}`,
  GET_TRANSACTION_BY_EMAIL: (email) => `/suiteql/transaction/by-email?email=${email}`,

  // NETSUITE REST API Endpoints
  GET_CUSTOMER: (id) => `/netsuite-rest/customer/${id}`,
  GET_SALES_ORDER: (id) => `/netsuite-rest/salesOrder/${id}`,
};

export default endpoint;
