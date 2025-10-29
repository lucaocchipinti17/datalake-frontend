import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  CssBaseline,
  CircularProgress,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import UserDropdown from '../components/UserDropdown';
import { useEffect, useState } from 'react';
import API from '../api';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { text: 'Imports', path: '/import', icon: <UploadFileIcon /> },
  { text: 'Logs', path: '/logs', icon: <ListAltIcon /> },
  { text: 'Export', path: '/export', icon: <DownloadIcon /> },
];

const adminItems = [
  { text: 'Users', path: '/users', icon: <DashboardIcon /> },
  { text: 'Management', path: '/admin', icon: <SettingsIcon /> },
];

export default function DashboardLayout() {
  const location = useLocation();
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await API.get('/users/info');
        const data = await res.json();
        setRole(data.role); // 'admin' or 'user'
      } catch (err) {
        console.error('Error fetching user info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <UserDropdown />
      <CssBaseline />

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            p: 2,
          },
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'grey.900', mb: -3, ml: 1 }}>
          Datalake
        </Typography>
        <Toolbar />
        <List>
          {navItems.map(({ text, path, icon }) => (
            <ListItemButton
              key={text}
              component={Link}
              to={path}
              selected={location.pathname === path}
              sx={{
                borderRadius: 2,
                color: 'text.primary',
                mb: 1,
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: 'action.hover' },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { backgroundColor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>

        {role === 'admin' && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'semibold', color: 'grey.900', mb: -3, ml: 1 }}>
              Admin
            </Typography>
            <Toolbar />
            <List>
              {adminItems.map(({ text, path, icon }) => (
                <ListItemButton
                  key={text}
                  component={Link}
                  to={path}
                  selected={location.pathname === path}
                  sx={{
                    borderRadius: 2,
                    color: 'text.primary',
                    mb: 1,
                    transition: 'background-color 0.2s',
                    '&:hover': { backgroundColor: 'action.hover' },
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': { backgroundColor: 'primary.dark' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              ))}
            </List>
          </>
        )}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
