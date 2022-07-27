import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import { createServer } from 'http';
import { setupEnv } from './config/env';
import { setupDatabase } from './database/db';
import routes from './routes';

const app = express();
const server = createServer(app);

setupEnv();
setupDatabase();

// json parser
app.use(express.json());
//enable cors
app.use(cors);
// many middlewares to prevent vulnerabilities
app.use(helmet);
// protection agains HTTP Parameters Polition
app.use(hpp);

app.use(routes);

export { app, server };