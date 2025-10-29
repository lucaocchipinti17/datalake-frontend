import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {API_BASE_URL} from '../api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });

  const token = localStorage.getItem('token');
  console.log(token);

  // Fetch users
  const loadUsers = async () => {
    const res = await fetch(`${API_BASE_URL}/users/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 401) return navigate('/');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Handle add user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'username': newUser.username,
        'password': newUser.password,
        'role': newUser.role
      }
    });

    if (res.ok) {
      alert('User added');
      setNewUser({ username: '', password: '', role: 'user' });
      loadUsers();
    } else {
      const err = await res.json();
      alert(err.error || 'Error adding user');
    }
  };

  // Handle delete
  const handleDelete = async (username: string) => {
    if (!window.confirm(`Delete user ${username}?`)) return;

    const res = await fetch(`${API_BASE_URL}/users/${username}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      alert('User deleted');
      loadUsers();
    } else {
      const err = await res.json();
      alert(err.error || 'Error deleting user');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      <h2>Add User</h2>
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <h2>All Users</h2>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.username}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleDelete(u.username)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;