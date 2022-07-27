import { Request, Response } from 'express';
import { LogInType, SignUpType } from '../interfaces/authInterface';
import { UserType } from '../interfaces/userInterface';
import AuthService from '../services/authService';

const signUp = async (req: Request, res: Response) => {
  try {
    const userData: SignUpType = req.body;
    const signUpUser: UserType = await AuthService.signUp(userData);

    signUpUser.password = '';
    return res.status(200).json({ signUpUser });
  } catch (error) {
    const err = (error as Error);
    return res.status(400).send({ error: err.message });
  }
};

const logIn = async (req: Request, res: Response) => {
  try {
    const userData: LogInType = req.body;
    const { jwt, user } = await AuthService.logIn(userData);

    user.password = '';
    return res.status(200).json({ data: { jwt, user } });
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