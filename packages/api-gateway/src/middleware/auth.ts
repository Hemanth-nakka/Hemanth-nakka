import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export interface AgentPayload {
  agentId: string;
  name: string;
  role: 'agent' | 'supervisor' | 'admin';
}

export function generateToken(payload: AgentPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }
  try {
    const token = header.slice(7);
    req.agent = jwt.verify(token, JWT_SECRET) as AgentPayload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(role: AgentPayload['role']) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.agent || req.agent.role !== role) {
      res.status(403).json({ error: 'Insufficient role' });
      return;
    }
    next();
  };
}

declare global {
  namespace Express {
    interface Request {
      agent?: AgentPayload;
    }
  }
}
