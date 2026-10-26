import { Router, Request, Response } from 'express';
import axios from 'axios';
import { authMiddleware, generateToken } from '../middleware/auth';

const router = Router();

const AI_URL = process.env.AI_ENGINE_URL || 'http://localhost:4002';
const COMPLIANCE_URL = process.env.COMPLIANCE_ENGINE_URL || 'http://localhost:4003';
const KNOWLEDGE_URL = process.env.KNOWLEDGE_SERVICE_URL || 'http://localhost:4004';
const GENESYS_URL = process.env.GENESYS_ADAPTOR_URL || 'http://localhost:4001';

function upstreamError(err: unknown, res: Response) {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status ?? 502;
    res.status(status).json({ error: err.response?.data ?? err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}

router.post('/auth/token', (req: Request, res: Response) => {
  const { agentId, name, role, secret } = req.body;
  const expectedSecret = process.env.AGENT_SECRET || 'dev-agent-secret';
  if (!agentId || !name || secret !== expectedSecret) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = generateToken({ agentId, name, role: role || 'agent' });
  res.json({ token, agentId, name, role: role || 'agent' });
});

router.post('/suggest', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { data } = await axios.post(`${AI_URL}/suggest`, req.body);
    res.json(data);
  } catch (err) { upstreamError(err, res); }
});

router.post('/summarize', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { data } = await axios.post(`${AI_URL}/summarize`, req.body);
    res.json(data);
  } catch (err) { upstreamError(err, res); }
});

router.post('/compliance/check', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { data } = await axios.post(`${COMPLIANCE_URL}/check`, req.body);
    res.json(data);
  } catch (err) { upstreamError(err, res); }
});

router.get('/compliance/rules', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const { data } = await axios.get(`${COMPLIANCE_URL}/rules`);
    res.json(data);
  } catch (err) { upstreamError(err, res); }
});

router.post('/knowledge/search', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { data } = await axios.post(`${KNOWLEDGE_URL}/search`, req.body);
    res.json(data);
  } catch (err) { upstreamError(err, res); }
});

router.post('/knowledge/trigger', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { data } = await axios.post(`${KNOWLEDGE_URL}/trigger`, req.body);
    res.json(data);
  } catch (err) { upstreamError(err, res); }
});

router.get('/knowledge/articles', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const { data } = await axios.get(`${KNOWLEDGE_URL}/articles`);
    res.json(data);
  } catch (err) { upstreamError(err, res); }
});

router.post('/digital/message', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { data } = await axios.post(`${GENESYS_URL}/webhook/digital`, req.body);
    res.json(data);
  } catch (err) { upstreamError(err, res); }
});

router.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok', service: 'api-gateway' }));

export default router;
