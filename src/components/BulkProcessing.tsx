import React, { useState } from 'react';
import { 
  Layers, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Filter,
  Search,
  Eye,
  Edit,
  Download
} from 'lucide-react';

const BulkProcessing = () => {
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  const bulkItems = [
    {
      id: 'SKU001',
      title: 'Premium Cotton T-Shirt',
      brand: 'FashionCo',
      status: 'completed',
      confidence: 96,
      aiSuggestions: 3,
      issues: 0,
      lastUpdated: '2024-01-15 14:30'
    },
    {
      id: 'SKU002',
      title: 'Denim Jacket - Blue',
      brand: 'UrbanStyle',
      status: 'review',
      confidence: 78,
      aiSuggestions: 7,
      issues: 2,
      lastUpdated: '2024-01-15 14:25'
    },
    {
      id: 'SKU003',
      title: 'Leather Boots',
      brand: 'ComfortWalk',
      status: 'processing',
      confidence: 0,
      aiSuggestions: 0,
      issues: 0,
      lastUpdated: '2024-01-15 14:45'
    },
    {
      id: 'SKU004',
      title: 'Summer Dress - Floral',
      brand: 'BreezyWear',
      status: 'failed',
      confidence: 45,
      aiSuggestions: 12,
      issues: 5,
      lastUpdated: '2024-01-15 14:20'
    },
    {
      id: 'SKU005',
      title: 'Sports Sneakers',
      brand: 'ActiveGear',
      status: 'completed',
      confidence: 94,
      aiSuggestions: 2,
      issues: 0,
      lastUpdated: '2024-01-15 14:35'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'review': return 'text-orange-600 bg-orange-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'review': return <AlertTriangle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredItems = bulkItems.filter(item => 
    filterStatus === 'all' || item.status === filterStatus
  );

  const processingStats = {
    total: bulkItems.length,
    completed: bulkItems.filter(item => item.status === 'completed').length,
    review: bulkItems.filter(item => item.status === 'review').length,
    processing: bulkItems.filter(item => item.status === 'processing').length,
    failed: bulkItems.filter(item => item.status === 'failed').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Processing</h1>
          <p className="text-gray-600">Process and review SKUs in batches</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </button>
          <button 
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              processingStatus === 'running' 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {processingStatus === 'running' ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Processing
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Processing
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total SKUs', value: processingStats.total, color: 'bg-gray-100' },
          { label: 'Completed', value: processingStats.completed, color: 'bg-green-100 text-green-700' },
          { label: 'Need Review', value: processingStats.review, color: 'bg-orange-100 text-orange-700' },
          { label: 'Processing', value: processingStats.processing, color: 'bg-blue-100 text-blue-700' },
          { label: 'Failed', value: processingStats.failed, color: 'bg-red-100 text-red-700' },
        ].map((stat, index) => (
          <div key={index} className={`p-4 rounded-lg ${stat.color}`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Processing Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Processing Progress</h3>
          <span className="text-sm text-gray-600">
            {processingStats.completed + processingStats.failed} of {processingStats.total} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${((processingStats.completed + processingStats.failed) / processingStats.total) * 100}%` 
            }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Started: 14:20 PM</span>
          <span>ETA: ~15 minutes</span>
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
                placeholder="Search SKUs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="review">Need Review</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredItems.length} of {bulkItems.length} items
          </div>
        </div>
      </div>

      {/* SKU List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI Suggestions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{item.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">{item.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{item.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {item.aiSuggestions}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.issues > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                        {item.issues}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <CheckCircle className="w-4 h-4 mr-2" />
            Accept All AI Suggestions
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Layers className="w-4 h-4 mr-2" />
            Apply Template Mapping
          </button>
          <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Mark for Review
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkProcessing;