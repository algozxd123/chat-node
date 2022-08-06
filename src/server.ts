import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import { json } from 'body-parser';
import { createServer } from 'http';
import { setupEnv } from './config/env';
import { setupDatabase } from './database/db';
import routes from './routes';
import { setupSocket } from './sockets';

const app = express();
const server = createServer(app);

setupEnv();
setupDatabase();
setupSocket(server);

// json parser (use version body-parser@^2.0.0-beta.1 otherwise jest/supertest leaves open handles)
// related github issue -> https://github.com/visionmedia/supertest/issues/772
app.use(json());
//enable cors
app.use(cors());
// many middlewares to prevent vulnerabilities
app.use(helmet());
// protection agains HTTP Parameters Polition
app.use(hpp());

app.use(routes);

export { app, server };