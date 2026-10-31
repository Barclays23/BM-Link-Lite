import LoginForm from '../components/auth/LoginForm';



export default function LoginPage() {

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