import express from 'express';
import { search, getByTrigger, getAll } from './search/kb-search';
import { COLLECTIONS_KB } from './data/collections-kb';

const app = express();
app.use(express.json());

const enableOps = process.env.ENABLE_OPS_GUIDANCE === 'true';

app.post('/search', (req, res) => {
  const { query, category, dpd, limit } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });
  const results = search(query, { category, dpd }, limit || 5);
  res.json({ results: enableOps ? results : results.filter((r) => r.phase !== '1B') });
});

app.post('/trigger', (req, res) => {
  const { utterance } = req.body;
  if (!utterance) return res.status(400).json({ error: 'utterance required' });
  res.json({ articles: getByTrigger(utterance, enableOps) });
});

app.get('/articles', (_req, res) => {
  res.json({ articles: getAll(enableOps) });
});

app.get('/articles/:id', (req, res) => {
  const article = COLLECTIONS_KB.find((a) => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: 'not found' });
  if (article.phase === '1B' && !enableOps) return res.status(403).json({ error: 'phase not enabled' });
  res.json(article);
});

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'knowledge-service' }));

const PORT = parseInt(process.env.PORT || '4004');
app.listen(PORT, () => console.log(`knowledge-service listening on :${PORT}`));
