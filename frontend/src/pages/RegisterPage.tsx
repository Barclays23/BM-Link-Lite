import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">GET STARTED</p>
        <h1>Create your account</h1>
        <p className="muted">
          Shorten and manage your links in one place.
        </p>

        <RegisterForm />

        <p className="auth-footer">
          <Link to="/login">Back to login</Link>
        </p>
      </section>
    </main>
  );
}