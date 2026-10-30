import z from "zod";



export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address.')
    .max(50, 'Email must not exceed 50 characters.'),

  password: z
    .string()
    .min(1, 'Password is required.')
    .max(20, 'Password must not exceed 20 characters.'),
});



export type LoginFormData = z.infer<typeof loginSchema>;