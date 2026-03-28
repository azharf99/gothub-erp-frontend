import React, { useContext, useState } from 'react'; // Tambahkan useState
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserManagement from '../components/UserManagement'; // Import komponen baru

const Dashboard = () => {
    // Mengambil data user, role, dan fungsi logout dari Context
    const { user, role, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // State untuk mengetahui menu apa yang sedang aktif/diklik
    const [activeMenu, setActiveMenu] = useState('Ringkasan ERP');

    // Fungsi untuk menangani proses logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Mendefinisikan menu berdasarkan role
    // Kamu bisa menambahkan atau mengubah path/rute sesuai kebutuhan API-mu nanti
    const roleMenus = {
        admin: [
            { name: 'Ringkasan ERP', icon: '📊' },
            { name: 'Manajemen Pengguna', icon: '👥' },
            { name: 'Semua Mata Pelajaran', icon: '📚' },
            { name: 'Pengaturan Sistem', icon: '⚙️' },
        ],
        guru: [
            { name: 'Jadwal Mengajar', icon: '🗓️' },
            { name: 'Mata Pelajaran Saya', icon: '📖' },
            { name: 'Input Nilai Siswa', icon: '📝' },
        ],
        siswa: [
            { name: 'Jadwal Pelajaran', icon: '🗓️' },
            { name: 'Tugas & Ujian', icon: '✍️' },
            { name: 'Laporan Nilai', icon: '🎓' },
        ],
    };

    // Mengambil menu yang sesuai dengan role user saat ini. 
    // Jika role tidak dikenali, tampilkan array kosong.
    const currentMenu = roleMenus[role] || [];

    // FUNGSI BARU: Untuk me-render konten sesuai menu yang diklik
    const renderContent = () => {
        if (activeMenu === 'Manajemen Pengguna' && role === 'admin') {
            return <UserManagement />;
        }
        
        // Tampilan Default (Ringkasan ERP)
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Selamat Datang, {user?.email}! 👋
                </h2>
                <p className="text-gray-600 mb-6">
                    Ini adalah halaman dashboard khusus untuk <span className="font-semibold capitalize">{role}</span>. 
                    Anda sedang membuka menu: <span className="font-bold text-blue-600">{activeMenu}</span>.
                </p>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Kiri */}
            <aside className="w-64 bg-blue-800 text-white flex flex-col">
                <div className="p-6 border-b border-blue-700">
                    <h2 className="text-2xl font-bold">Gothub ERP</h2>
                    <p className="text-blue-300 text-sm mt-1 capitalize">Panel {role}</p>
                </div>
                
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {currentMenu.map((item, index) => (
                            <li key={index}>
                                <button 
                                onClick={() => setActiveMenu(item.name)}
                                className="w-full flex items-center gap-3 text-left px-4 py-3 rounded hover:bg-blue-700 transition-colors">
                                    <span>{item.icon}</span>
                                    <span>{item.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-blue-700">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors font-semibold"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Area Konten Utama Kanan */}
            <main className="flex-1 overflow-y-auto">
                {/* Header (Topbar) */}
                <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.email || 'Pengguna'}</p>
                            <p className="text-xs text-gray-500 capitalize">{role}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </div>
                </header>

                {/* Konten Dinamis yang dipanggil melalui fungsi renderContent() */}
                <div className="p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;