import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Edit, 
  Trash2, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Mail,
  Phone,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Key,
  AlertTriangle,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const users = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-15 14:30',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face',
      permissions: ['full_access'],
      department: 'Operations',
      joinDate: '2023-06-15',
      loginCount: 342
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      role: 'Catalog Ops',
      status: 'active',
      lastLogin: '2024-01-15 13:45',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face',
      permissions: ['upload', 'review', 'approve'],
      department: 'Merchandising',
      joinDate: '2023-08-22',
      loginCount: 156
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      role: 'Image Team',
      status: 'active',
      lastLogin: '2024-01-15 12:20',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face',
      permissions: ['image_enhancement', 'image_review'],
      department: 'Creative',
      joinDate: '2023-09-10',
      loginCount: 89
    },
    {
      id: 4,
      name: 'David Park',
      email: 'david.park@company.com',
      role: 'Catalog Ops',
      status: 'inactive',
      lastLogin: '2024-01-10 16:15',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop&crop=face',
      permissions: ['upload', 'review'],
      department: 'Merchandising',
      joinDate: '2023-11-05',
      loginCount: 23
    },
  ];

  const roles = [
    {
      name: 'Admin',
      description: 'Full system access and user management',
      permissions: ['full_access'],
      userCount: 1,
      color: 'bg-red-100 text-red-800'
    },
    {
      name: 'Catalog Ops',
      description: 'Upload, review, and approve catalog data',
      permissions: ['upload', 'review', 'approve', 'export'],
      userCount: 2,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Image Team',
      description: 'Image enhancement and compliance tasks',
      permissions: ['image_enhancement', 'image_review', 'image_approve'],
      userCount: 1,
      color: 'bg-green-100 text-green-800'
    },
  ];

  const activityLog = [
    {
      id: 1,
      user: 'Sarah Johnson',
      action: 'Created new user account for John Smith',
      timestamp: '2024-01-15 14:30',
      type: 'user_management',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      user: 'Michael Chen',
      action: 'Exported 1,247 SKUs to Namshi',
      timestamp: '2024-01-15 13:45',
      type: 'export',
      ip: '192.168.1.101'
    },
    {
      id: 3,
      user: 'Emily Rodriguez',
      action: 'Enhanced 156 product images',
      timestamp: '2024-01-15 12:20',
      type: 'image_processing',
      ip: '192.168.1.102'
    },
    {
      id: 4,
      user: 'Michael Chen',
      action: 'Approved bulk mapping for Centrepoint',
      timestamp: '2024-01-15 11:15',
      type: 'approval',
      ip: '192.168.1.101'
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getStatusIcon = (status) => {
    return status === 'active' ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getActionTypeColor = (type) => {
    switch (type) {
      case 'user_management': return 'bg-purple-100 text-purple-800';
      case 'export': return 'bg-blue-100 text-blue-800';
      case 'image_processing': return 'bg-green-100 text-green-800';
      case 'approval': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleEditUser = (user) => {
    toast.info(`Editing user: ${user.name}`);
  };

  const handleDeleteUser = (userId) => {
    toast.success('User deleted successfully');
  };

  const handleViewUser = (user) => {
    toast.info(`Viewing profile for: ${user.name}`);
  };

  const handleResetPassword = (user) => {
    toast.success(`Password reset email sent to ${user.email}`);
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    switch (action) {
      case 'activate':
        toast.success(`Activated ${selectedUsers.length} users`);
        break;
      case 'deactivate':
        toast.success(`Deactivated ${selectedUsers.length} users`);
        break;
      case 'delete':
        toast.success(`Deleted ${selectedUsers.length} users`);
        break;
      case 'export':
        toast.success(`Exported ${selectedUsers.length} user records`);
        break;
    }
    setSelectedUsers([]);
  };

  const handleExportUsers = () => {
    const userData = filteredUsers.map(user => ({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      lastLogin: user.lastLogin,
      joinDate: user.joinDate
    }));

    const csvContent = [
      ['Name', 'Email', 'Role', 'Department', 'Status', 'Last Login', 'Join Date'].join(','),
      ...userData.map(user => Object.values(user).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('User data exported successfully');
  };

  const handleRefreshData = () => {
    toast.success('User data refreshed');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleRefreshData}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button 
            onClick={handleExportUsers}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => toast.info('Opening role settings')}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Role Settings
          </button>
          <button 
            onClick={() => setShowAddUser(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'roles', label: 'Roles & Permissions', icon: Shield },
            { id: 'activity', label: 'Activity Log', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-600">Active Users</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
                  <p className="text-sm text-gray-600">User Roles</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => {
                      const lastLogin = new Date(u.lastLogin);
                      const today = new Date();
                      return (today - lastLogin) / (1000 * 60 * 60 * 24) <= 1;
                    }).length}
                  </p>
                  <p className="text-sm text-gray-600">Active Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select 
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Catalog Ops">Catalog Ops</option>
                    <option value="Image Team">Image Team</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {selectedUsers.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-600">{selectedUsers.length} selected</span>
                    <button 
                      onClick={() => handleBulkAction('activate')}
                      className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                    >
                      Activate
                    </button>
                    <button 
                      onClick={() => handleBulkAction('deactivate')}
                      className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200"
                    >
                      Deactivate
                    </button>
                    <button 
                      onClick={() => handleBulkAction('delete')}
                      className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
                <span className="text-sm text-gray-600">
                  {filteredUsers.length} users found
                </span>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Accounts</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300" 
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserSelect(user.id)}
                          className="rounded border-gray-300" 
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'Catalog Ops' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1 capitalize">{user.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View user"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleResetPassword(user)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Reset password"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(user)}
                            className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                            title={user.status === 'active' ? 'Deactivate user' : 'Activate user'}
                          >
                            {user.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${role.color}`}>
                    {role.userCount} users
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Permissions:</h4>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permission, i) => (
                      <span key={i} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {permission.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => toast.info(`Editing ${role.name} role`)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit Role
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Log Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button 
              onClick={() => toast.info('Exporting activity log')}
              className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <Download className="w-4 h-4 mr-1" />
              Export Log
            </button>
          </div>
          <div className="space-y-4">
            {activityLog.map((activity) => (
              <div key={activity.id} 
                   className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                   onClick={() => toast.info(`Activity details: ${activity.action}`)}>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionTypeColor(activity.type)}`}>
                        {activity.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">{activity.ip}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New User</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Select role</option>
                  <option>Admin</option>
                  <option>Catalog Ops</option>
                  <option>Image Team</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Select department</option>
                  <option>Operations</option>
                  <option>Merchandising</option>
                  <option>Creative</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddUser(false);
                    toast.success('User added successfully');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;