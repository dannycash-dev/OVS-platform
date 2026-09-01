const crypto = require('node:crypto');

const apiBaseUrl = process.env.UNLEASHED_API_URL || 'https://api.unleashedsoftware.com';
const pageSize = Math.min(Number(process.env.UNLEASHED_PAGE_SIZE || 200), 1000);

function signature(queryString = '') {
  return crypto.createHmac('sha256', process.env.UNLEASHED_API_KEY).update(queryString, 'utf8').digest('base64');
}

async function requestProducts(page = 1) {
  const queryString = `pageSize=${pageSize}`;
  const response = await fetch(`${apiBaseUrl}/Products/${page}?${queryString}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-auth-id': process.env.UNLEASHED_API_ID,
      'api-auth-signature': signature(queryString),
      'client-type': process.env.UNLEASHED_CLIENT_TYPE || 'orthoorder/productcatalog'
    }
  });
  if (!response.ok) throw new Error(`Unleashed returned ${response.status}`);
  return response.json();
}

function normalizeProduct(product) {
  const inventory = product.InventoryDetails || product.InventoryDetail || [];
  const available = Array.isArray(inventory)
    ? inventory.reduce((total, item) => total + Number(item.AvailableQty || item.AvailableQuantity || 0), 0)
    : Number(product.AvailableQty || product.AvailableQuantity || 0);
  return {
    id: product.Guid,
    sku: product.ProductCode,
    name: product.ProductDescription || product.ProductCode,
    description: product.ProductDescription || '',
    type: product.ProductGroup?.GroupName || product.ProductGroup || 'Hardware',
    price: Number(product.SellPrice || product.DefaultSellPrice || 0),
    stock: available,
    image: product.Image?.Url || product.ImageUrl || null,
    source: 'unleashed'
  };
}

async function getProducts() {
  const firstPage = await requestProducts(1);
  const records = firstPage.Products || firstPage.Product || [];
  const pages = Number(firstPage.Pagination?.NumberOfPages || 1);
  const remainingPages = await Promise.all(Array.from({ length: Math.max(0, pages - 1) }, (_, index) => requestProducts(index + 2)));
  return [records, ...remainingPages.flatMap((page) => page.Products || page.Product || [])].map(normalizeProduct);
}

module.exports = { getProducts };
