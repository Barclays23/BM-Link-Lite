import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';




export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <header className="navbar">
        <Link
            to={user ? '/dashboard' : '/login'}
            className="brand"
        >
            Link Lite
        </Link>

        <nav className="navbar-right">
            {user ? (
                <>
                    <span className="user-email">{user.email}</span>
                    <button
                        className="button button-outline"
                        onClick={() => void handleLogout()}
                        >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
        </header>
    );
}