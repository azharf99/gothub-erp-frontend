import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import CourseList from './pages/CourseList'; // >>> IMPORT DI SINI
import UserList from './pages/UserList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
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