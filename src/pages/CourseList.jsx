import { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/course';

export default function CourseList() {
    const [courses, setCourses] = useState([]);
    const [meta, setMeta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    
    // State untuk Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 5;

    // State untuk Modal & Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalError, setModalError] = useState('');
    const [formData, setFormData] = useState({ nama: '', deskripsi: '' });
    
    // STATE BARU: Menandai apakah kita sedang Edit atau Tambah baru
    const [editingCourseId, setEditingCourseId] = useState(null);

    useEffect(() => {
        fetchCourses(currentPage);
    }, [currentPage]);

    const fetchCourses = async (page) => {
        setIsLoading(true);
        setErrorMsg('');
        try {
            const response = await getCourses(page, limit);
            if (response.success) {
                setCourses(response.data);
                setMeta(response.meta);
            }
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

    // ==========================================
    // HANDLER UNTUK AKSI CRUD
    // ==========================================
    
    // 1. Membuka Modal untuk TAMBAH data
    const openAddModal = () => {
        setModalError('');
        setEditingCourseId(null); // Pastikan mode edit mati
        setFormData({ nama: '', deskripsi: '' }); // Kosongkan form
        setIsModalOpen(true);
    };

    // 2. Membuka Modal untuk EDIT data
    const handleEditClick = (course) => {
        setModalError('');
        setEditingCourseId(course.id); // Aktifkan mode edit dengan ID ini
        setFormData({ nama: course.nama, deskripsi: course.deskripsi }); // Isi form dengan data lama
        setIsModalOpen(true);
    };

    // 3. Mengeksekusi HAPUS data
    const handleDeleteClick = async (id) => {
        // Beri peringatan konfirmasi bawaan browser agar tidak tidak sengaja terhapus
        if (window.confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini?')) {
            try {
                await deleteCourse(id);
                // REFRESH DATA LANGSUNG SETELAH HAPUS
                fetchCourses(currentPage); 
            } catch (error) {
                // Tampilkan error (misal jika Guru mencoba menghapus mapel milik orang lain)
                alert(error.message);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 4. Mengeksekusi SIMPAN (Bisa Tambah atau Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setModalError('');

        try {
            // Cek kita sedang di mode mana?
            if (editingCourseId) {
                // MODE EDIT
                await updateCourse(editingCourseId, formData);
            } else {
                // MODE TAMBAH
                await createCourse(formData);
            }
            
            // Tutup dan bersihkan modal
            setIsModalOpen(false);
            setFormData({ nama: '', deskripsi: '' });
            setEditingCourseId(null);
            
            // REFRESH DATA LANGSUNG SETELAH SIMPAN
            if (!editingCourseId && currentPage !== 1) {
                // Jika tambah baru dan kita tidak di halaman 1, lompat ke halaman 1
                setCurrentPage(1); 
            } else {
                // Jika edit, cukup muat ulang halaman saat ini
                fetchCourses(currentPage);
            }
        } catch (error) {
            setModalError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Daftar Mata Pelajaran</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola data kurikulum dan pengajar</p>
                </div>
                
                <button 
                    onClick={openAddModal}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                >
                    + Tambah Mapel
                </button>
            </div>

            {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
                    {errorMsg}
                </div>
            )}

            {/* TABEL DATA */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Mata Pelajaran</th>
                            <th className="px-6 py-3">Deskripsi</th>
                            <th className="px-6 py-3">Pengajar</th>
                            <th className="px-6 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Memuat data...</td></tr>
                        ) : courses.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Belum ada data mata pelajaran.</td></tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-gray-500">#{course.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{course.nama}</td>
                                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{course.deskripsi}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                                                {course.teacher?.Nama?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="text-gray-800 font-medium">{course.teacher?.Nama || 'Tidak diketahui'}</p>
                                                <p className="text-xs text-gray-500">{course.teacher?.Email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {/* TOMBOL EDIT & HAPUS SUDAH AKTIF */}
                                        <button 
                                            onClick={() => handleEditClick(course)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(course.id)}
                                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
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

            {/* KOMPONEN MODAL (Cerdas: Bisa Edit & Tambah) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            {/* Judul Modal berubah dinamis */}
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingCourseId ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            {modalError && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
                                    {modalError}
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Mata Pelajaran</label>
                                <input 
                                    type="text" 
                                    name="nama"
                                    required
                                    value={formData.nama}
                                    onChange={handleInputChange}
                                    placeholder="Contoh: Fisika Kuantum"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                                <textarea 
                                    name="deskripsi"
                                    required
                                    rows="3"
                                    value={formData.deskripsi}
                                    onChange={handleInputChange}
                                    placeholder="Deskripsi materi yang akan diajarkan..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                    Batal
                                </button>
                                {/* Teks tombol berubah dinamis */}
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:bg-blue-400">
                                    {isSubmitting ? 'Menyimpan...' : (editingCourseId ? 'Simpan Perubahan' : 'Simpan Mapel')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}