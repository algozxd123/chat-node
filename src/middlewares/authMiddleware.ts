import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) throw new Error('missing authorization header');
    const token = req.headers.authorization.split('Bearer ')[1];

    if (!token) throw new Error('missing authorization token');

    const secretKey: string | undefined = process.env.SECRET_KEY;
    if (secretKey === undefined) throw new Error('Internal server error');

    const verificationResponse = (verify(token, secretKey)) as { id: string };
    const userId = verificationResponse.id;

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

export default authMiddleware;