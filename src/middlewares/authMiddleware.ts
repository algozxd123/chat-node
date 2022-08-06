import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';

export const validate = (token: string) => {
  if (!token) throw new Error('missing authorization token');

  const secretKey: string | undefined = process.env.SECRET_KEY;
  if (secretKey === undefined) throw new Error('Internal server error');

  const verificationResponse = (verify(token, secretKey)) as { id: string };
  const userId = verificationResponse.id;

  return userId;
};

const authMiddlewareExpress = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) throw new Error('missing authorization header');
    const token = req.headers.authorization.split('Bearer ')[1];

    const userId = validate(token);

    if (userId) {
      if(req.body === undefined) req.body = {};
      req.body.userId = userId;
      next();
    } else {
      throw new Error('invalid token');
    }
  } catch (error) {
    const err = (error as Error);
    return res.status(400).send({ error: err.message });
  }
};

const authMiddlewareSocket = (socket: Socket) => {
  try{
    if(!socket.handshake.query.token || Array.isArray(socket.handshake.query.token) || !socket.handshake.query.token.split('Bearer ')[1]) throw new Error('missing authorization token');
    
    const token: string = socket.handshake.query.token.split('Bearer ')[1];
    const userId = validate(token);
    return userId;
  }catch (error){
    socket.emit('error', {error});
  }
};

export { authMiddlewareExpress, authMiddlewareSocket };