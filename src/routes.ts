import express from 'express';
import authMiddleware from './middlewares/authMiddleware';
import AuthController from './controllers/authController';
import UserController from './controllers/userController';

const routes = express.Router();

routes.post('/api/signup', AuthController.signUp);
routes.post('/api/login', AuthController.logIn);

routes.use(authMiddleware);

routes.get('/api/getFriendList', UserController.getFriendList);
routes.get('/api/getFriendRequestsList', UserController.getFriendRequestList);
routes.post('/api/sendFriendRequest', UserController.sendFriendRequest);
routes.post('/api/acceptFriendRequest', UserController.acceptFriendRequest);
routes.post('/api/rejectFriendRequest', UserController.rejectFriendRequest);
routes.post('/api/removeFriend', UserController.removeFriend);

routes.get('/', (req: express.Request, res: express.Response) => {
  return res.send('Hello World');
});

export default routes;