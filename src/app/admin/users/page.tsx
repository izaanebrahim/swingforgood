'use client';

import { useState, useEffect } from 'react';
import { Users, Search, CreditCard, Edit, ChevronDown } from 'lucide-react';

interface UserItem {
  id: string;
  email: string;
  full_name: string;
  role: string;
  subscription_status: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, this would fetch from /api/admin/users
    setLoading(false);
  }, []);

  const statusColors: Record<string, string> = {
    active: 'text-brand-400 bg-brand-500/10',
    past_due: 'text-amber-400 bg-amber-500/10',
    canceled: 'text-red-400 bg-red-500/10',
    none: 'text-dark-400 bg-dark-800',
  };

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-white">User Management</h2>
          <p className="text-sm text-dark-400">View and manage all users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
          placeholder="Search users by name or email..."
        />
      </div>

      {/* Users table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left text-xs font-semibold text-dark-400 uppercase px-6 py-3">User</th>
                <th className="text-left text-xs font-semibold text-dark-400 uppercase px-6 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-dark-400 uppercase px-6 py-3">Subscription</th>
                <th className="text-left text-xs font-semibold text-dark-400 uppercase px-6 py-3">Joined</th>
                <th className="text-left text-xs font-semibold text-dark-400 uppercase px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-dark-500 py-12">
                    {users.length === 0
                      ? 'No users yet. Users will appear here when they sign up.'
                      : 'No users match your search.'}
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="border-b border-dark-800 hover:bg-dark-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center text-xs font-bold text-white">
                          {user.full_name[0] || 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{user.full_name}</div>
                          <div className="text-xs text-dark-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-dark-300 capitalize">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[user.subscription_status] || statusColors.none}`}>
                        {user.subscription_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-dark-400">
                      {new Date(user.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-dark-400 hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
