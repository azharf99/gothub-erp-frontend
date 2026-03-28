import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserManagement = () => {
    // State untuk daftar pengguna dan status loading/error
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State KHUSUS MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' atau 'edit'
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        password: '',
        role: 'Siswa' // Nilai default
    });

    // 1. Fungsi READ (Mengambil data)
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data.data || []); 
            setError('');
        } catch (err) {
            console.error("Error fetching users:", err);
            setError('Gagal mengambil data pengguna.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. Fungsi DELETE (Menghapus data)
    const handleDelete = async (id) => {
        const isConfirm = window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?");
        if (!isConfirm) return;

        try {
            await api.delete(`/users/${id}`);
            alert("Pengguna berhasil dihapus!");
            // PERBAIKAN: Langsung ambil data terbaru dari backend agar layar ter-refresh
            fetchUsers(); 
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Gagal menghapus pengguna.");
        }
    };

    // 3. Fungsi untuk MEMBUKA MODAL (Tambah atau Edit)
    const openModal = (mode, user = null) => {
        setModalMode(mode);
        if (mode === 'edit' && user) {
            setSelectedId(user.ID);
            setFormData({
                nama: user.Nama,
                email: user.Email,
                password: user.Password,
                role: user.Role
            });
        } else {
            // Mode create, kosongkan semua form
            setSelectedId(null);
            setFormData({ nama: '', email: '', password: '', role: 'Siswa' });
        }
        setIsModalOpen(true);
    };

    // 4. Fungsi untuk MENUTUP MODAL
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ nama: '', email: '', password: '', role: 'Siswa' });
    };

    // 5. Fungsi untuk MENANGANI KETIKAN di Form
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 6. Fungsi SUBMIT (Menyimpan data Create atau Update ke Backend)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'create') {
                // Untuk Create, kirim semua data termasuk password
                await api.post('/register', formData);
                alert("Pengguna berhasil ditambahkan!");
            } else if (modalMode === 'edit') {
                // Untuk Edit, kita buat payload khusus yang pasti aman
                const payload = {
                    nama: formData.nama,
                    email: formData.email,
                    role: formData.role
                };
                
                // Pengecekan ketat: Jika password ada isinya (bukan spasi kosong), baru masukkan ke payload
                if (formData.password && formData.password.trim() !== '') {
                    payload.password = formData.password;
                }
                
                // Kirim data ke backend
                await api.put(`/users/${selectedId}`, payload);
                alert("Data pengguna berhasil diperbarui!");
            }
            
            closeModal(); // Tutup modal
            fetchUsers(); // Refresh tabel data
            
        } catch (err) {
            console.error("Error submitting form:", err);
            alert(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
        }
    };

    if (loading) return <div className="text-center py-10">Memuat data pengguna...</div>;
    if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
                {/* Tombol Buka Modal Create */}
                <button 
                    onClick={() => openModal('create')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition font-semibold"
                >
                    + Tambah Pengguna
                </button>
            </div>

            {/* TABEL PENGGUNA */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                            <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.ID} className="hover:bg-gray-50 transition">
                                    <td className="py-3 px-4 text-sm text-gray-700">{user.ID}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{user.Nama || '-'}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{user.Email}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                            ${user.Role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
                                              user.Role === 'Guru' ? 'bg-blue-100 text-blue-700' : 
                                              'bg-green-100 text-green-700'}`}>
                                            {user.Role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-center space-x-2">
                                        {/* Tombol Buka Modal Edit */}
                                        <button 
                                            onClick={() => openModal('edit', user)}
                                            className="text-yellow-600 hover:text-yellow-800 bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded transition"
                                        >
                                            Edit
                                        </button>
                                        {/* Tombol Hapus */}
                                        <button 
                                            onClick={() => handleDelete(user.ID)}
                                            className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-4 text-center text-gray-500">Belum ada data pengguna.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL FORM (Tampil hanya jika isModalOpen = true) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                            {modalMode === 'create' ? 'Tambah Pengguna Baru' : 'Edit Data Pengguna'}
                        </h3>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Nama</label>
                                <input 
                                    type="text" 
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password {modalMode === 'edit' && <span className="text-xs font-normal text-gray-500">(Kosongkan jika tidak ingin mengubah)</span>}
                                </label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required={modalMode === 'create'} // Wajib jika buat baru
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                                <select 
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="Siswa">Siswa</option>
                                    <option value="Guru">Guru</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-semibold"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;