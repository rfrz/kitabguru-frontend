import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  LogOut, Trash2, Plus, Edit2, Eye, Users, MessageSquare, Cpu, 
  ChevronLeft, ChevronRight, CheckCircle, XCircle 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserFormModal from '../../components/admin/UserFormModal';

const ITEMS_PER_PAGE = 10;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Data states
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [iot, setIot] = useState([]);

  // Pagination states
  const [userPage, setUserPage] = useState(1);
  const [sessionPage, setSessionPage] = useState(1);
  const [iotPage, setIotPage] = useState(1);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalIot, setTotalIot] = useState(0);

  // UX states
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch functions
  const fetchUsers = async (page = 1) => {
    try {
      const data = await adminApi.getUsers(page, ITEMS_PER_PAGE);
      setUsers(data.users || []);
      setTotalUsers(data.total || 0);
    } catch (e) {
      console.error("Failed to fetch users", e);
    }
  };

  const fetchSessions = async (page = 1) => {
    try {
      const data = await adminApi.getSessions(page, ITEMS_PER_PAGE);
      setSessions(data.sessions || []);
      setTotalSessions(data.total || 0);
    } catch (e) {
      console.error("Failed to fetch sessions", e);
    }
  };

  const fetchIot = async (page = 1) => {
    try {
      const data = await adminApi.getIoTSessions(page, ITEMS_PER_PAGE);
      setIot(data.sessions || []);
      setTotalIot(data.total || 0);
    } catch (e) {
      console.error("Failed to fetch IoT sessions", e);
    }
  };

  // Initial and reactive loads
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchUsers(userPage),
        fetchSessions(sessionPage),
        fetchIot(iotPage)
      ]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (!loading) fetchUsers(userPage);
  }, [userPage]);

  useEffect(() => {
    if (!loading) fetchSessions(sessionPage);
  }, [sessionPage]);

  useEffect(() => {
    if (!loading) fetchIot(iotPage);
  }, [iotPage]);

  // Auth
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Actions - Delete User
  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete user "${name}"?`)) {
      try {
        await adminApi.deleteUser(id);
        fetchUsers(userPage);
      } catch (e) {
        alert(e.response?.data?.detail || 'Failed to delete user');
      }
    }
  };

  // Actions - Delete Chat Session
  const handleDeleteSession = async (id) => {
    if (window.confirm('Delete this chat session?')) {
      try {
        await adminApi.deleteSession(id);
        fetchSessions(sessionPage);
      } catch (e) {
        console.error('Failed to delete session', e);
      }
    }
  };

  // Actions - Delete IoT Session
  const handleDeleteIotSession = async (id) => {
    if (window.confirm('Delete this IoT session?')) {
      try {
        await adminApi.deleteIoTSession(id);
        fetchIot(iotPage);
      } catch (e) {
        console.error('Failed to delete IoT session', e);
      }
    }
  };

  // Form Submit Handler (both create and edit)
  const handleFormSubmit = async (userId, data) => {
    if (userId) {
      // Edit
      await adminApi.updateUser(userId, data);
    } else {
      // Create
      await adminApi.createUser(data);
    }
    // Refresh user list
    fetchUsers(userPage);
  };

  const openAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const userTotalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE) || 1;
  const sessionTotalPages = Math.ceil(totalSessions / ITEMS_PER_PAGE) || 1;
  const iotTotalPages = Math.ceil(totalIot / ITEMS_PER_PAGE) || 1;

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Console</h1>
            <p className="text-sm text-muted-foreground">Manage user accounts, active chat sessions, and IoT activities.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => navigate('/chat')}>
              Back to Chat
            </Button>
            <Button variant="destructive" className="flex-1 sm:flex-initial gap-2" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-card p-1.5 rounded-xl border border-border/80 shadow-sm max-w-md">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'users' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Users size={16} />
            <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'sessions' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <MessageSquare size={16} />
            <span>Webchats</span>
          </button>
          <button
            onClick={() => setActiveTab('iot')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'iot' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Cpu size={16} />
            <span>IoT Sessions</span>
          </button>
        </div>

        {/* Tab Content */}
        <Card className="border border-border/80 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-5">
            <div>
              <CardTitle className="text-xl font-semibold">
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'sessions' && 'Web Chat Sessions'}
                {activeTab === 'iot' && 'IoT Device Sessions'}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {activeTab === 'users' && `Total: ${totalUsers} user accounts`}
                {activeTab === 'sessions' && `Total: ${totalSessions} active web sessions`}
                {activeTab === 'iot' && `Total: ${totalIot} active device sessions`}
              </p>
            </div>
            {activeTab === 'users' && (
              <Button size="sm" onClick={openAddUser} className="gap-2">
                <Plus size={16} />
                Add User
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            
            {/* USERS TABLE */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/50 text-muted-foreground font-medium">
                      <th className="p-4 pl-6">Username</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Created At</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-muted-foreground">No users found.</td>
                      </tr>
                    ) : (
                      users.map(u => (
                        <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4 pl-6 font-medium text-foreground">{u.username}</td>
                          <td className="p-4 text-muted-foreground">{u.email}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                              u.role === 'admin' 
                                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                                : 'bg-secondary text-secondary-foreground'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4">
                            {u.is_active ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs">
                                <CheckCircle size={14} /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-muted-foreground font-medium text-xs">
                                <XCircle size={14} /> Suspended
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="p-4 pr-6 text-right flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={() => openEditUser(u)}>
                              <Edit2 size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteUser(u.id, u.username)}>
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* WEBCHAT SESSIONS TABLE */}
            {activeTab === 'sessions' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/50 text-muted-foreground font-medium">
                      <th className="p-4 pl-6">Session ID</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Message Count</th>
                      <th className="p-4">Updated At</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {sessions.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-muted-foreground">No chat sessions found.</td>
                      </tr>
                    ) : (
                      sessions.map(s => (
                        <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4 pl-6 font-mono text-xs text-muted-foreground">{s.id.slice(0, 8)}...</td>
                          <td className="p-4 font-medium text-foreground">{s.title || 'Untitled Session'}</td>
                          <td className="p-4 text-muted-foreground font-semibold">{s.message_count}</td>
                          <td className="p-4 text-muted-foreground text-xs">{new Date(s.updated_at).toLocaleString()}</td>
                          <td className="p-4 pr-6 text-right flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="gap-1.5 h-8" onClick={() => navigate(`/admin/chat/${s.id}`)}>
                              <Eye size={14} />
                              View
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteSession(s.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* IOT SESSIONS TABLE */}
            {activeTab === 'iot' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/50 text-muted-foreground font-medium">
                      <th className="p-4 pl-6">Session ID</th>
                      <th className="p-4">Device ID</th>
                      <th className="p-4">Started At</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {iot.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-muted-foreground">No IoT sessions found.</td>
                      </tr>
                    ) : (
                      iot.map(i => (
                        <tr key={i.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4 pl-6 font-mono text-xs text-muted-foreground">{i.id.slice(0, 8)}...</td>
                          <td className="p-4 font-medium text-foreground">{i.device_id}</td>
                          <td className="p-4 text-muted-foreground text-xs">{new Date(i.started_at).toLocaleString()}</td>
                          <td className="p-4">
                            {i.ended_at ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 animate-pulse">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="p-4 pr-6 text-right flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="gap-1.5 h-8" onClick={() => navigate(`/admin/iot/${i.id}`)}>
                              <Eye size={14} />
                              View
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteIotSession(i.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls Footer */}
            <div className="flex items-center justify-between border-t border-border/50 px-6 py-4 bg-muted/10">
              <span className="text-xs text-muted-foreground">
                {activeTab === 'users' && `Showing page ${userPage} of ${userTotalPages}`}
                {activeTab === 'sessions' && `Showing page ${sessionPage} of ${sessionTotalPages}`}
                {activeTab === 'iot' && `Showing page ${iotPage} of ${iotTotalPages}`}
              </span>
              <div className="flex items-center gap-2">
                {activeTab === 'users' && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setUserPage(p => Math.max(p - 1, 1))} disabled={userPage === 1} className="h-8 w-8 p-0">
                      <ChevronLeft size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setUserPage(p => Math.min(p + 1, userTotalPages))} disabled={userPage === userTotalPages} className="h-8 w-8 p-0">
                      <ChevronRight size={16} />
                    </Button>
                  </>
                )}
                {activeTab === 'sessions' && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setSessionPage(p => Math.max(p - 1, 1))} disabled={sessionPage === 1} className="h-8 w-8 p-0">
                      <ChevronLeft size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSessionPage(p => Math.min(p + 1, sessionTotalPages))} disabled={sessionPage === sessionTotalPages} className="h-8 w-8 p-0">
                      <ChevronRight size={16} />
                    </Button>
                  </>
                )}
                {activeTab === 'iot' && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIotPage(p => Math.max(p - 1, 1))} disabled={iotPage === 1} className="h-8 w-8 p-0">
                      <ChevronLeft size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIotPage(p => Math.min(p + 1, iotTotalPages))} disabled={iotPage === iotTotalPages} className="h-8 w-8 p-0">
                      <ChevronRight size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* User Add/Edit Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
      />
    </div>
  );
}
