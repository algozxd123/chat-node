import socketio from 'socket.io';
import { Server } from 'http';
import { authMiddlewareSocket } from './middlewares/authMiddleware';
import UserController from './controllers/userController';

export const setupSocket = (server: Server) => {
  const io = new socketio.Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
    
  io.on('connection', (socket) => {
    console.log('user connected');
    const userId = authMiddlewareSocket(socket);

    if(userId){
      socket.on('connect_room', ({ userId, friendId }) => {
        console.log('connecting to room');
        if(userId>=friendId) socket.join(`${userId}-${friendId}`);
        else socket.join(`${friendId}-${userId}`);
      });

      socket.on('send_message', ({ text, friendId }) => {
        console.log(userId);
        console.log(friendId);
        UserController.sendMessage(io, socket, text, userId, friendId);
      });
    }
  });
};