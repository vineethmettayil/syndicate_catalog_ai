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
  RefreshCw,
  Settings,
  Play,
  Pause,
  Globe,
  Zap,
  X,
  Edit,
  Trash2,
  Copy,
  Share,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

const ExportCenter = () => {
  const [selectedMarketplaces, setSelectedMarketplaces] = useState(['namshi']);
  const [exportFormat, setExportFormat] = useState('xlsx');
  const [dateRange, setDateRange] = useState('today');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedExport, setSelectedExport] = useState(null);

  const marketplaces = [
    { id: 'namshi', name: 'Namshi', color: 'bg-purple-500', count: 847, ready: 823 },
    { id: 'centrepoint', name: 'Centrepoint', color: 'bg-blue-500', count: 623, ready: 598 },
    { id: 'amazon', name: 'Amazon', color: 'bg-orange-500', count: 445, ready: 421 },
    { id: 'noon', name: 'Noon', color: 'bg-yellow-500', count: 387, ready: 372 },
    { id: 'trendyol', name: 'Trendyol', color: 'bg-red-500', count: 298, ready: 285 },
    { id: 'sixthstreet', name: '6th Street', color: 'bg-green-500', count: 252, ready: 241 },
  ];

  const [exportHistory, setExportHistory] = useState([
    {
      id: 1,
      name: 'Namshi_Fashion_Export_Jan15',
      marketplace: 'Namshi',
      skus: 1247,
      status: 'completed',
      createdAt: '2024-01-15 14:30',
      downloadUrl: '#',
      size: '2.4 MB',
      format: 'xlsx'
    },
    {
      id: 2,
      name: 'Centrepoint_Accessories_Jan15',
      marketplace: 'Centrepoint',
      skus: 856,
      status: 'processing',
      createdAt: '2024-01-15 15:20',
      downloadUrl: null,
      size: null,
      format: 'csv'
    },
    {
      id: 3,
      name: 'Amazon_Electronics_Jan14',
      marketplace: 'Amazon',
      skus: 543,
      status: 'failed',
      createdAt: '2024-01-14 16:45',
      downloadUrl: null,
      size: null,
      format: 'xlsx'
    },
    {
      id: 4,
      name: 'Noon_Home_Jan14',
      marketplace: 'Noon',
      skus: 324,
      status: 'completed',
      createdAt: '2024-01-14 11:20',
      downloadUrl: '#',
      size: '1.8 MB',
      format: 'json'
    },
  ]);

  const exportTemplates = [
    {
      id: 'standard',
      name: 'Standard Export',
      description: 'All product fields with basic formatting',
      fields: 32,
      recommended: true
    },
    {
      id: 'minimal',
      name: 'Minimal Export',
      description: 'Essential fields only for quick uploads',
      fields: 12,
      recommended: false
    },
    {
      id: 'enhanced',
      name: 'AI Enhanced Export',
      description: 'Includes AI-generated content and optimizations',
      fields: 45,
      recommended: true
    },
    {
      id: 'custom',
      name: 'Custom Template',
      description: 'User-defined field selection',
      fields: 'Variable',
      recommended: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4 animate-spin" />;
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

  const handleGenerateExport = async () => {
    if (selectedMarketplaces.length === 0) {
      toast.error('Please select at least one marketplace');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportProgress(i);
      }

      // Create new export entry
      const newExport = {
        id: Date.now(),
        name: `Multi_Marketplace_Export_${new Date().toISOString().split('T')[0]}`,
        marketplace: selectedMarketplaces.length > 1 ? 'Multiple' : marketplaces.find(m => m.id === selectedMarketplaces[0])?.name,
        skus: selectedMarketplaces.reduce((sum, id) => {
          const marketplace = marketplaces.find(m => m.id === id);
          return sum + (marketplace?.ready || 0);
        }, 0),
        status: 'completed',
        createdAt: new Date().toLocaleString(),
        downloadUrl: '#',
        size: '3.2 MB',
        format: exportFormat
      };

      setExportHistory(prev => [newExport, ...prev]);
      toast.success('Export generated successfully!');
      
      // Trigger download
      handleDownloadExport(newExport);
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleDownloadExport = (exportItem) => {
    // Create sample CSV content
    const csvContent = [
      ['SKU', 'Title', 'Brand', 'Category', 'Price', 'Status', 'Marketplace'].join(','),
      ['SKU001', '"Premium Cotton T-Shirt"', 'FashionCo', 'Clothing', '29.99', 'Active', exportItem.marketplace].join(','),
      ['SKU002', '"Denim Jacket"', 'UrbanStyle', 'Outerwear', '79.99', 'Active', exportItem.marketplace].join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportItem.name}.${exportItem.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Export downloaded successfully!');
  };

  const handlePreviewExport = () => {
    if (selectedMarketplaces.length === 0) {
      toast.error('Please select marketplaces to preview');
      return;
    }
    setShowPreview(true);
  };

  const handleScheduleExport = () => {
    setShowScheduler(true);
  };

  const handleCustomFilters = () => {
    toast.info('Opening custom filter options...');
  };

  const handleRefreshHistory = () => {
    toast.success('Export history refreshed');
  };

  const handleRetryExport = (exportId) => {
    setExportHistory(prev => prev.map(exp => 
      exp.id === exportId ? { ...exp, status: 'processing' } : exp
    ));
    
    setTimeout(() => {
      setExportHistory(prev => prev.map(exp => 
        exp.id === exportId ? { ...exp, status: 'completed', downloadUrl: '#' } : exp
      ));
      toast.success('Export retry completed!');
    }, 3000);
  };

  const handleEditExport = (exportItem) => {
    setSelectedExport(exportItem);
    toast.info(`Editing export: ${exportItem.name}`);
  };

  const handleDeleteExport = (exportId) => {
    setExportHistory(prev => prev.filter(exp => exp.id !== exportId));
    toast.success('Export deleted successfully');
  };

  const handleDuplicateExport = (exportItem) => {
    const duplicated = {
      ...exportItem,
      id: Date.now(),
      name: `${exportItem.name}_copy`,
      status: 'completed',
      createdAt: new Date().toLocaleString()
    };
    setExportHistory(prev => [duplicated, ...prev]);
    toast.success('Export duplicated successfully');
  };

  const handleShareExport = (exportItem) => {
    navigator.clipboard.writeText(`Export: ${exportItem.name} - ${exportItem.skus} SKUs`);
    toast.success('Export details copied to clipboard');
  };

  const handleViewAnalytics = () => {
    toast.info('Opening export analytics dashboard');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Export Center</h1>
          <p className="text-gray-600">Generate marketplace-ready exports with AI optimization</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleViewAnalytics}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </button>
          <button 
            onClick={handlePreviewExport}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Export
          </button>
          <button 
            onClick={handleGenerateExport}
            disabled={isExporting}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate Export
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Export Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Export Engine</h3>
              <p className="text-gray-600">Intelligent export generation with marketplace-specific optimization</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">AI Active</span>
            </div>
            <button 
              onClick={handleScheduleExport}
              className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Export Progress */}
      {isExporting && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Generating Export</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {exportProgress}% completed
              </span>
              <button 
                onClick={() => {
                  setIsExporting(false);
                  setExportProgress(0);
                  toast.info('Export cancelled');
                }}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            Processing {selectedMarketplaces.length} marketplace{selectedMarketplaces.length !== 1 ? 's' : ''}...
          </p>
        </div>
      )}

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
                      ? 'border-blue-500 bg-blue-50 transform scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toast.info(`${marketplace.name}: ${marketplace.ready} products ready`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${marketplace.color} rounded`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{marketplace.name}</p>
                      <p className="text-sm text-gray-600">{marketplace.ready} ready</p>
                      <p className="text-xs text-gray-500">{marketplace.count} total</p>
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
                  className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toast.info(`Selected ${template.name} template`)}
                >
                  <input
                    type="radio"
                    name="exportTemplate"
                    value={template.id}
                    defaultChecked={template.id === 'enhanced'}
                    className="mt-1 text-blue-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{template.name}</p>
                      {template.recommended && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                          Recommended
                        </span>
                      )}
                    </div>
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
                  <option value="xml">XML (.xml)</option>
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
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                <span className="ml-2 text-gray-700">Export only compliant SKUs</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                <span className="ml-2 text-gray-700">Include processing metadata</span>
              </label>
            </div>
          </div>
        </div>

        {/* Export Summary & Quick Actions */}
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
                    .reduce((sum, m) => sum + m.ready, 0)
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
              <button 
                onClick={handleGenerateExport}
                disabled={isExporting || selectedMarketplaces.length === 0}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Package className="w-5 h-5 mr-2" />
                Generate Export
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  const blob = new Blob(['SKU,Title,Brand\nSKU001,"Sample Product","Sample Brand"'], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'template.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success('Template downloaded!');
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg text-left"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Template
              </button>
              <button 
                onClick={handleScheduleExport}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg text-left"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Export
              </button>
              <button 
                onClick={handleCustomFilters}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg text-left"
              >
                <Filter className="w-4 h-4 mr-2" />
                Custom Filters
              </button>
              <button 
                onClick={() => toast.info('Opening export settings')}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg text-left"
              >
                <Settings className="w-4 h-4 mr-2" />
                Export Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Export History</h3>
          <button 
            onClick={handleRefreshHistory}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
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
                    <div>
                      <p className="font-medium text-gray-900">{export_.name}</p>
                      {export_.size && (
                        <p className="text-sm text-gray-500">{export_.size} • {export_.format.toUpperCase()}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">{export_.marketplace}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">{export_.skus.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(export_.status)}`}>
                      {getStatusIcon(export_.status)}
                      <span className="ml-1 capitalize">{export_.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{export_.createdAt}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {export_.downloadUrl && export_.status === 'completed' && (
                        <button 
                          onClick={() => handleDownloadExport(export_)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      {export_.status === 'failed' && (
                        <button 
                          onClick={() => handleRetryExport(export_.id)}
                          className="text-orange-600 hover:text-orange-800"
                          title="Retry"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleEditExport(export_)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDuplicateExport(export_)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleShareExport(export_)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Share"
                      >
                        <Share className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteExport(export_.id)}
                        className="text-red-400 hover:text-red-600"
                        title="Delete"
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

      {/* Schedule Export Modal */}
      {showScheduler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Export</h3>
              <button
                onClick={() => setShowScheduler(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    setShowScheduler(false);
                    toast.success('Export scheduled successfully');
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Schedule
                </button>
                <button 
                  onClick={() => setShowScheduler(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Export Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">SKU</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Title</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Brand</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Price</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-2 text-sm">SKU001</td>
                      <td className="px-4 py-2 text-sm">Premium Cotton T-Shirt</td>
                      <td className="px-4 py-2 text-sm">FashionCo</td>
                      <td className="px-4 py-2 text-sm">$29.99</td>
                      <td className="px-4 py-2 text-sm">Ready</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-2 text-sm">SKU002</td>
                      <td className="px-4 py-2 text-sm">Denim Jacket</td>
                      <td className="px-4 py-2 text-sm">UrbanStyle</td>
                      <td className="px-4 py-2 text-sm">$79.99</td>
                      <td className="px-4 py-2 text-sm">Ready</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportCenter;