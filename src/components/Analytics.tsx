import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('success_rate');

  const performanceData = {
    success_rate: {
      current: 94.2,
      previous: 92.1,
      trend: 'up',
      data: [85, 87, 89, 91, 88, 92, 94, 96, 93, 95, 94, 94]
    },
    processing_speed: {
      current: 847,
      previous: 723,
      trend: 'up',
      data: [650, 680, 720, 750, 780, 810, 830, 850, 820, 840, 830, 847]
    },
    rejection_rate: {
      current: 5.8,
      previous: 7.9,
      trend: 'down',
      data: [12, 11, 10, 9, 11, 8, 6, 4, 7, 5, 6, 5.8]
    }
  };

  const marketplaceStats = [
    { 
      name: 'Namshi', 
      processed: 2847, 
      success: 96.2, 
      avgProcessing: '2.3m',
      commonIssues: ['Image size', 'Color variations'],
      trend: 'up'
    },
    { 
      name: 'Centrepoint', 
      processed: 2156, 
      success: 94.1, 
      avgProcessing: '3.1m',
      commonIssues: ['Category mapping', 'Size chart'],
      trend: 'up'
    },
    { 
      name: 'Amazon', 
      processed: 1834, 
      success: 89.3, 
      avgProcessing: '4.2m',
      commonIssues: ['Compliance rules', 'Title length'],
      trend: 'down'
    },
    { 
      name: 'Noon', 
      processed: 1672, 
      success: 92.8, 
      avgProcessing: '2.8m',
      commonIssues: ['Brand verification', 'Pricing'],
      trend: 'up'
    },
    { 
      name: 'Trendyol', 
      processed: 1298, 
      success: 88.7, 
      avgProcessing: '3.5m',
      commonIssues: ['Language fields', 'Currency'],
      trend: 'stable'
    },
    { 
      name: '6th Street', 
      processed: 1087, 
      success: 91.4, 
      avgProcessing: '2.9m',
      commonIssues: ['Image background', 'Material info'],
      trend: 'up'
    },
  ];

  const recentIssues = [
    {
      type: 'Template Change',
      marketplace: 'Amazon',
      description: 'New sustainability fields required',
      impact: 'High',
      affected: 245,
      timestamp: '2 hours ago'
    },
    {
      type: 'Image Compliance',
      marketplace: 'Namshi',
      description: 'Background requirements updated',
      impact: 'Medium',
      affected: 67,
      timestamp: '6 hours ago'
    },
    {
      type: 'Category Mapping',
      marketplace: 'Centrepoint',
      description: 'New subcategories added',
      impact: 'Low',
      affected: 23,
      timestamp: '1 day ago'
    },
  ];

  const aiInsights = [
    {
      title: 'Peak Processing Hours',
      insight: 'Best performance observed between 10 AM - 2 PM UTC',
      recommendation: 'Schedule bulk uploads during these hours for optimal results',
      impact: '+8% success rate'
    },
    {
      title: 'Category Performance',
      insight: 'Fashion items have 97% success rate vs 84% for electronics',
      recommendation: 'Review electronics-specific templates and rules',
      impact: 'Potential +13% improvement'
    },
    {
      title: 'Image Quality Trends',
      insight: 'Images with white backgrounds process 23% faster',
      recommendation: 'Implement automatic background cleanup for all products',
      impact: 'Reduce processing time by 1.2 minutes'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-orange-600 bg-orange-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Monitoring</h1>
          <p className="text-gray-600">Track performance and identify optimization opportunities</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(performanceData).map(([key, data]) => (
          <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {key.replace('_', ' ')}
              </h3>
              {getTrendIcon(data.trend)}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                {key === 'processing_speed' ? data.current : `${data.current}%`}
              </span>
              <span className={`text-sm font-medium ${
                data.trend === 'up' ? 'text-green-600' : 
                data.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {data.trend === 'up' ? '+' : data.trend === 'down' ? '-' : ''}
                {Math.abs(data.current - data.previous).toFixed(1)}
                {key === 'processing_speed' ? '' : '%'}
              </span>
            </div>
            
            {/* Simple chart visualization */}
            <div className="mt-4 h-12 flex items-end space-x-1">
              {data.data.map((value, index) => (
                <div
                  key={index}
                  className="bg-blue-200 rounded-t flex-1"
                  style={{ 
                    height: `${(value / Math.max(...data.data)) * 100}%`,
                    minHeight: '4px'
                  }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Marketplace Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Marketplace Performance</h3>
          <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Marketplace</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Processed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Success Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Processing</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Common Issues</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Trend</th>
              </tr>
            </thead>
            <tbody>
              {marketplaceStats.map((marketplace, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{marketplace.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">{marketplace.processed.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${marketplace.success}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{marketplace.success}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">{marketplace.avgProcessing}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {marketplace.commonIssues.slice(0, 2).map((issue, i) => (
                        <span key={i} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getTrendIcon(marketplace.trend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Issues */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Issues & Changes</h3>
          <div className="space-y-4">
            {recentIssues.map((issue, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-900">{issue.type}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(issue.impact)}`}>
                    {issue.impact}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{issue.marketplace} • {issue.affected} SKUs affected</span>
                  <span className="text-gray-500">{issue.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">AI-Powered Insights</h3>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{insight.insight}</p>
                    <p className="text-sm text-blue-700 mb-2">{insight.recommendation}</p>
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {insight.impact}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Processing Timeline (Last 24 Hours)</h3>
        <div className="relative">
          <div className="h-64 flex items-end space-x-2">
            {Array.from({ length: 24 }, (_, i) => {
              const height = Math.random() * 80 + 20;
              const isCurrentHour = i === new Date().getHours();
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t transition-all ${
                      isCurrentHour ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {String(i).padStart(2, '0')}:00
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>Peak: 147 SKUs/hour at 14:00</span>
          <span>Total: 2,847 SKUs processed</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;