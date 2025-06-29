import React from 'react';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Upload, 
  Download,
  Clock,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'SKUs Processed',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Pending Review',
      value: '127',
      change: '-8.3%',
      changeType: 'negative',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Failed Uploads',
      value: '23',
      change: '+5.2%',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Namshi template updated', time: '2 minutes ago', type: 'info' },
    { id: 2, action: '156 SKUs exported to Centrepoint', time: '15 minutes ago', type: 'success' },
    { id: 3, action: 'Image compliance check failed for 12 SKUs', time: '1 hour ago', type: 'warning' },
    { id: 4, action: 'New batch uploaded by John Doe', time: '2 hours ago', type: 'info' },
  ];

  const marketplaces = [
    { name: 'Namshi', processed: 842, success: 96.2, color: 'bg-purple-500' },
    { name: 'Centrepoint', processed: 623, success: 94.1, color: 'bg-blue-500' },
    { name: 'Amazon', processed: 445, success: 89.3, color: 'bg-orange-500' },
    { name: 'Noon', processed: 387, success: 92.8, color: 'bg-yellow-500' },
    { name: 'Trendyol', processed: 298, success: 88.7, color: 'bg-red-500' },
    { name: '6th Street', processed: 252, success: 91.4, color: 'bg-green-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Monitor your catalog automation performance</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Quick Upload
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  stat.color === 'green' ? 'bg-green-50 text-green-600' :
                  stat.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Marketplace Performance */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Marketplace Performance</h3>
          <div className="space-y-4">
            {marketplaces.map((marketplace, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${marketplace.color}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{marketplace.name}</p>
                    <p className="text-sm text-gray-600">{marketplace.processed} SKUs processed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{marketplace.success}%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-orange-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Upload className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <p className="font-medium text-gray-900">Upload New Catalog</p>
              <p className="text-sm text-gray-600">Import Excel or Google Sheets</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <TrendingUp className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <p className="font-medium text-gray-900">Run AI Mapping</p>
              <p className="text-sm text-gray-600">Auto-map to marketplace templates</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users className="w-8 h-8 text-purple-600 mr-4" />
            <div>
              <p className="font-medium text-gray-900">Review Pending</p>
              <p className="text-sm text-gray-600">127 SKUs need attention</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;