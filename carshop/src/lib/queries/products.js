export const getAllProducts = ({ brand, sortBy = 'price_pair', sortOrder = 'ASC' }) => {
    const validSortColumns = ['price_pair', 'model'];
    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'price_pair';
    const safeSortOrder = sortOrder === 'DESC' ? 'DESC' : 'ASC';

    let query = 'SELECT * FROM products';
    const params = [];

    if (brand) {
        query += ' WHERE brand_slug = ?';
        params.push(brand);
    }

    query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

    return { query, params };
};
