import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../utils/getErrorMessage';



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


type RegisterFormData = z.infer<typeof registerSchema>;





export default function RegisterForm() {
  const { register: registerUser } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);

      toast.success('Registration successful');

      navigate('/login', {
        replace: true,
        state: {
          message: 'Registration successful. Please log in.',
        },
      });
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'Registration failed.'),
      );
    }
  };

  return (
    <form
      className="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <label htmlFor="register-name">
        Full name
      </label>

      <input
        id="register-name"
        autoComplete="name"
        {...register('name')}
      />

      {errors.name && (
        <p className="field-error">
          {errors.name.message}
        </p>
      )}

      <label htmlFor="register-email">
        Email address
      </label>

      <input
        id="register-email"
        type="email"
        autoComplete="email"
        {...register('email')}
      />

      {errors.email && (
        <p className="field-error">
          {errors.email.message}
        </p>
      )}

      <label htmlFor="register-password">
        Password
      </label>

      <input
        id="register-password"
        type="password"
        autoComplete="new-password"
        {...register('password')}
      />

      {errors.password && (
        <p className="field-error">
          {errors.password.message}
        </p>
      )}

      <label htmlFor="register-confirm-password">
        Confirm Password
        </label>

        <input
            id="register-confirm-password"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
        />

        {errors.confirmPassword && (
            <p className="field-error">
                {errors.confirmPassword.message}
            </p>
        )}

      <button
        className="button button-primary button-full"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting
          ? 'Creating account...'
          : 'Create account'}
      </button>

      <p className="auth-footer">
        Already have an account?{' '}
        <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}