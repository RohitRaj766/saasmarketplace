import { useState } from 'react';
import { Shield, Info, Lock, User, Briefcase } from 'lucide-react';

interface InviteUserModalProps {
  onInvite: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    department?: string;
    jobTitle?: string;
  }) => void;
  onClose: () => void;
  currentUserEmail: string;
}

export default function InviteUserModal({ onInvite, onClose, currentUserEmail }: InviteUserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'support',
    department: '',
    jobTitle: '',
  });

  // Extract domain from current user's email
  const adminDomain = currentUserEmail.split('@')[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const roleDescriptions = {
    admin: 'Full access to all features including Analytics and Team management',
    support: 'Access to Overview, Orders, and Billing only'
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Create New User</h3>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Information
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Account Credentials */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Account Credentials
            </h4>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={`user@${adminDomain}`}
                value={formData.email}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Must be from your organization domain: @{adminDomain}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Role & Permissions
            </h4>

            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-foreground">
                Role *
              </label>
              <select
                id="role"
                name="role"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="support">Support</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex items-start gap-2 p-3 bg-accent/50 rounded-lg">
                <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {roleDescriptions[formData.role as keyof typeof roleDescriptions]}
                </p>
              </div>
            </div>
          </div>

          {/* Optional Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Optional Information
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="department" className="block text-sm font-medium text-foreground">
                  Department
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Sales"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="jobTitle" className="block text-sm font-medium text-foreground">
                  Job Title
                </label>
                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Support Agent"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
