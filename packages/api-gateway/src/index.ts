import express from 'express';
import http from 'http';
import helmet from 'helmet';
import cors from 'cors';
import Redis from 'ioredis';
import routes from './routes';
import { WebSocketRelay } from './websocket/ws-relay';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1', routes);

const server = http.createServer(app);
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
new WebSocketRelay(server, redis);

const PORT = parseInt(process.env.PORT || '4000');
server.listen(PORT, () => console.log(`api-gateway listening on :${PORT}`));
