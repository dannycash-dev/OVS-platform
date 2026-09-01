const express = require('express');
const { getProducts } = require('./unleashed');

const app = express();
const port = Number(process.env.PORT || 3000);
let cache = { expiresAt: 0, products: [] };

app.use(express.json());
app.get('/api/products', async (_request, response) => {
  try {
    if (cache.expiresAt < Date.now()) {
      cache = { expiresAt: Date.now() + 60_000, products: await getProducts() };
    }
    response.json({ products: cache.products, source: 'unleashed', cachedUntil: new Date(cache.expiresAt).toISOString() });
  } catch (error) {
    console.error(error);
    response.status(502).json({ error: 'Unable to load products from Unleashed' });
  }
});

app.listen(port, () => console.log(`OrthoOrder API listening on port ${port}`));
