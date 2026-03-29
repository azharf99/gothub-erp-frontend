import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Helmet>
                <title>Gothub ERP - Penerimaan Siswa Baru</title>
                <meta name="description" content="Bergabunglah dengan Gothub School. Platform edukasi modern dengan fasilitas terbaik. Buka pendaftaran siswa baru tahun ajaran ini." />
                <meta name="keywords" content="Pendaftaran Siswa Baru, Gothub School, Sekolah Modern, ERP Edukasi" />
                <meta property="og:title" content="Penerimaan Siswa Baru - Gothub ERP" />
                <meta property="og:description" content="Bergabunglah dengan Gothub School sekarang. Pendaftaran mudah, cepat, dan transparan." />
                <link rel="canonical" href="https://erp.azharfa.cloud/" />
            </Helmet>


            <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 lg:px-12">
                <div className="text-2xl font-extrabold text-blue-600 tracking-tight">
                    Gothub<span className="text-gray-800">.</span>
                </div>
                <div className="flex space-x-4">
                    <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition">
                        Masuk
                    </Link>
                    <Link to="/pendaftaran" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
                        Daftar Sekarang
                    </Link>
                </div>
            </nav>

            
            <main className="flex flex-col items-center justify-center px-4 pt-20 pb-24 text-center lg:pt-32">
                <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-semibold text-blue-700 bg-blue-50 rounded-full">
                    <span className="flex w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                    Pendaftaran Tahun Ajaran Baru Telah Dibuka
                </div>
                
                <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-gray-900 lg:text-7xl leading-tight">
                    Bangun Masa Depanmu <br className="hidden lg:block"/> Bersama <span className="text-blue-600">Gothub School</span>
                </h1>
                
                <p className="max-w-2xl mt-6 text-lg text-gray-500 lg:text-xl">
                    Sistem manajemen edukasi terpadu yang menghubungkan siswa, guru, dan kurikulum dalam satu platform cerdas. Cepat, transparan, dan aman.
                </p>
                
                <div className="flex flex-col mt-10 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <Link to="/pendaftaran" className="px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all duration-200">
                        Mulai Pendaftaran
                    </Link>
                    <a href="#fitur" className="px-8 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
                        Pelajari Lebih Lanjut
                    </a>
                </div>
            </main>

            <section id="fitur" className="px-6 py-16 bg-gray-50 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Mengapa Memilih Kami?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Kartu Fitur 1 */}
                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 mb-4 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl font-bold">🎓</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Kurikulum Modern</h3>
                            <p className="text-gray-500">Materi pelajaran yang selalu *up-to-date* dan relevan dengan kebutuhan industri.</p>
                        </div>
                        {/* Kartu Fitur 2 */}
                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 mb-4 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl font-bold">⚡</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Akses Cepat & Aman</h3>
                            <p className="text-gray-500">Platform ERP kami dibangun dengan teknologi Golang yang menjamin kecepatan dan keamanan data.</p>
                        </div>
                        {/* Kartu Fitur 3 */}
                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 mb-4 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xl font-bold">👨‍🏫</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Pengajar Profesional</h3>
                            <p className="text-gray-500">Didukung oleh tenaga pendidik yang kompeten dan berpengalaman di bidangnya.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}