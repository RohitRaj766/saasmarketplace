import { useState, useEffect } from 'react';
import { Users, UserPlus, Activity } from 'lucide-react';
import TeamList from './components/TeamList';
import InviteUserModal from './components/InviteUserModal';
import ActivityLogs from './components/ActivityLogs';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  jobTitle?: string;
  createdAt: string;
}

interface AdminAppProps {
  user: any;
  apiClient: any;
}

export default function AdminApp({ user, apiClient }: AdminAppProps) {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'team' | 'activity'>('team');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch team members
      const teamRes = await apiClient.get('/admin/team');
      setTeamMembers(teamRes.data || teamRes);

      // Fetch activity logs
      const logsRes = await apiClient.get('/admin/activity-logs');
      setActivityLogs(logsRes.data || logsRes);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (email: string, role: string) => {
    try {
      await apiClient.post('/admin/team/invite', { email, role });
      setShowInviteModal(false);
      loadData();
    } catch (error) {
      console.error('Failed to invite user:', error);
      alert('Failed to invite user');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await apiClient.patch(`/admin/team/${userId}/role`, { role: newRole });
      loadData();
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update role');
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    
    try {
      await apiClient.delete(`/admin/team/${userId}`);
      loadData();
    } catch (error) {
      console.error('Failed to deactivate user:', error);
      alert('Failed to deactivate user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Team Management</h2>
            <p className="text-sm text-muted-foreground">Manage your team members and permissions</p>
          </div>
        </div>
        
        {user.role === 'admin' && (
          <button 
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <UserPlus className="h-4 w-4" />
            Invite Team Member
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === 'team'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <Users className="h-4 w-4" />
            Team Members
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
              {teamMembers.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
              activeTab === 'activity'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <Activity className="h-4 w-4" />
            Activity Logs
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'team' && (
        <TeamList
          members={teamMembers}
          currentUser={user}
          onUpdateRole={handleUpdateRole}
          onDeactivate={handleDeactivateUser}
        />
      )}

      {activeTab === 'activity' && (
        <ActivityLogs logs={activityLogs} />
      )}

      {/* Modal */}
      {showInviteModal && (
        <InviteUserModal
          onInvite={handleInviteUser}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}
