import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  Filter,
  Eye,
  RefreshCw
} from 'lucide-react';

const ExportCenter = () => {
  const [selectedMarketplaces, setSelectedMarketplaces] = useState(['namshi']);
  const [exportFormat, setExportFormat] = useState('xlsx');
  const [dateRange, setDateRange] = useState('today');

  const marketplaces = [
    { id: 'namshi', name: 'Namshi', color: 'bg-purple-500', count: 847 },
    { id: 'centrepoint', name: 'Centrepoint', color: 'bg-blue-500', count: 623 },
    { id: 'amazon', name: 'Amazon', color: 'bg-orange-500', count: 445 },
    { id: 'noon', name: 'Noon', color: 'bg-yellow-500', count: 387 },
    { id: 'trendyol', name: 'Trendyol', color: 'bg-red-500', count: 298 },
    { id: 'sixthstreet', name: '6th Street', color: 'bg-green-500', count: 252 },
  ];

  const exportHistory = [
    {
      id: 1,
      name: 'Namshi_Fashion_Export_Jan15',
      marketplace: 'Namshi',
      skus: 1247,
      status: 'completed',
      createdAt: '2024-01-15 14:30',
      downloadUrl: '#',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Centrepoint_Accessories_Jan15',
      marketplace: 'Centrepoint',
      skus: 856,
      status: 'processing',
      createdAt: '2024-01-15 15:20',
      downloadUrl: null,
      size: null
    },
    {
      id: 3,
      name: 'Amazon_Electronics_Jan14',
      marketplace: 'Amazon',
      skus: 543,
      status: 'failed',
      createdAt: '2024-01-14 16:45',
      downloadUrl: null,
      size: null
    },
    {
      id: 4,
      name: 'Noon_Home_Jan14',
      marketplace: 'Noon',
      skus: 324,
      status: 'completed',
      createdAt: '2024-01-14 11:20',
      downloadUrl: '#',
      size: '1.8 MB'
    },
  ];

  const exportTemplates = [
    {
      id: 'standard',
      name: 'Standard Export',
      description: 'All product fields with basic formatting',
      fields: 32
    },
    {
      id: 'minimal',
      name: 'Minimal Export',
      description: 'Essential fields only for quick uploads',
      fields: 12
    },
    {
      id: 'custom',
      name: 'Custom Template',
      description: 'User-defined field selection',
      fields: 'Variable'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleMarketplaceToggle = (marketplaceId) => {
    setSelectedMarketplaces(prev => 
      prev.includes(marketplaceId)
        ? prev.filter(id => id !== marketplaceId)
        : [...prev, marketplaceId]
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Export Center</h1>
          <p className="text-gray-600">Generate marketplace-ready exports</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4 mr-2" />
            Preview Export
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Generate Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Marketplace Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Marketplaces</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplaces.map((marketplace) => (
                <label
                  key={marketplace.id}
                  className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedMarketplaces.includes(marketplace.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${marketplace.color} rounded`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{marketplace.name}</p>
                      <p className="text-sm text-gray-600">{marketplace.count} SKUs</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedMarketplaces.includes(marketplace.id)}
                    onChange={() => handleMarketplaceToggle(marketplace.id)}
                    className="rounded border-gray-300 text-blue-600"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Export Templates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Template</h3>
            <div className="space-y-3">
              {exportTemplates.map((template) => (
                <label
                  key={template.id}
                  className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="exportTemplate"
                    value={template.id}
                    defaultChecked={template.id === 'standard'}
                    className="mt-1 text-blue-600"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900">{template.name}</p>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <p className="text-sm text-blue-600 mt-1">{template.fields} fields</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="xlsx">Excel (.xlsx)</option>
                  <option value="csv">CSV (.csv)</option>
                  <option value="json">JSON (.json)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                <span className="ml-2 text-sm text-gray-700">Include AI-generated descriptions</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                <span className="ml-2 text-sm text-gray-700">Include enhanced images</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                <span className="ml-2 text-gray-700">Export only compliant SKUs</span>
              </label>
            </div>
          </div>
        </div>

        {/* Export Summary & History */}
        <div className="space-y-6">
          {/* Export Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Selected Marketplaces</span>
                <span className="font-semibold text-gray-900">{selectedMarketplaces.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total SKUs</span>
                <span className="font-semibold text-gray-900">
                  {marketplaces
                    .filter(m => selectedMarketplaces.includes(m.id))
                    .reduce((sum, m) => sum + m.count, 0)
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimated Size</span>
                <span className="font-semibold text-gray-900">~4.2 MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Processing Time</span>
                <span className="font-semibold text-gray-900">~2-3 min</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Package className="w-5 h-5 mr-2" />
                Generate Export
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg text-left">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Template
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg text-left">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Export
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg text-left">
                <Filter className="w-4 h-4 mr-2" />
                Custom Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Export History</h3>
          <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Export Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Marketplace</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">SKUs</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exportHistory.map((export_) => (
                <tr key={export_.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{export_.name}</p>
                    {export_.size && <p className="text-sm text-gray-500">{export_.size}</p>}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">{export_.marketplace}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">{export_.skus.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(export_.status)}`}>
                      {getStatusIcon(export_.status)}
                      <span className="ml-1 capitalize">{export_.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{export_.createdAt}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {export_.downloadUrl && (
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
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
  );
};

export default ExportCenter;