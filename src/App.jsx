import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Pendaftaran from './pages/Pendaftaran';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import CourseList from './pages/CourseList';
import UserList from './pages/UserList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTE PUBLIK */}
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/pendaftaran" element={<Pendaftaran />} />
        
        {/* RUTE TERLINDUNGI (Dashboard ERP) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<div><h1 className="text-2xl font-bold">Selamat Datang di Gothub ERP</h1></div>} />
            <Route path="courses" element={<CourseList />} /> 
            <Route path="users" element={<UserList />} /> 
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;