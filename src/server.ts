import express from 'express';
import { createServer } from 'http';
import { config } from 'dotenv';
import routes from './routes';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(routes);

export { app, server };