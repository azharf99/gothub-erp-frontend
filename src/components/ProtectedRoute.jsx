import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    // Cek apakah ada access_token di Local Storage
    const isAuthenticated = localStorage.getItem('access_token');

    // Jika tidak ada token, tendang kembali ke halaman login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Jika ada token, izinkan masuk untuk me-render komponen di dalamnya (Outlet)
    return <Outlet />;
}