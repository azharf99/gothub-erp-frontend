import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/user';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 5;

    // State untuk Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalError, setModalError] = useState('');
    const [editingUserId, setEditingUserId] = useState(null);
    
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        password: '',
        role: 'Siswa' // Default role
    });

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        setIsLoading(true);
        setErrorMsg('');
        try {
            const response = await getUsers(page, limit);
            // Anggap backend mengembalikan response.data & response.meta
            setUsers(response.data);
            setMeta(response.meta);
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextPage = () => {
        if (meta && currentPage < meta.total_pages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const openAddModal = () => {
        setModalError('');
        setEditingUserId(null);
        setFormData({ nama: '', email: '', password: '', role: 'Siswa' });
        setIsModalOpen(true);
    };

    const handleEditClick = (user) => {
        setModalError('');
        setEditingUserId(user.ID);
        // Jangan masukkan password ke form saat edit
        setFormData({ nama: user.Nama, email: user.Email, role: user.Role, password: '' });
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini? Semua data terkait (seperti mapel) bisa terdampak.')) {
            try {
                await deleteUser(id);
                fetchUsers(currentPage); 
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setModalError('');

        try {
            if (editingUserId) {
                // UPDATE: Kirim tanpa password
                const updateData = {
                    nama: formData.nama,
                    email: formData.email,
                    role: formData.role
                };
                await updateUser(editingUserId, updateData);
            } else {
                // CREATE: Kirim dengan password
                await createUser(formData);
            }
            
            setIsModalOpen(false);
            if (!editingUserId && currentPage !== 1) {
                setCurrentPage(1); 
            } else {
                fetchUsers(currentPage);
            }
        } catch (error) {
            setModalError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fungsi warna badge untuk masing-masing Role
    const getRoleBadge = (role) => {
        switch (role) {
            case 'Admin': return 'bg-purple-100 text-purple-700';
            case 'Guru': return 'bg-blue-100 text-blue-700';
            case 'Karyawan': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700'; // Siswa
        }
    };

    // DECODE TOKEN UNTUK MENDAPATKAN ROLE SAAT INI
    const token = localStorage.getItem('access_token');
    let currentUserRole = 'Siswa';
    if (token) {
        try {
            // Trik standar mendekode JWT di Frontend tanpa library tambahan
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUserRole = payload.role;
        } catch (e) {
            console.error("Gagal membaca token");
        }
    }
    const isAdmin = currentUserRole === 'Admin';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Manajemen Pengguna</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola data Admin, Guru, Siswa, dan Karyawan</p>
                </div>
                <button onClick={openAddModal} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                    + Tambah Pengguna
                </button>
            </div>

            {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">{errorMsg}</div>
            )}

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Nama Lengkap</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Peran (Role)</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Memuat data...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Belum ada data pengguna.</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.ID} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-gray-500">#{user.ID}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{user.Nama}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.Email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.Role)}`}>
                                            {user.Role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleEditClick(user)} className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3">Edit</button>
                                        <button onClick={() => handleDeleteClick(user.ID)} className="text-red-600 hover:text-red-800 font-medium text-sm">Hapus</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!isLoading && meta && meta.total_pages > 0 && (
                <div className="flex items-center justify-between mt-6">
                    <span className="text-sm text-gray-600">
                        Menampilkan Halaman <span className="font-semibold">{meta.current_page}</span> dari <span className="font-semibold">{meta.total_pages}</span>
                    </span>
                    <div className="flex space-x-2">
                        <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition">Sebelumnya</button>
                        <button onClick={handleNextPage} disabled={currentPage === meta.total_pages} className="px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition">Selanjutnya</button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingUserId ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            {modalError && <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">{modalError}</div>}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <input type="text" name="nama" required value={formData.nama} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            {/* Hanya tampilkan field Password jika sedang mode Tambah (Bukan Edit) */}
                            {!editingUserId && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input type="password" name="password" required value={formData.password} onChange={handleInputChange} placeholder="Minimal 6 karakter" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            )}

                            {/* Hanya Admin yang bisa melihat dan mengubah dropdown Role */}
                            {isAdmin && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Peran Akses (Role)</label>
                                    <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                        <option value="Admin">Admin</option>
                                        <option value="Guru">Guru</option>
                                        <option value="Siswa">Siswa</option>
                                        <option value="Karyawan">Karyawan</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Batal</button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-blue-400">
                                    {isSubmitting ? 'Memproses...' : (editingUserId ? 'Simpan Perubahan' : 'Buat Akun')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}