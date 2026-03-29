import api from './api';

export const loginUser = async (email, password) => {
    // Karena axios interceptor sudah dikonfigurasi, kita cukup panggil url endpoint-nya saja
    const response = await api.post('/login', { email, password });
    return response.data;
};

export const getProfile = async () => {
    // Request ini akan otomatis membawa Access Token berkat interceptor!
    const response = await api.get('/profile');
    return response.data;
};

export const registerStudent = async (userData) => {
    // userData berisi { nama, email, password }
    const response = await api.post('/register', userData);
    return response.data;
};