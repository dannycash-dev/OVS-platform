const express = require('express');
const path = require('node:path');
const { getProducts } = require('./unleashed');

const app = express();
const port = Number(process.env.PORT || 3000);
let cache = { expiresAt: 0, products: [] };

app.use(express.json({ limit: '25mb' }));
app.use(express.static(path.join(__dirname, '..')));

app.post('/api/assess', async (request, response) => {
  const { files, patientReference, species, weight, studyView, clinicalNotes } = request.body || {};
  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({ error: 'AI assessment is not configured' });
  }
  if (!Array.isArray(files) || files.length === 0 || files.length > 4) {
    return response.status(400).json({ error: 'Provide between one and four radiograph images' });
  }
  if (files.some((file) => typeof file !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(file))) {
    return response.status(400).json({ error: 'Only JPEG, PNG, and WebP radiographs are supported' });
  }

  const prompt = [
    'You are providing preliminary veterinary orthopaedic decision support to a qualified clinician.',
    'Review the radiographs and case context, but do not claim a definitive diagnosis or replace clinical judgement.',
    'Return valid JSON only with this shape: {"summary": string, "confidence": number, "imageQuality": string, "recommendation": string, "hardware": string[]}.',
    'Use confidence as a whole-number percentage from 0 to 100. Mention when image quality or views limit the assessment.',
    `Species: ${species || 'Not provided'}`,
    `Weight kg: ${weight || 'Not provided'}`,
    `Study view: ${studyView || 'Not provided'}`,
    `Patient reference: ${patientReference || 'Not provided'}`,
    `Clinical notes: ${clinicalNotes || 'None provided'}`
  ].join('\n');

  try {
    const openAiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            ...files.map((imageUrl) => ({ type: 'input_image', image_url: imageUrl, detail: 'high' }))
          ]
        }],
        max_output_tokens: 1200
      })
    });
    const result = await openAiResponse.json();
    if (!openAiResponse.ok) {
      console.error('OpenAI assessment failed', result);
      return response.status(502).json({ error: 'AI assessment failed' });
    }
    const text = result.output_text || '';
    const assessment = JSON.parse(text.replace(/^```json\s*|\s*```$/g, '').trim());
    return response.json({ assessment, model: process.env.OPENAI_MODEL || 'gpt-4o' });
  } catch (error) {
    console.error('AI assessment error', error);
    return response.status(502).json({ error: 'Unable to complete AI assessment' });
  }
});

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

app.listen(port, () => console.log(`Ortho Vet Supplies API listening on port ${port}`));
