import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../utils/getErrorMessage';




const loginSchema = z.object({
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



type LoginFormData = z.infer<typeof loginSchema>;

interface LoginLocationState {
  from?: {
    pathname?: string;
  };
  message?: string;
}




export default function LoginForm() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LoginLocationState | null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);

      toast.success('Login successful');

      navigate(state?.from?.pathname || '/dashboard', {
        replace: true,
      });
    } catch (error) {
      toast.error(
        getErrorMessage(error, 'Login failed.'),
      );
    }
  };

  return (
    <form
      className="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {state?.message && (
        <div className="alert alert-success">
          {state.message}
        </div>
      )}

      <label htmlFor="login-email">
        Email address
      </label>

      <input
        id="login-email"
        type="email"
        autoComplete="email"
        {...register('email')}
      />

      {errors.email && (
        <p className="field-error">
          {errors.email.message}
        </p>
      )}

      <label htmlFor="login-password">
        Password
      </label>

      <input
        id="login-password"
        type="password"
        autoComplete="current-password"
        {...register('password')}
      />

      {errors.password && (
        <p className="field-error">
          {errors.password.message}
        </p>
      )}

      <button
        className="button button-primary button-full"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </button>

      <p className="auth-footer">
        Don't have an account?{' '}
        <Link to="/register">Create one</Link>
      </p>
    </form>
  );
}