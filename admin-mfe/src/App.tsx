import { useState, useEffect } from 'react';
import { Users, UserPlus, ArrowLeft, Search, Filter } from 'lucide-react';
import InviteUserModal from './components/InviteUserModal';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isOwner: boolean;
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
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [teamMembers, searchQuery, roleFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const teamRes = await apiClient.get('/admin/team');
      setTeamMembers(teamRes.data || teamRes);
    } catch (error) {
      console.error('Failed to load team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = [...teamMembers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(member =>
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    setFilteredMembers(filtered);
    setCurrentPage(1);
  };

  const handleInviteUser = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    department?: string;
    jobTitle?: string;
  }) => {
    try {
      await apiClient.post('/admin/team', userData);
      setShowAddUserForm(false);
      loadData();
    } catch (error: any) {
      console.error('Failed to create user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      alert(errorMessage);
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

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await apiClient.delete(`/admin/team/${userId}`);
      loadData();
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      alert(errorMessage);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

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

  // Show Add User Form
  if (showAddUserForm) {
    return (
      <div className="p-6">
        <button
          onClick={() => setShowAddUserForm(false)}
          className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Team
        </button>
        
        <InviteUserModal
          onInvite={handleInviteUser}
          onClose={() => setShowAddUserForm(false)}
          currentUserEmail={user.email}
        />
      </div>
    );
  }

  // Show Team List
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
            onClick={() => setShowAddUserForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <UserPlus className="h-4 w-4" />
            Add New User
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center bg-card border border-border rounded-lg p-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="support">Support</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Joined
                </th>
                {user.role === 'admin' && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedMembers.map((member) => (
                <tr key={member.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {member.firstName} {member.lastName}
                          {member.isOwner && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full">
                              Owner
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === 'admin' && !member.isOwner && member.id !== user.id ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                        className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="support">Support</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        member.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}>
                        {member.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {member.department || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {member.jobTitle || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  {user.role === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {!member.isOwner && member.id !== user.id && (
                        <button
                          onClick={() => handleDeleteUser(member.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of {filteredMembers.length} members
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-border rounded-md text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-foreground hover:bg-accent'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-border rounded-md text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
