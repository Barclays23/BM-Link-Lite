import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../utils/getErrorMessage';





export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      navigate('/login', {
        replace: true,
        state: { message: 'Registration successful. Please log in.' },
      });
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <label htmlFor="register-name">Full name</label>
      <input
        id="register-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoComplete="name"
        maxLength={100}
        required
      />

      <label htmlFor="register-email">Email address</label>
      <input
        id="register-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />

      <label htmlFor="register-password">Password</label>
      <input
        id="register-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        minLength={8}
        required
      />

      <button
        className="button button-primary button-full"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}