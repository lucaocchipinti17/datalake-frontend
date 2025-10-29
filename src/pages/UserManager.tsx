import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Delete, Add } from '@mui/icons-material';
import API from '../api';

interface User {
  username: string;
  role: string;
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users/');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      await API.post('/users/', null, {
        username,
        password,
        role,
      });
      setOpen(false);
      setUsername('');
      setPassword('');
      setRole('user');
      fetchUsers();
    } catch (err) {
      console.error('Failed to create user', err);
    }
  };

  const handleDeleteUser = async (username: string) => {
    try {
      await API.delete(`/users/${username}`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const columns: GridColDef[] = [
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'role', headerName: 'Role', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <IconButton onClick={() => handleDeleteUser(params.row.username)}>
          <Delete />
        </IconButton>
      ),
    },
  ];

  return (
    <Box p={4}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5">User Manager</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add User
        </Button>
      </Stack>

      <DataGrid
        autoHeight
        rows={users.map((u) => ({ id: u.username, ...u }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              autoFocus
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddUser}
            disabled={!username || !password}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
