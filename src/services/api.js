import axios from 'axios';

// Buat instance Axios yang mengarah ke API Golang kita
const api = axios.create({
    baseURL: '/api/v1', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// ==========================================
// REQUEST INTERCEPTOR: Menyisipkan Token
// ==========================================
api.interceptors.request.use(
    (config) => {
        // Ambil token dari Local Storage setiap kali ada request keluar
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 1. Logika Refresh Token (Tetap sama seperti sebelumnya)
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/login') {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post('/api/v1/refresh-token', { refresh_token: refreshToken });
                const { access_token, refresh_token: new_refresh_token } = response.data.data;
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', new_refresh_token);
                originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(new Error("Sesi Anda telah berakhir. Silakan login kembali."));
            }
        }

        // ==========================================
        // 2. SENTRALISASI PESAN ERROR BACKEND
        // ==========================================
        let errorMessage = "Terjadi kesalahan yang tidak terduga.";

        // Jika error berasal dari balasan Backend Golang kita
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message; // Ambil pesan murni dari Golang
        } 
        // Jika server mati atau internet putus (tidak ada response sama sekali)
        else if (error.message === 'Network Error') {
            errorMessage = "Koneksi ke server terputus. Pastikan server Golang menyala.";
        }

        // Bungkus pesan tersebut ke dalam objek Error standar JavaScript dan lemparkan ke komponen
        return Promise.reject(new Error(errorMessage));
    }
);

export default api;