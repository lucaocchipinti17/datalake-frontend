import './index.css';
import { ThemeProvider, createTheme} from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Login from './pages/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import ImportPage from './pages/Import.tsx'
import AddProductPage from './pages/AddProduct.tsx'
import AddClientPage from './pages/AddClient.tsx'
import AddCameraPage from './pages/AddCamera.tsx'
import LogsPage from './pages/Logs.tsx'
import ExportPage from './pages/Export.tsx';
import ManagementPage from './pages/Management.tsx';
import UserManager from './pages/UserManager.tsx';
import AdminManager from './pages/AdminManager.tsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          {/* Public login page */}
          <Route path="/" element={<Login />} />

          {/* Protected layout wrapper */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Nested protected pages */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="import" element={<ImportPage />} />
            <Route path="add-product" element={<AddProductPage />} />
            <Route path="add-client" element={<AddClientPage />} />
            <Route path="add-camera" element={<AddCameraPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="export" element={<ExportPage />} />
            <Route path="management" element={<ManagementPage />} />
            <Route path="users" element={<UserManager />} />
            <Route path="admin" element={<AdminManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </ThemeProvider>
);
