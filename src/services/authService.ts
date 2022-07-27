import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SignUpType, SignUpValidator, LogInType, LogInValidator, TokenDataType } from '../interfaces/authInterface';
import { UserType } from '../interfaces/userInterface';
import userModel from '../models/userModel';

const createToken = (user: UserType): TokenDataType => {
  const secretKey: string | undefined = process.env.SECRET_KEY;
  if (secretKey === undefined) throw new Error('Internal server error');
  const expiresIn = 60 * 60;

  return { expiresIn, token: sign({ _id: user._id }, secretKey, { expiresIn }) };
};

const signUp = async (userData: SignUpType) => {

  SignUpValidator.parse(userData);
  const findUser: UserType | null = await userModel.findOne({ email: userData.email });
  if (findUser) throw new Error(`You're email ${userData.email} already exists`);

  const hashedPassword = await hash(userData.password, 10);
  const createdUser: UserType = await userModel.create({ ...userData, password: hashedPassword });

  return createdUser;
};

const logIn = async (userData: LogInType) => {

  LogInValidator.parse(userData);

  const findUser: UserType | null = await userModel.findOne({ email: userData.email });
  if (findUser === null) throw new Error(`Email ${userData.email} not found`);

  const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
  if (!isPasswordMatching) throw new Error('Incorrect password');

  const tokenData = createToken(findUser);
  findUser.password = '';
  return { jwt: tokenData, user: findUser };
};

const AuthService = {
  signUp,
  logIn
};

export default AuthService;