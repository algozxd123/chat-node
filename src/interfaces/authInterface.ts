import { z } from 'zod';
import { UserType } from './userInterface';

const SignUpValidator = z.object({
  username: z.string().min(4).max(16),
  email: z.string().email(),
  password: z.string().min(8)
});

const LogInValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

interface TokenDataType {
  token: string;
  expiresIn: number;
}

interface UserTokenType {
  jwt: TokenDataType,
  user: UserType
}

type SignUpType = z.infer<typeof SignUpValidator>;
type LogInType = z.infer<typeof LogInValidator>;

export { SignUpType, SignUpValidator, LogInType, LogInValidator, TokenDataType, UserTokenType };