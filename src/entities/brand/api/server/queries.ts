import 'server-only';

export const getAllBrandsQuery = `
  SELECT * FROM brands ORDER BY name ASC
`;
