import { z } from "zod";

export const SignUpSchema = z.object({
  userName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  passwordConfirm: z.string().min(6),
  userType: z.string(),
  fullName: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

//export default SignUpSchema;
