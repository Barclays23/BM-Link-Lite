import { useState, type FormEvent } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../utils/getErrorMessage';



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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });

      navigate(state?.from?.pathname || '/dashboard', {
        replace: true,
      });
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {state?.message && (
        <div className="alert alert-success">{state.message}</div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <label htmlFor="login-email">Email address</label>
      <input
        id="login-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />

      <label htmlFor="login-password">Password</label>
      <input
        id="login-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
        required
      />

      <button
        className="button button-primary button-full"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </button>

      <p className="auth-footer">
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </form>
  );
}