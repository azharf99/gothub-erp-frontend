import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth';
import { Helmet } from 'react-helmet-async';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            // Memanggil API backend Go (ini sudah berisi response.data dari Axios)
            const res = await loginUser(email, password);
            
            // Trik Ninja: Ambil token entah itu terbungkus di dalam objek 'data' atau langsung di luar
            const payload = res.data ? res.data : res;
            const { access_token, refresh_token } = payload;
            
            // Validasi keamanan ekstra: Pastikan token benar-benar ada
            if (!access_token) {
                throw new Error("Token tidak ditemukan dalam respons server");
            }

            // Simpan token ke Local Storage
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            
            // Arahkan user ke halaman Dashboard
            navigate('/dashboard');
        } catch (error) {
            // Tangkap pesan error dari API, ATAU dari JavaScript throw new Error di atas
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        
        <Helmet>
            <title>Masuk | Gothub ERP</title>
            <meta name="description" content="Silakan masuk ke akun Gothub ERP Anda untuk mengelola sistem akademik." />
            <link rel="canonical" href="https://erp.domainkamu.com/login" />
        </Helmet>

        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Gothub ERP</h1>
                    <p className="text-sm text-gray-500 mt-2">Silakan masuk ke akun Anda</p>
                </div>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:bg-blue-400"
                    >
                        {isLoading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>
            </div>
        </div>
        </>
    );
}