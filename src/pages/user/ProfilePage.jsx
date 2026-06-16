import React, { useState, useEffect } from 'react';
import { usersApi } from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Trash2, 
  Sun, 
  Moon, 
  Settings, 
  ShieldAlert, 
  Palette, 
  Check,
  Monitor
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({ username: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await usersApi.updateMe({
        username: formData.username,
        email: formData.email
      });
      toast({
        title: "Success",
        description: "Profile information updated successfully.",
        variant: "success"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      await usersApi.updateMe({
        password: formData.newPassword
      });
      toast({
        title: "Success",
        description: "Password updated successfully.",
        variant: "success"
      });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Failed to change password.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await usersApi.deleteMe();
        toast({
          title: "Account Deleted",
          description: "Your account has been deleted.",
          variant: "warning"
        });
        logout();
        navigate('/login');
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete account.",
          variant: "destructive"
        });
      }
    }
  };

  // Skeleton loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg border p-6 md:p-8 space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2 col-span-1">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="col-span-3 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manage your profile, password and configurations</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[450px]">
          {/* Tabs Menu */}
          <div className="col-span-1 bg-gray-50/50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 p-4 space-y-1 flex md:flex-col overflow-x-auto md:overflow-x-visible">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full ${
                activeTab === 'profile'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <User size={18} />
              <span className="hidden md:inline">Edit Profile</span>
            </button>
            
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full ${
                activeTab === 'security'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <ShieldAlert size={18} />
              <span className="hidden md:inline">Security</span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full ${
                activeTab === 'appearance'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <Palette size={18} />
              <span className="hidden md:inline">Appearance</span>
            </button>
          </div>

          {/* Content Pane */}
          <div className="col-span-3 p-6 md:p-8">
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                  <p className="text-xs text-gray-500">Update your username and email address.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" 
                        required
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
                        className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" 
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-fit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
                    <p className="text-xs text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input 
                          type="password" 
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" 
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input 
                          type="password" 
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" 
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Changing...' : 'Update Password'}
                  </Button>
                </form>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-xs text-gray-500 mb-4">Permanently delete your account. This action cannot be undone.</p>
                  <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                    <Trash2 size={16} />
                    Delete Account
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
                  <p className="text-xs text-gray-500">Customize the application UI style.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border text-center transition-all ${
                      theme === 'light'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sun size={20} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Light Mode</span>
                      {theme === 'light' && <Check size={16} className="text-blue-600 dark:text-blue-500" />}
                    </div>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border text-center transition-all ${
                      theme === 'dark'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-slate-100 flex items-center justify-center border border-slate-800">
                      <Moon size={20} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</span>
                      {theme === 'dark' && <Check size={16} className="text-blue-600 dark:text-blue-500" />}
                    </div>
                  </button>

                  <button
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border text-center transition-all ${
                      theme === 'system'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <Monitor size={20} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">System</span>
                      {theme === 'system' && <Check size={16} className="text-blue-600 dark:text-blue-500" />}
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
