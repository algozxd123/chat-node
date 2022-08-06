import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SignUpType, SignUpValidator, LogInType, LogInValidator, TokenDataType } from '../interfaces/authInterface';
import { UserType } from '../interfaces/userInterface';
import userModel from '../models/userModel';

const createToken = (user: UserType): TokenDataType => {
  const secretKey: string | undefined = process.env.SECRET_KEY;
  if (secretKey === undefined) throw new Error('Internal server error');
  const expiresIn = 60 * 60 * 7;
  const token = sign({ id: user._id }, secretKey, { expiresIn });
  return { expiresIn, token };
};

const signUp = async (userData: SignUpType) => {

  SignUpValidator.parse(userData);
  const findUser: UserType | null = await userModel.findOne({ email: userData.email });
  const findUser2: UserType | null = await userModel.findOne({ username: userData.username });
  if (findUser) throw new Error(`Your email ${userData.email} already exists`);
  if (findUser2) throw new Error(`Your username ${userData.username} already exists`);

  const hashedPassword = await hash(userData.password, 10);
  await userModel.create({ ...userData, password: hashedPassword });
};

const logIn = async (userData: LogInType) => {

  LogInValidator.parse(userData);
  const findUser: UserType | null = await userModel.findOne({ email: userData.email }).select('_id username email password');
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