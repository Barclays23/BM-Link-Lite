import z from "zod";


const NAME_REGEX = /^[A-Za-z]+(?:[' -][A-Za-z]+)*$/;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;



export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .min(5, 'Name must contain at least 5 characters.')
    .max(30, 'Name must not exceed 30 characters.')
    .regex(
      NAME_REGEX,
      'Name can only contain letters, spaces, hyphens, and apostrophes without trailing symbols.'
    ),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address.')
    .max(100, 'Email must not exceed 100 characters.'),

  password: z
    .string()
    .min(1, 'Password is required.')
    .min(8, 'Password must be at least 8 characters long.')
    .max(20, 'Password must not exceed 20 characters.')
    .refine((val) => UPPERCASE_REGEX.test(val), {
      message: 'Password must contain at least one uppercase letter.',
    })
    .refine((val) => LOWERCASE_REGEX.test(val), {
      message: 'Password must contain at least one lowercase letter.',
    })
    .refine((val) => NUMBER_REGEX.test(val), {
      message: 'Password must contain at least one number.',
    })
    .refine((val) => SPECIAL_CHAR_REGEX.test(val), {
      message: 'Password must contain at least one special character.',
    }),

    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password.'),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'], // Attaches error directly to the confirmPassword field
});


export type RegisterFormData = z.infer<typeof registerSchema>;