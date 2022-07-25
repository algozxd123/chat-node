import express from 'express';

const routes = express.Router();

routes.get('/', (req: express.Request, res: express.Response) => {
    return res.send('Hello World');
});

export default routes;