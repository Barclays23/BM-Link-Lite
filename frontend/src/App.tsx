import { Navigate, Route, Routes } from 'react-router-dom';

import Navbar from './components/layout/Navbar';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/guards/ProtectedRoute';
import PublicOnlyRoute from './components/guards/PublicOnlyRoute';



export default function App() {
   return (
      <>
         <Navbar />

         <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<PublicOnlyRoute />}>
               <Route path="/register" element={<RegisterPage />} />
               <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
               <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
         </Routes>
      </>
   );
}