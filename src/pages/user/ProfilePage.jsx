import React, { useState, useEffect } from 'react';
import { usersApi } from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { User, Mail, Lock, ArrowLeft, Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username || '', email: user.email || '', password: '' });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const payload = { 
        username: formData.username,
        email: formData.email
      };
      if (formData.password) {
        payload.password = formData.password;
      }
      
      await usersApi.updateMe(payload);
      setMessage('Profile updated successfully.');
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
    } catch (err) {
      setError('Failed to update profile. ' + (err.response?.data?.detail || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await usersApi.deleteMe();
        logout();
        navigate('/login');
      } catch (err) {
        setError('Failed to delete account.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-8 space-y-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">Your Profile</h1>
        </div>

        {message && <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">{message}</div>}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password (leave blank to keep current)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>

        <div className="pt-6 border-t mt-6">
          <h3 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h3>
          <Button variant="destructive" onClick={handleDelete} className="w-full flex items-center justify-center gap-2">
            <Trash2 size={16} />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
