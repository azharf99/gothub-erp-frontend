import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    // Menyiapkan state untuk menyimpan data ketikan pengguna
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    // State untuk menyimpan pesan error atau sukses
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate();

    // Fungsi untuk menangani perubahan teks pada input form
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Fungsi yang dijalankan saat tombol "Daftar" diklik
    const handleRegister = async (e) => {
        e.preventDefault(); // Mencegah halaman refresh
        setError('');
        setSuccess('');

        // Validasi sederhana: Pastikan password dan konfirmasi password sama
        if (formData.password !== formData.confirmPassword) {
            setError('Password dan Konfirmasi Password tidak cocok!');
            return;
        }

        try {
            // Mengirim data pendaftaran ke backend
            // Sesuaikan properti objek ini jika backend meminta nama field yang berbeda
            await api.post('/register', {
                nama: formData.nama,
                email: formData.email,
                password: formData.password
            });

            // Jika berhasil, tampilkan pesan sukses
            setSuccess('Registrasi berhasil! Silakan login.');
            
            // Mengarahkan pengguna ke halaman login setelah 2 detik
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            // Jika gagal (misal email sudah terdaftar), tangkap error dari backend
            setError(err.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Daftar Akun Gothub ERP</h2>
                
                {/* Area untuk menampilkan pesan error atau sukses */}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{success}</div>}
                
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
                        <input 
                            type="text" 
                            name="nama"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={formData.nama} 
                            onChange={handleChange} 
                            required 
                            placeholder="Masukkan nama Anda"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            placeholder="nama@email.com"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            placeholder="Minimal 6 karakter"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Konfirmasi Password</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            required 
                            placeholder="Ulangi password Anda"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Daftar Sekarang
                    </button>
                </form>

                {/* Link kembali ke halaman Login */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                        Masuk di sini
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;