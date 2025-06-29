import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Upload, 
  Download,
  Clock,
  Users,
  Play,
  FileSpreadsheet
} from 'lucide-react';
import { demoDataService } from '../services/demoDataService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    skusProcessed: 2847,
    successRate: 94.2,
    pendingReview: 127,
    failedUploads: 23
  });

  const recentActivity = [
    { id: 1, action: 'Namshi template updated', time: '2 minutes ago', type: 'info' },
    { id: 2, action: '156 SKUs exported to Centrepoint', time: '15 minutes ago', type: 'success' },
    { id: 3, action: 'Image compliance check failed for 12 SKUs', time: '1 hour ago', type: 'warning' },
    { id: 4, action: 'New batch uploaded by Demo User', time: '2 hours ago', type: 'info' },
    { id: 5, action: 'AI processing completed for 89 products', time: '3 hours ago', type: 'success' },
  ];

  const marketplaces = [
    { name: 'Namshi', processed: 842, success: 96.2, color: 'bg-purple-500' },
    { name: 'Centrepoint', processed: 623, success: 94.1, color: 'bg-blue-500' },
    { name: 'Amazon', processed: 445, success: 89.3, color: 'bg-orange-500' },
    { name: 'Noon', processed: 387, success: 92.8, color: 'bg-yellow-500' },
    { name: 'Trendyol', processed: 298, success: 88.7, color: 'bg-red-500' },
    { name: '6th Street', processed: 252, success: 91.4, color: 'bg-green-500' },
  ];

  const handleQuickUpload = () => {
    // Navigate to upload interface
    window.location.hash = '#upload';
    toast.success('Redirecting to upload interface...');
  };

  const handleTryDemo = () => {
    // Load demo data and navigate to processing
    window.location.hash = '#upload';
    toast.success('Demo data ready! Navigate to Upload & AI Processing tab.');
  };

  const downloadSample = () => {
    demoDataService.downloadSampleCSV();
    toast.success('Sample CSV downloaded!');
  };

  const statsData = [
    {
      title: 'SKUs Processed',
      value: stats.skusProcessed.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      change: '+2.1%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Pending Review',
      value: stats.pendingReview.toString(),
      change: '-8.3%',
      changeType: 'negative',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Failed Uploads',
      value: stats.failedUploads.toString(),
      change: '+5.2%',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'red'
    }
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
          <button 
            onClick={downloadSample}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Sample CSV
          </button>
          <button 
            onClick={handleTryDemo}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Try Demo
          </button>
          <button 
            onClick={handleQuickUpload}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Quick Upload
          </button>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">Welcome to CatalogAI Demo</h3>
            <p className="text-gray-600 mt-1">
              Experience the full power of AI-driven catalog automation. Upload your own files or try our demo data to see how we transform product catalogs for multiple marketplaces.
            </p>
            <div className="mt-4 flex space-x-3">
              <button 
                onClick={handleTryDemo}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Try Demo Data
              </button>
              <button 
                onClick={downloadSample}
                className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Download Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
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
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
          <button 
            onClick={handleQuickUpload}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Upload className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <p className="font-medium text-gray-900">Upload New Catalog</p>
              <p className="text-sm text-gray-600">Import Excel or CSV files</p>
            </div>
          </button>
          <button 
            onClick={handleTryDemo}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <TrendingUp className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <p className="font-medium text-gray-900">Try AI Processing</p>
              <p className="text-sm text-gray-600">Test with sample data</p>
            </div>
          </button>
          <button 
            onClick={downloadSample}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Users className="w-8 h-8 text-purple-600 mr-4" />
            <div>
              <p className="font-medium text-gray-900">Get Template</p>
              <p className="text-sm text-gray-600">Download CSV template</p>
            </div>
          </button>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'AI Field Mapping', desc: 'Intelligent field recognition and mapping' },
            { title: 'Content Generation', desc: 'AI-powered descriptions and titles' },
            { title: 'Compliance Check', desc: 'Marketplace rule validation' },
            { title: 'Bulk Processing', desc: 'Process thousands of SKUs efficiently' }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm mx-auto mb-3 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;