import React, { useState, useEffect } from 'react';
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
  Download,
  RefreshCw,
  Settings,
  Trash2,
  MoreVertical,
  FileText,
  Zap,
  Upload,
  X,
  Plus,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

const BulkProcessing = () => {
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [showProcessingDetails, setShowProcessingDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [bulkItems, setBulkItems] = useState([
    {
      id: 'SKU001',
      title: 'Premium Cotton T-Shirt',
      brand: 'FashionCo',
      status: 'completed',
      confidence: 96,
      aiSuggestions: 3,
      issues: 0,
      lastUpdated: '2024-01-15 14:30',
      marketplace: 'Namshi',
      category: 'Clothing'
    },
    {
      id: 'SKU002',
      title: 'Denim Jacket - Blue',
      brand: 'UrbanStyle',
      status: 'review',
      confidence: 78,
      aiSuggestions: 7,
      issues: 2,
      lastUpdated: '2024-01-15 14:25',
      marketplace: 'Amazon',
      category: 'Outerwear'
    },
    {
      id: 'SKU003',
      title: 'Leather Boots',
      brand: 'ComfortWalk',
      status: 'processing',
      confidence: 0,
      aiSuggestions: 0,
      issues: 0,
      lastUpdated: '2024-01-15 14:45',
      marketplace: 'Centrepoint',
      category: 'Footwear'
    },
    {
      id: 'SKU004',
      title: 'Summer Dress - Floral',
      brand: 'BreezyWear',
      status: 'failed',
      confidence: 45,
      aiSuggestions: 12,
      issues: 5,
      lastUpdated: '2024-01-15 14:20',
      marketplace: 'Noon',
      category: 'Dresses'
    },
    {
      id: 'SKU005',
      title: 'Sports Sneakers',
      brand: 'ActiveGear',
      status: 'completed',
      confidence: 94,
      aiSuggestions: 2,
      issues: 0,
      lastUpdated: '2024-01-15 14:35',
      marketplace: 'Trendyol',
      category: 'Footwear'
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'review': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'review': return <AlertTriangle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4 animate-spin" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredItems = bulkItems.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const processingStats = {
    total: bulkItems.length,
    completed: bulkItems.filter(item => item.status === 'completed').length,
    review: bulkItems.filter(item => item.status === 'review').length,
    processing: bulkItems.filter(item => item.status === 'processing').length,
    failed: bulkItems.filter(item => item.status === 'failed').length,
  };

  const handleStartProcessing = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to process');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('running');
    setProcessingProgress(0);

    try {
      for (let i = 0; i < selectedItems.length; i++) {
        const itemId = selectedItems[i];
        
        // Update item status to processing
        setBulkItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: 'processing' } : item
        ));

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update progress
        setProcessingProgress(((i + 1) / selectedItems.length) * 100);

        // Complete processing
        setBulkItems(prev => prev.map(item => 
          item.id === itemId ? { 
            ...item, 
            status: 'completed',
            confidence: Math.floor(Math.random() * 20) + 80,
            lastUpdated: new Date().toLocaleString()
          } : item
        ));
      }

      toast.success(`Successfully processed ${selectedItems.length} items`);
      setSelectedItems([]);
    } catch (error) {
      toast.error('Processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('idle');
      setProcessingProgress(0);
    }
  };

  const handlePauseProcessing = () => {
    setProcessingStatus('paused');
    setIsProcessing(false);
    toast.info('Processing paused');
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowProcessingDetails(true);
    toast.info(`Viewing details for ${item.id}`);
  };

  const handleEditItem = (item) => {
    toast.info(`Editing ${item.id}`);
  };

  const handleDeleteItem = (itemId) => {
    setBulkItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));
    toast.success('Item deleted successfully');
  };

  const handleExportSelected = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to export');
      return;
    }

    const selectedData = bulkItems.filter(item => selectedItems.includes(item.id));
    const csvContent = [
      ['SKU', 'Title', 'Brand', 'Status', 'Confidence', 'Marketplace', 'Last Updated'].join(','),
      ...selectedData.map(item => [
        item.id,
        `"${item.title}"`,
        item.brand,
        item.status,
        item.confidence,
        item.marketplace,
        item.lastUpdated
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk_processing_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${selectedItems.length} items`);
  };

  const handleBulkAction = (action) => {
    if (selectedItems.length === 0) {
      toast.error('Please select items first');
      return;
    }

    switch (action) {
      case 'approve':
        setBulkItems(prev => prev.map(item => 
          selectedItems.includes(item.id) ? { ...item, status: 'completed' } : item
        ));
        toast.success(`Approved ${selectedItems.length} items`);
        break;
      case 'review':
        setBulkItems(prev => prev.map(item => 
          selectedItems.includes(item.id) ? { ...item, status: 'review' } : item
        ));
        toast.success(`Marked ${selectedItems.length} items for review`);
        break;
      case 'retry':
        setBulkItems(prev => prev.map(item => 
          selectedItems.includes(item.id) ? { ...item, status: 'processing' } : item
        ));
        toast.success(`Retrying ${selectedItems.length} items`);
        break;
      default:
        break;
    }
    setSelectedItems([]);
  };

  const handleBatchUpload = () => {
    setShowBatchUpload(true);
  };

  const handleViewAnalytics = () => {
    toast.info('Opening bulk processing analytics');
  };

  const handleAdvancedFilters = () => {
    toast.info('Opening advanced filter options');
  };

  const handleScheduleProcessing = () => {
    toast.info('Opening processing scheduler');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Processing</h1>
          <p className="text-gray-600">Process and review SKUs in batches with AI automation</p>
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
            onClick={handleBatchUpload}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Batch Upload
          </button>
          <button 
            onClick={handleExportSelected}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Selected
          </button>
          <button 
            onClick={processingStatus === 'running' ? handlePauseProcessing : handleStartProcessing}
            disabled={isProcessing && processingStatus !== 'running'}
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

      {/* AI Processing Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Bulk Processing Engine</h3>
              <p className="text-gray-600">Intelligent batch processing with template adaptation and content generation</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">AI Active</span>
            </div>
            <button 
              onClick={handleScheduleProcessing}
              className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <Clock className="w-4 h-4 mr-1" />
              Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total SKUs', value: processingStats.total, color: 'bg-gray-100', icon: Layers },
          { label: 'Completed', value: processingStats.completed, color: 'bg-green-100 text-green-700', icon: CheckCircle },
          { label: 'Need Review', value: processingStats.review, color: 'bg-orange-100 text-orange-700', icon: AlertTriangle },
          { label: 'Processing', value: processingStats.processing, color: 'bg-blue-100 text-blue-700', icon: Clock },
          { label: 'Failed', value: processingStats.failed, color: 'bg-red-100 text-red-700', icon: AlertTriangle },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`p-4 rounded-lg ${stat.color} cursor-pointer hover:shadow-md transition-shadow`}
                 onClick={() => setFilterStatus(stat.label.toLowerCase().replace(' ', '_'))}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm">{stat.label}</p>
                </div>
                <Icon className="w-6 h-6 opacity-60" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Processing Progress */}
      {isProcessing && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Processing Progress</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {Math.round(processingProgress)}% completed
              </span>
              <button 
                onClick={handlePauseProcessing}
                className="text-orange-600 hover:text-orange-800"
              >
                <Pause className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Processing {selectedItems.length} items</span>
            <span>ETA: ~{Math.ceil((100 - processingProgress) / 10)} minutes</span>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search SKUs, titles, brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <button 
              onClick={handleAdvancedFilters}
              className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <Settings className="w-4 h-4 mr-1" />
              Advanced
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Showing {paginatedItems.length} of {filteredItems.length} items
            </span>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </button>
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
                  <input 
                    type="checkbox" 
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300" 
                  />
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
              {paginatedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300" 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{item.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.brand} • {item.marketplace}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
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
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200"
                          onClick={() => toast.info(`${item.aiSuggestions} AI suggestions available`)}>
                      {item.aiSuggestions}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.issues > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded cursor-pointer hover:bg-red-200"
                            onClick={() => toast.error(`${item.issues} issues found`)}>
                        {item.issues}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewItem(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditItem(item)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete item"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredItems.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredItems.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => handleBulkAction('approve')}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Accept All AI Suggestions
          </button>
          <button 
            onClick={() => handleBulkAction('review')}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Mark for Review
          </button>
          <button 
            onClick={() => handleBulkAction('retry')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Failed Items
          </button>
          <button 
            onClick={handleExportSelected}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Selected
          </button>
        </div>
        {selectedItems.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {/* Batch Upload Modal */}
      {showBatchUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Batch Upload</h3>
              <button
                onClick={() => setShowBatchUpload(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Multiple Files</h4>
                <p className="text-gray-600 mb-4">Drag & drop CSV or Excel files for batch processing</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Choose Files
                </button>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    setShowBatchUpload(false);
                    toast.success('Batch upload initiated');
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Start Upload
                </button>
                <button 
                  onClick={() => setShowBatchUpload(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Details Modal */}
      {showProcessingDetails && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Processing Details - {selectedItem.id}</h3>
              <button
                onClick={() => setShowProcessingDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Product Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Title:</span> {selectedItem.title}</p>
                  <p><span className="font-medium">Brand:</span> {selectedItem.brand}</p>
                  <p><span className="font-medium">Category:</span> {selectedItem.category}</p>
                  <p><span className="font-medium">Marketplace:</span> {selectedItem.marketplace}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Processing Status</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedItem.status)}`}>
                      {selectedItem.status}
                    </span>
                  </p>
                  <p><span className="font-medium">Confidence:</span> {selectedItem.confidence}%</p>
                  <p><span className="font-medium">AI Suggestions:</span> {selectedItem.aiSuggestions}</p>
                  <p><span className="font-medium">Issues:</span> {selectedItem.issues}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkProcessing;