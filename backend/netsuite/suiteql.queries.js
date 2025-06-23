export const SuiteQLQueries = {
  getAllClassifications: `
    SELECT 
      *
    FROM classification 
    ORDER BY name ASC
  `,
};