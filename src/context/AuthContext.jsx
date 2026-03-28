import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    // Tambahkan loading state agar saat refresh halaman tidak langsung dilempar ke login
    const [loading, setLoading] = useState(true); 

    const fetchProfile = async () => {
        try {
            // Karena axios kita sudah ada interceptor, token akan otomatis terkirim
            const response = await api.get('/profile');
            const userData = response.data.data;
            
            setUser(userData);
            // Ubah role ke huruf kecil (lowercase) agar seragam saat pengecekan nanti
            setRole(userData.role.toLowerCase()); 
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Gagal mengambil data profil:", error);
            logout(); // Jika gagal (misal token expired), bersihkan data
        } finally {
            setLoading(false);
        }
    };

    // Dijalankan sekali saat aplikasi pertama kali dimuat (atau saat halaman di-refresh)
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    // Fungsi login sekarang bersifat async karena harus menunggu fetchProfile selesai
    const login = async (accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        
        // Setelah token tersimpan, ambil profil user
        await fetchProfile();
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, role, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};