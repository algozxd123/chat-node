import mongoose from 'mongoose';
import { SignUpType } from '../interfaces/authInterface';
import AuthService from '../services/authService';

export const createUser = async (userData: SignUpType) => {
  await AuthService.signUp(userData);
  const user = await AuthService.logIn(userData);
  return user;
};

afterAll(async () => {
  await mongoose.connection.db.dropCollection('users');
  await mongoose.connection.close();
});
