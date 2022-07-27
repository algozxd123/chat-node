import { z } from 'zod';

const SignUpValidator = z.object({
  username: z.string().min(4).max(8),
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

type SignUpType = z.infer<typeof SignUpValidator>;
type LogInType = z.infer<typeof LogInValidator>;

export { SignUpType, SignUpValidator, LogInType, LogInValidator, TokenDataType };