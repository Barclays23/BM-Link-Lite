import { Link } from 'react-router-dom';



export default function NotFoundPage() {
    return (
        <main className="auth-page">
            <section className="auth-card not-found">
                <p className="eyebrow">404 ERROR</p>
                <h1>Page not found</h1>
                <p className="muted">
                    The page you are looking for does not exist.
                </p>
                <Link className="button button-primary" to="/login">
                    Go to login
                </Link>
            </section>
        </main>
    );
}