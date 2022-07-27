import express from 'express';
import authMiddleware from './middlewares/authMiddleware';
import AuthController from './controllers/authController';

const routes = express.Router();

routes.post('/signup', AuthController.signUp);
routes.post('/login', AuthController.logIn);

routes.use(authMiddleware);

routes.get('/', (req: express.Request, res: express.Response) => {
  return res.send('Hello World');
});

export default routes;