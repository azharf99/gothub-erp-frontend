import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { registerStudent } from '../services/auth';

export default function Pendaftaran() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        // Validasi Frontend: Pastikan password sama
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Password dan Konfirmasi Password tidak cocok!');
            return;
        }

        setIsLoading(true);

        try {
            // Panggil API Golang (Endpoint /register)
            await registerStudent({
                nama: formData.nama,
                email: formData.email,
                password: formData.password
            });
            
            setSuccessMsg('Pendaftaran berhasil! Silakan masuk menggunakan akun Anda.');
            setFormData({ nama: '', email: '', password: '', confirmPassword: '' });
            
            // Redirect ke halaman login setelah 3 detik
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            setErrorMsg(error.message || 'Terjadi kesalahan saat mendaftar.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            {/* SEO UNTUK HALAMAN PENDAFTARAN */}
            <Helmet>
                <title>Daftar Siswa Baru | Gothub ERP</title>
                <meta name="description" content="Formulir pendaftaran siswa baru Gothub School. Bergabunglah bersama kami untuk mendapatkan pengalaman belajar terbaik dengan sistem edukasi modern." />
                <link rel="canonical" href="https://erp.domainkamu.com/pendaftaran" />
            </Helmet>

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link to="/" className="text-3xl font-extrabold text-blue-600 tracking-tight hover:opacity-80 transition">
                    Gothub<span className="text-gray-800">.</span>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                    Pendaftaran Siswa Baru
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition">
                        Masuk di sini
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm border border-gray-100 sm:rounded-xl sm:px-10">
                    
                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                            {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center font-medium">
                            {successMsg}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                            <div className="mt-1">
                                <input
                                    name="nama"
                                    type="text"
                                    required
                                    value={formData.nama}
                                    onChange={handleInputChange}
                                    className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                                    placeholder="Contoh: Budi Santoso"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                            <div className="mt-1">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                                    placeholder="budi@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1">
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength="6"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                                    placeholder="Minimal 6 karakter"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                            <div className="mt-1">
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                                    placeholder="Ulangi password Anda"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading || successMsg !== ''}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition"
                            >
                                {isLoading ? 'Memproses Pendaftaran...' : 'Daftar Sekarang'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}