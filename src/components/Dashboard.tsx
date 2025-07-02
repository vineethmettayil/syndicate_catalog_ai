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
  FileSpreadsheet,
  Zap,
  Brain,
  Target,
  Layers,
  Settings,
  RefreshCw,
  Eye,
  BarChart3
} from 'lucide-react';
import { demoDataService } from '../services/demoDataService';
import { useAuth } from '../hooks/useFirebase';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    skusProcessed: 12847,
    successRate: 96.8,
    pendingReview: 89,
    failedUploads: 12,
    templatesAdapted: 156,
    attributesGenerated: 2341
  });

  const [refreshing, setRefreshing] = useState(false);

  const recentActivity = [
    { id: 1, action: 'Auto-adapted Namshi template v3.0 with 12 new attributes', time: '2 minutes ago', type: 'template', icon: Target },
    { id: 2, action: 'AI generated 247 missing product descriptions', time: '8 minutes ago', type: 'ai', icon: Brain },
    { id: 3, action: 'Bulk processed 1,156 SKUs for Amazon marketplace', time: '15 minutes ago', type: 'success', icon: CheckCircle },
    { id: 4, action: 'Template mapping detected 23 attribute conflicts', time: '32 minutes ago', type: 'warning', icon: AlertTriangle },
    { id: 5, action: 'Smart attribute inference completed for 89 products', time: '1 hour ago', type: 'ai', icon: Zap },
    { id: 6, action: 'New marketplace template uploaded: Trendyol v2.1', time: '2 hours ago', type: 'template', icon: Upload },
  ];

  const marketplaces = [
    { name: 'Namshi', processed: 3247, success: 97.8, adaptations: 45, color: 'bg-purple-500' },
    { name: 'Amazon', processed: 2891, success: 94.2, adaptations: 38, color: 'bg-orange-500' },
    { name: 'Centrepoint', processed: 2156, success: 96.1, adaptations: 29, color: 'bg-blue-500' },
    { name: 'Noon', processed: 1834, success: 95.3, adaptations: 22, color: 'bg-yellow-500' },
    { name: 'Trendyol', processed: 1456, success: 93.7, adaptations: 31, color: 'bg-red-500' },
    { name: '6th Street', processed: 1263, success: 94.9, adaptations: 18, color: 'bg-green-500' },
  ];

  const aiInsights = [
    {
      title: 'Template Adaptation Success',
      metric: '96.8%',
      description: 'Automatic template adaptations successful',
      trend: '+12.3%',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'AI Content Generation',
      metric: '2,341',
      description: 'Attributes auto-generated this week',
      trend: '+28.7%',
      icon: Brain,
      color: 'text-purple-600'
    },
    {
      title: 'Processing Speed',
      metric: '847/min',
      description: 'SKUs processed per minute',
      trend: '+15.2%',
      icon: Zap,
      color: 'text-green-600'
    },
    {
      title: 'Compliance Rate',
      metric: '98.2%',
      description: 'Products meeting marketplace standards',
      trend: '+5.1%',
      icon: CheckCircle,
      color: 'text-emerald-600'
    }
  ];

  const handleQuickUpload = () => {
    window.location.hash = '#upload';
    toast.success('Redirecting to Smart Upload interface...');
  };

  const handleTryDemo = () => {
    window.location.hash = '#upload';
    toast.success('Demo data ready! Experience intelligent template adaptation.');
  };

  const downloadSample = () => {
    demoDataService.downloadSampleCSV();
    toast.success('Enhanced sample CSV downloaded with all attributes!');
  };

  const handleRefreshStats = async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(prev => ({
        ...prev,
        skusProcessed: prev.skusProcessed + Math.floor(Math.random() * 100),
        successRate: Math.min(99.9, prev.successRate + (Math.random() * 2 - 1)),
        pendingReview: Math.max(0, prev.pendingReview + Math.floor(Math.random() * 20 - 10)),
        templatesAdapted: prev.templatesAdapted + Math.floor(Math.random() * 5),
        attributesGenerated: prev.attributesGenerated + Math.floor(Math.random() * 50)
      }));
      toast.success('Dashboard statistics refreshed!');
    } catch (error) {
      toast.error('Failed to refresh statistics');
    } finally {
      setRefreshing(false);
    }
  };

  const handleViewAnalytics = () => {
    window.location.hash = '#analytics';
    toast.success('Opening detailed analytics...');
  };

  const handleManageUsers = () => {
    window.location.hash = '#users';
    toast.success('Opening user management...');
  };

  const handleViewActivity = (activity) => {
    toast.info(`Viewing details for: ${activity.action}`);
  };

  const handleMarketplaceDetails = (marketplace) => {
    toast.info(`Opening ${marketplace.name} marketplace details`);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'template': return Target;
      case 'ai': return Brain;
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'template': return 'text-blue-600 bg-blue-50';
      case 'ai': return 'text-purple-600 bg-purple-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Syndicate AI Dashboard</h1>
          <p className="text-gray-600 mt-1">Intelligent marketplace catalog automation with adaptive templates</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleRefreshStats}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={downloadSample}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Enhanced Sample
          </button>
          <button 
            onClick={handleTryDemo}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Try AI Demo
          </button>
          <button 
            onClick={handleQuickUpload}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Upload className="w-4 h-4 mr-2" />
            Smart Upload
          </button>
        </div>
      </div>

      {/* AI Capabilities Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Syndicate AI Engine</h2>
                <p className="text-blue-100">Next-generation template adaptation & content generation</p>
              </div>
            </div>
            <button 
              onClick={handleViewAnalytics}
              className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-blue-200" />
              <h3 className="font-semibold">Auto Template Adaptation</h3>
              <p className="text-sm text-blue-100">Intelligent field mapping & transformation</p>
            </div>
            <div className="text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-200" />
              <h3 className="font-semibold">AI Content Generation</h3>
              <p className="text-sm text-purple-100">Smart attribute inference & creation</p>
            </div>
            <div className="text-center">
              <Layers className="w-8 h-8 mx-auto mb-2 text-teal-200" />
              <h3 className="font-semibold">Dynamic Processing</h3>
              <p className="text-sm text-teal-100">Real-time marketplace compliance</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-200" />
              <h3 className="font-semibold">Quality Assurance</h3>
              <p className="text-sm text-green-100">Automated validation & optimization</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                 onClick={() => toast.info(`Viewing ${insight.title} details`)}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 ${insight.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {insight.trend}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{insight.metric}</h3>
                <p className="text-sm font-medium text-gray-900 mb-1">{insight.title}</p>
                <p className="text-xs text-gray-600">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Marketplace Performance */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Marketplace Intelligence</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI Active</span>
              </div>
              <button 
                onClick={handleViewAnalytics}
                className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                <Eye className="w-4 h-4 mr-1" />
                View All
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {marketplaces.map((marketplace, index) => (
              <div key={index} 
                   className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-gray-100 cursor-pointer"
                   onClick={() => handleMarketplaceDetails(marketplace)}>
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${marketplace.color}`}></div>
                  <div>
                    <p className="font-semibold text-gray-900">{marketplace.name}</p>
                    <p className="text-sm text-gray-600">{marketplace.processed?.toLocaleString()} SKUs processed</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-bold text-gray-900">{marketplace.success}%</p>
                      <p className="text-xs text-gray-600">Success Rate</p>
                    </div>
                    <div>
                      <p className="font-bold text-blue-600">{marketplace.adaptations}</p>
                      <p className="text-xs text-gray-600">Adaptations</p>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">AI Activity Stream</h3>
            <button 
              onClick={handleRefreshStats}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} 
                     className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                     onClick={() => handleViewActivity(activity)}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-relaxed">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Intelligent Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={handleQuickUpload}
            className="group flex items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 text-left"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Smart Upload & AI Processing</p>
              <p className="text-sm text-gray-600">Auto-adapt templates with AI enhancement</p>
            </div>
          </button>
          
          <button 
            onClick={handleTryDemo}
            className="group flex items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-300 text-left"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Experience AI Demo</p>
              <p className="text-sm text-gray-600">See intelligent template adaptation in action</p>
            </div>
          </button>
          
          <button 
            onClick={downloadSample}
            className="group flex items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-left"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
              <FileSpreadsheet className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Enhanced Template</p>
              <p className="text-sm text-gray-600">Download comprehensive attribute template</p>
            </div>
          </button>
        </div>
      </div>

      {/* AI Technology Showcase */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Syndicate AI Technology Stack</h3>
          <button 
            onClick={handleManageUsers}
            className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            <Users className="w-4 h-4 mr-2" />
            Manage Users
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Template Intelligence', desc: 'Dynamic field mapping & adaptation', icon: Target },
            { title: 'Content Generation', desc: 'AI-powered attribute creation', icon: Brain },
            { title: 'Quality Assurance', desc: 'Automated compliance validation', icon: CheckCircle },
            { title: 'Performance Optimization', desc: 'Real-time processing enhancement', icon: Zap }
          ].map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div key={index} className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
                   onClick={() => toast.info(`Learning more about ${tech.title}`)}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">{tech.title}</h4>
                <p className="text-sm text-gray-300">{tech.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;