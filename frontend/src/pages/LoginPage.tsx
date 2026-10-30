import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Checking your session..." />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Log in</h1>
        <p className="muted">
          Enter your details to manage your links.
        </p>

        <LoginForm />
      </section>
    </main>
  );
}