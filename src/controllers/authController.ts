import { Request, Response } from 'express';
import { LogInType, SignUpType } from '../interfaces/authInterface';
import AuthService from '../services/authService';

const signUp = async (req: Request, res: Response) => {
  try {
    const userData: SignUpType = req.body;
    await AuthService.signUp(userData);
    
    return res.status(200).json({ message: 'User created' });
  } catch (error) {
    const err = (error as Error);
    return res.status(400).send({ error: err.message });
  }
};

const logIn = async (req: Request, res: Response) => {
  try {
    const userData: LogInType = req.body;
    const { jwt, user } = await AuthService.logIn(userData);

    return res.status(200).json({ data: {jwt, user}, message: 'Login successful'});
  } catch (error) {
    const err = (error as Error);
    return res.status(400).send({ error: err.message });
  }
};

const AuthController = {
  signUp,
  logIn
};

export default AuthController;