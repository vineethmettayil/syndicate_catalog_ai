import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  Brain, 
  Globe,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Settings
} from 'lucide-react';
import { useDashboardAnalytics, usePerformanceMetrics } from '../../hooks/useApi';
import toast from 'react-hot-toast';

const AdvancedAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'realtime'>('overview');

  const { data: analytics, isLoading } = useDashboardAnalytics(timeRange);
  const { data: performance } = usePerformanceMetrics({ 
    marketplace: selectedMarketplace === 'all' ? undefined : selectedMarketplace,
    timeRange 
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const processingTrendData = [
    { date: '2024-01-01', processed: 120, successful: 115, failed: 5 },
    { date: '2024-01-02', processed: 145, successful: 138, failed: 7 },
    { date: '2024-01-03', processed: 167, successful: 159, failed: 8 },
    { date: '2024-01-04', processed: 189, successful: 182, failed: 7 },
    { date: '2024-01-05', processed: 203, successful: 195, failed: 8 },
    { date: '2024-01-06', processed: 178, successful: 171, failed: 7 },
    { date: '2024-01-07', processed: 156, successful: 149, failed: 7 },
  ];

  const marketplaceData = [
    { name: 'Namshi', value: 3247, color: '#8B5CF6' },
    { name: 'Amazon', value: 2891, color: '#F59E0B' },
    { name: 'Centrepoint', value: 2156, color: '#3B82F6' },
    { name: 'Noon', value: 1834, color: '#10B981' },
    { name: 'Trendyol', value: 1456, color: '#EF4444' },
    { name: '6th Street', value: 1263, color: '#06B6D4' },
  ];

  const accuracyTrendData = [
    { time: '00:00', accuracy: 94.2, confidence: 87.5 },
    { time: '04:00', accuracy: 95.1, confidence: 89.2 },
    { time: '08:00', accuracy: 96.8, confidence: 91.7 },
    { time: '12:00', accuracy: 97.2, confidence: 93.1 },
    { time: '16:00', accuracy: 96.5, confidence: 90.8 },
    { time: '20:00', accuracy: 95.3, confidence: 88.9 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Real-time insights and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="overview">Overview</option>
            <option value="detailed">Detailed</option>
            <option value="realtime">Real-time</option>
          </select>
          
          <select
            value={selectedMarketplace}
            onChange={(e) => setSelectedMarketplace(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Marketplaces</option>
            <option value="namshi">Namshi</option>
            <option value="amazon">Amazon</option>
            <option value="centrepoint">Centrepoint</option>
          </select>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <button
            onClick={() => toast.success('Analytics refreshed')}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Processing Speed',
            value: '847',
            unit: 'SKUs/min',
            change: '+15.2%',
            trend: 'up',
            icon: Zap,
            color: 'text-blue-600'
          },
          {
            title: 'AI Accuracy',
            value: '96.8',
            unit: '%',
            change: '+2.3%',
            trend: 'up',
            icon: Brain,
            color: 'text-purple-600'
          },
          {
            title: 'Success Rate',
            value: '94.2',
            unit: '%',
            change: '+1.8%',
            trend: 'up',
            icon: Target,
            color: 'text-green-600'
          },
          {
            title: 'Active Markets',
            value: '6',
            unit: 'platforms',
            change: '+1',
            trend: 'up',
            icon: Globe,
            color: 'text-orange-600'
          }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 ${metric.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {metric.change}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value}
                  <span className="text-sm font-normal text-gray-600 ml-1">{metric.unit}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processing Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Processing Trends</h3>
            <button
              onClick={() => toast.info('Exporting trend data')}
              className="text-gray-400 hover:text-gray-600"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={processingTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="successful" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="failed" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Marketplace Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Marketplace Distribution</h3>
            <button
              onClick={() => toast.info('Viewing marketplace details')}
              className="text-gray-400 hover:text-gray-600"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marketplaceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {marketplaceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Accuracy Over Time */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">AI Accuracy & Confidence</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Accuracy
              </div>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                Confidence
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={accuracyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="confidence" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Heatmap */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Heatmap</h3>
            <button
              onClick={() => toast.info('Opening detailed heatmap')}
              className="text-gray-400 hover:text-gray-600"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 168 }, (_, i) => {
              const intensity = Math.random();
              return (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm cursor-pointer ${
                    intensity > 0.8 ? 'bg-green-500' :
                    intensity > 0.6 ? 'bg-green-400' :
                    intensity > 0.4 ? 'bg-green-300' :
                    intensity > 0.2 ? 'bg-green-200' :
                    'bg-gray-100'
                  }`}
                  title={`Hour ${i % 24}, Day ${Math.floor(i / 24) + 1}: ${(intensity * 100).toFixed(0)}% activity`}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
            <span>Less</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      {viewMode === 'realtime' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Processing</h3>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm">Live</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {(2.3 + Math.random() * 0.5).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Items/sec</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {(96.8 + Math.random() * 2 - 1).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Current Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.floor(45 + Math.random() * 20)}
              </div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Peak Performance Window</h4>
            <p className="text-sm text-gray-600 mb-2">
              Best processing results observed between 10 AM - 2 PM UTC
            </p>
            <div className="text-xs text-blue-600 font-medium">+8% success rate improvement</div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Category Optimization</h4>
            <p className="text-sm text-gray-600 mb-2">
              Fashion items show 97% success rate vs 84% for electronics
            </p>
            <div className="text-xs text-green-600 font-medium">Potential +13% improvement</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;