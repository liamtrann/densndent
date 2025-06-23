export const SuiteQLQueries = {
  getAllClassifications: `SELECT * FROM classification`,
  getAllCustomers: `SELECT id, entityid, email FROM customer`,
  getItemsInStock: `SELECT * FROM item WHERE quantityonhand > 0`,
  // Add more queries as needed
};