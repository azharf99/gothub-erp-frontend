import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { 
    HomeIcon, BookOpenIcon, UsersIcon, AcademicCapIcon, 
    ArrowLeftOnRectangleIcon, BellIcon, Bars3Icon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

export default function DashboardLayout() {
    const navigate = useNavigate();
    // State untuk mode collapse di desktop
    const [isCollapsed, setIsCollapsed] = useState(false);
    // State untuk sidebar di mobile
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    // State untuk dropdown notifikasi
    const [showNotifications, setShowNotifications] = useState(false);

    // Daftar menu yang komprehensif untuk sistem ERP sekolah
    const menuItems = [
        { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
        { name: 'Mata Pelajaran', icon: BookOpenIcon, path: '/dashboard/courses' },
        { name: 'Pengguna', icon: UsersIcon, path: '/dashboard/users' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (

        <>
        <Helmet>
            <title>Dashboard | Gothub ERP</title>
            <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            
            {/* OVERLAY UNTUK MOBILE */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                ></div>
            )}

            {/* SIDEBAR */}
            <aside 
                className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:static
                ${isCollapsed ? 'lg:w-20' : 'w-64'}`}
            >
                {/* Header Sidebar */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    {!isCollapsed && <span className="text-xl font-bold text-blue-600">Gothub ERP</span>}
                    {isCollapsed && <span className="text-xl font-bold text-blue-600 mx-auto">G</span>}
                    
                    {/* Tombol Collapse (Hanya muncul di Desktop) */}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:block p-1 text-gray-500 hover:bg-gray-100 rounded-md"
                    >
                        {isCollapsed ? <ChevronDoubleRightIcon className="w-5 h-5" /> : <ChevronDoubleLeftIcon className="w-5 h-5" />}
                    </button>
                </div>

                {/* Menu List */}
                <div className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <button
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsMobileOpen(false);
                                    }}
                                    className={`w-full flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition group
                                    ${isCollapsed ? 'lg:justify-center' : ''}`}
                                    title={isCollapsed ? item.name : ""}
                                >
                                    <item.icon className={`w-6 h-6 ${isCollapsed ? '' : 'mr-3'}`} />
                                    {/* Sembunyikan teks saat mode collapsed di desktop */}
                                    <span className={`${isCollapsed ? 'hidden lg:hidden' : 'block'}`}>
                                        {item.name}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tombol Logout di Bawah */}
                <div className="p-4 border-t border-gray-200">
                    <button 
                        onClick={handleLogout}
                        className={`w-full flex items-center p-2 text-red-600 rounded-lg hover:bg-red-50 transition
                        ${isCollapsed ? 'lg:justify-center' : ''}`}
                        title={isCollapsed ? "Logout" : ""}
                    >
                        <ArrowLeftOnRectangleIcon className={`w-6 h-6 ${isCollapsed ? '' : 'mr-3'}`} />
                        <span className={`${isCollapsed ? 'hidden lg:hidden' : 'block'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                
                {/* TOP HEADER */}
                <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 lg:px-8">
                    {/* Tombol Hamburger Mobile */}
                    <button 
                        onClick={() => setIsMobileOpen(true)}
                        className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>

                    <div className="flex-1"></div>

                    {/* Lonceng Notifikasi */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative"
                        >
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-1 right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        </button>

                        {/* Dropdown Notifikasi */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                                <div className="p-3 border-b border-gray-100 font-semibold text-gray-700">
                                    Notifikasi
                                </div>
                                <div className="p-4 text-sm text-gray-500 text-center">
                                    Belum ada notifikasi baru.
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* KONTEN HALAMAN (Dirender oleh React Router) */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
        </>
    );
}