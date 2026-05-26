import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [iot, setIot] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, sessionsData, iotData] = await Promise.all([
          adminApi.getUsers(),
          adminApi.getSessions(),
          adminApi.getIoTSessions()
        ]);
        setUsers(usersData.users || []);
        setSessions(sessionsData.sessions || []);
        setIot(iotData.sessions || []);
      } catch (error) {
        console.error("Admin fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="p-8 text-center">Loading admin data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/chat')}>Back to Chat</Button>
            <Button variant="destructive" onClick={handleLogout}><LogOut size={16} className="mr-2" /> Logout</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {users.map(u => (
                  <li key={u.id} className="flex justify-between text-sm border-b pb-1">
                    <span>{u.username}</span>
                    <span className="text-gray-500">{u.role}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Web Chat Sessions ({sessions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {sessions.map(s => (
                  <li key={s.id} className="flex flex-col text-sm border-b pb-1">
                    <span className="truncate font-medium">{s.title || 'Untitled'}</span>
                    <span className="text-gray-500 text-xs">Msgs: {s.message_count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>IoT Sessions ({iot.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {iot.map(i => (
                  <li key={i.id} className="flex flex-col text-sm border-b pb-1">
                    <span className="font-medium">Device: {i.device_id}</span>
                    <span className="text-gray-500 text-xs">{new Date(i.started_at).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
