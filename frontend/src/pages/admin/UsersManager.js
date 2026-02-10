import React, { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', role: 'user' });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user.userid);
    setFormData({ username: user.username, email: user.email, role: user.role || 'user' });
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser, formData);
      } else {
        await adminService.createUser(formData);
      }
      setEditingUser(null);
      setFormData({ username: '', email: '', role: 'user' });
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (userid) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(userid);
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Deletion failed');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Users Management</h1>
        <button
          onClick={() => {
            setEditingUser('new');
            setFormData({ username: '', email: '', role: 'user' });
          }}
          style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          + Add User
        </button>
      </div>

      {editingUser && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3>{editingUser === 'new' ? 'Create New User' : 'Edit User'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label>Username</label>
              <input
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </div>
            <div>
              <label>Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button onClick={handleSave} style={{ background: '#3498db', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>
              Save
            </button>
            <button onClick={() => setEditingUser(null)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Username</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Role</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.userid} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.75rem' }}>{user.userid}</td>
                <td style={{ padding: '0.75rem' }}>{user.username}</td>
                <td style={{ padding: '0.75rem' }}>{user.email}</td>
                <td style={{ padding: '0.75rem' }}>{user.role}</td>
                <td style={{ padding: '0.75rem' }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{ marginRight: '0.5rem', background: '#3498db', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.userid)}
                    style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManager;