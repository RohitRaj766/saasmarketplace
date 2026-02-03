import { useState } from 'react';
import { Mail, Briefcase, Building2, Calendar, Edit2, UserX, Shield, User as UserIcon } from 'lucide-react';

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

interface TeamListProps {
  members: User[];
  currentUser: any;
  onUpdateRole: (userId: string, role: string) => void;
  onDeactivate: (userId: string) => void;
}

export default function TeamList({ members, currentUser, onUpdateRole, onDeactivate }: TeamListProps) {
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': 
        return 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'support': 
        return 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400';
      default: 
        return 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-3 w-3" />;
      case 'support': return <UserIcon className="h-3 w-3" />;
      default: return <UserIcon className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member) => (
        <div key={member.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          {/* Card Header */}
          <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                {member.firstName?.[0]}{member.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {member.firstName} {member.lastName}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-4">
            {/* Role */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Role</span>
              {editingRole === member.id ? (
                <select
                  className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={member.role}
                  onChange={(e) => {
                    onUpdateRole(member.id, e.target.value);
                    setEditingRole(null);
                  }}
                  onBlur={() => setEditingRole(null)}
                  autoFocus
                >
                  <option value="support">Support</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={getRoleBadgeClass(member.role)}>
                    {getRoleIcon(member.role)}
                    {member.role}
                  </span>
                  {currentUser.role === 'admin' && member.id !== currentUser.id && (
                    <button
                      onClick={() => setEditingRole(member.id)}
                      className="p-1 hover:bg-accent rounded transition-colors"
                      title="Edit role"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Department */}
            {member.department && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  Department
                </span>
                <span className="text-sm font-medium text-foreground">{member.department}</span>
              </div>
            )}

            {/* Job Title */}
            {member.jobTitle && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  Job Title
                </span>
                <span className="text-sm font-medium text-foreground">{member.jobTitle}</span>
              </div>
            )}

            {/* Joined Date */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Joined
              </span>
              <span className="text-sm font-medium text-foreground">{formatDate(member.createdAt)}</span>
            </div>
          </div>

          {/* Card Footer */}
          {currentUser.role === 'admin' && member.id !== currentUser.id && (
            <div className="px-6 py-4 bg-accent/50 border-t border-border">
              <button
                onClick={() => onDeactivate(member.id)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500/20 transition-colors font-medium text-sm"
              >
                <UserX className="h-4 w-4" />
                Delete User
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
