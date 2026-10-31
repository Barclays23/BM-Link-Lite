import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';



export default function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Checking your session..." />;
  }

  // If already authenticated, bounce to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}