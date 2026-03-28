import api from './api';

// Fungsi untuk mengambil daftar mata pelajaran dengan pagination
export const getCourses = async (page = 1, limit = 10) => {
    // Axios Interceptor kita akan otomatis menempelkan token JWT di sini!
    const response = await api.get(`/courses?page=${page}&limit=${limit}`);
    return response.data; // Mengembalikan struktur: { success, message, data, meta }
};

export const createCourse = async (courseData) => {
    // courseData berisi { nama: "...", deskripsi: "..." }
    const response = await api.post('/courses', courseData);
    return response.data;
};

export const updateCourse = async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
};

export const deleteCourse = async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
};