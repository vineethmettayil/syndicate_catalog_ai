import React, { useState } from 'react';
import { 
  Image, 
  Upload, 
  Crop, 
  Palette, 
  Maximize, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Download,
  RefreshCw,
  Settings,
  Zap,
  Brain,
  Layers,
  Play,
  Pause,
  RotateCw,
  Contrast,
  Sun,
  Filter,
  Search,
  Trash2,
  Edit,
  Copy,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const ImageEnhancement = () => {
  const [selectedMarketplace, setSelectedMarketplace] = useState('namshi');
  const [processingMode, setProcessingMode] = useState('auto');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBatchUpload, setShowBatchUpload] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const marketplaceSpecs = {
    namshi: { width: 1000, height: 1333, ratio: '3:4', format: 'JPEG', maxSize: '2MB' },
    centrepoint: { width: 1080, height: 1080, ratio: '1:1', format: 'JPEG', maxSize: '1.5MB' },
    amazon: { width: 1000, height: 1000, ratio: '1:1', format: 'JPEG', maxSize: '10MB' },
    noon: { width: 800, height: 800, ratio: '1:1', format: 'JPEG', maxSize: '5MB' },
    trendyol: { width: 750, height: 1100, ratio: '15:22', format: 'JPEG', maxSize: '3MB' },
    sixthstreet: { width: 1200, height: 1600, ratio: '3:4', format: 'WebP', maxSize: '2MB' },
  };

  const [imageIssues, setImageIssues] = useState([
    {
      sku: 'SKU001',
      title: 'Premium Cotton T-Shirt',
      images: [
        {
          id: 1,
          url: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=200&h=267',
          status: 'compliant',
          issues: [],
          aiActions: ['Brightness adjusted', 'Background enhanced'],
          processed: true,
          size: '1.2MB',
          dimensions: '1000x1333'
        },
        {
          id: 2,
          url: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
          status: 'needs_resize',
          issues: ['Wrong aspect ratio', 'Low resolution'],
          aiActions: ['Resize to 1000x1333', 'Upscale resolution'],
          processed: false,
          size: '800KB',
          dimensions: '800x800'
        }
      ]
    },
    {
      sku: 'SKU002',
      title: 'Denim Jacket - Blue',
      images: [
        {
          id: 3,
          url: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=200&h=267',
          status: 'failed',
          issues: ['Dark image', 'Poor contrast', 'Background distraction'],
          aiActions: ['Brightness correction needed', 'Background removal suggested'],
          processed: false,
          size: '2.1MB',
          dimensions: '1200x1600'
        }
      ]
    }
  ]);

  const enhancementOptions = [
    { id: 'resize', label: 'Smart Resize', description: 'Automatically resize to marketplace specs', icon: Maximize, enabled: true },
    { id: 'crop', label: 'Intelligent Crop', description: 'AI-powered product focus cropping', icon: Crop, enabled: true },
    { id: 'brightness', label: 'Brightness Fix', description: 'Adjust lighting and exposure', icon: Sun, enabled: true },
    { id: 'contrast', label: 'Contrast Enhancement', description: 'Improve image contrast and clarity', icon: Contrast, enabled: true },
    { id: 'background', label: 'Background Clean', description: 'Remove or clean background', icon: Image, enabled: false },
    { id: 'rotate', label: 'Auto Rotate', description: 'Correct image orientation', icon: RotateCw, enabled: true },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50 border-green-200';
      case 'needs_resize': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4" />;
      case 'needs_resize': return <AlertTriangle className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const filteredImages = imageIssues.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const hasStatus = item.images.some(img => img.status === filterStatus);
    return matchesSearch && hasStatus;
  });

  const handleProcessAllImages = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      const allImages = imageIssues.flatMap(item => item.images);
      const totalImages = allImages.length;

      for (let i = 0; i < totalImages; i++) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setProcessingProgress(((i + 1) / totalImages) * 100);
      }

      // Update all images to processed
      setImageIssues(prev => prev.map(item => ({
        ...item,
        images: item.images.map(img => ({
          ...img,
          status: 'compliant',
          processed: true,
          issues: [],
          aiActions: [...img.aiActions, 'AI enhancement completed']
        }))
      })));

      toast.success('All images processed successfully!');
    } catch (error) {
      toast.error('Image processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleProcessSingleImage = async (itemIndex, imageIndex) => {
    const updatedItems = [...imageIssues];
    updatedItems[itemIndex].images[imageIndex].status = 'compliant';
    updatedItems[itemIndex].images[imageIndex].processed = true;
    updatedItems[itemIndex].images[imageIndex].issues = [];
    updatedItems[itemIndex].images[imageIndex].aiActions.push('Manual processing completed');
    
    setImageIssues(updatedItems);
    toast.success('Image processed successfully!');
  };

  const handlePreviewImage = (image) => {
    setSelectedImage(image);
    toast.info('Opening image preview...');
  };

  const handleEditImage = (image) => {
    setSelectedImage(image);
    setShowImageEditor(true);
    toast.info('Opening image editor...');
  };

  const handleDeleteImage = (itemIndex, imageIndex) => {
    const updatedItems = [...imageIssues];
    updatedItems[itemIndex].images.splice(imageIndex, 1);
    setImageIssues(updatedItems);
    toast.success('Image deleted successfully');
  };

  const handleDuplicateImage = (itemIndex, imageIndex) => {
    const updatedItems = [...imageIssues];
    const originalImage = updatedItems[itemIndex].images[imageIndex];
    const duplicatedImage = {
      ...originalImage,
      id: Date.now(),
      status: 'needs_resize'
    };
    updatedItems[itemIndex].images.push(duplicatedImage);
    setImageIssues(updatedItems);
    toast.success('Image duplicated successfully');
  };

  const handleUploadImages = () => {
    setShowBatchUpload(true);
  };

  const handleBatchUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        toast.success(`${files.length} images uploaded for enhancement`);
        // Add uploaded images to the list
        const newItem = {
          sku: `SKU${Date.now()}`,
          title: 'Uploaded Images',
          images: files.map((file, index) => ({
            id: Date.now() + index,
            url: URL.createObjectURL(file),
            status: 'needs_resize',
            issues: ['Needs processing'],
            aiActions: [],
            processed: false,
            size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
            dimensions: 'Unknown'
          }))
        };
        setImageIssues(prev => [...prev, newItem]);
        setShowBatchUpload(false);
      }
    };
    input.click();
  };

  const handleToggleEnhancement = (optionId) => {
    // Toggle enhancement option
    toast.info(`${optionId} enhancement toggled`);
  };

  const handleExportProcessed = () => {
    const processedImages = imageIssues.flatMap(item => 
      item.images.filter(img => img.processed)
    );
    
    if (processedImages.length === 0) {
      toast.error('No processed images to export');
      return;
    }

    toast.success(`Exporting ${processedImages.length} processed images`);
  };

  const handleMarketplaceSelect = (marketplace) => {
    setSelectedMarketplace(marketplace);
    const spec = marketplaceSpecs[marketplace];
    toast.info(`Selected ${marketplace}: ${spec.width}x${spec.height} (${spec.ratio})`);
  };

  const handleBulkAction = (action) => {
    const selectedCount = selectedImages.length;
    if (selectedCount === 0) {
      toast.error('Please select images first');
      return;
    }

    switch (action) {
      case 'process':
        toast.success(`Processing ${selectedCount} selected images`);
        break;
      case 'delete':
        toast.success(`Deleted ${selectedCount} selected images`);
        setSelectedImages([]);
        break;
      case 'export':
        toast.success(`Exporting ${selectedCount} selected images`);
        break;
    }
  };

  const handleImageSelect = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Image Enhancement</h1>
          <p className="text-gray-600">Intelligent image optimization for marketplace compliance</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportProcessed}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Processed
          </button>
          <button 
            onClick={() => toast.info('Opening enhancement settings')}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Enhancement Settings
          </button>
          <button 
            onClick={handleUploadImages}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </button>
          <button 
            onClick={handleProcessAllImages}
            disabled={isProcessing}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Process All Images
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Enhancement Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Syndicate AI Image Engine</h3>
              <p className="text-gray-600">
                Advanced image processing with marketplace-specific optimization
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">AI Active</span>
            </div>
            <button 
              onClick={() => toast.info('AI image engine status: All systems operational')}
              className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
            >
              <Zap className="w-4 h-4 mr-1" />
              Status
            </button>
          </div>
        </div>
      </div>

      {/* Processing Progress */}
      {isProcessing && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Processing Images</h3>
            <span className="text-sm text-gray-600">
              {Math.round(processingProgress)}% completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            Applying AI enhancements and marketplace optimizations...
          </p>
        </div>
      )}

      {/* Marketplace Specifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketplace Image Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(marketplaceSpecs).map(([key, spec]) => (
            <button
              key={key}
              onClick={() => handleMarketplaceSelect(key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMarketplace === key
                  ? 'border-blue-500 bg-blue-50 transform scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-gray-900 capitalize mb-2">{key.replace('sixthstreet', '6th Street')}</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{spec.width}×{spec.height}</p>
                <p>Ratio: {spec.ratio}</p>
                <p>Max: {spec.maxSize}</p>
                <p>{spec.format}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Enhancement Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Enhancement Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enhancementOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} className={`p-4 border border-gray-200 rounded-lg transition-colors ${
                option.enabled ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50'
              }`}
                   onClick={() => option.enabled && handleToggleEnhancement(option.id)}>
                <div className="flex items-center mb-2">
                  <Icon className={`w-5 h-5 mr-2 ${option.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                  <h4 className="font-medium text-gray-900">{option.label}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={option.enabled}
                    onChange={() => handleToggleEnhancement(option.id)}
                    className="rounded border-gray-300 text-blue-600" 
                  />
                  <span className="ml-2 text-sm text-gray-600">Auto-apply</span>
                </label>
              </div>
            );
          })}
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
                placeholder="Search SKUs, titles..."
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
                <option value="compliant">Compliant</option>
                <option value="needs_resize">Needs Resize</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {filteredImages.length} items found
            </span>
            {selectedImages.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-blue-600">{selectedImages.length} selected</span>
                <button 
                  onClick={() => handleBulkAction('process')}
                  className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                >
                  Process
                </button>
                <button 
                  onClick={() => handleBulkAction('delete')}
                  className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Issues and Processing */}
      <div className="space-y-6">
        {filteredImages.map((item, itemIndex) => (
          <div key={item.sku} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{item.sku}</h3>
                <p className="text-gray-600">{item.title}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    item.images.forEach((_, imageIndex) => {
                      handleProcessSingleImage(itemIndex, imageIndex);
                    });
                  }}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Process All
                </button>
                <button 
                  onClick={handleUploadImages}
                  className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Add Images
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {item.images.map((image, imageIndex) => (
                <div key={image.id} className="space-y-4">
                  <div className="relative">
                    <img
                      src={image.url}
                      alt="Product"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handlePreviewImage(image)}
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(image.status)}`}>
                        {getStatusIcon(image.status)}
                        <span className="ml-1 capitalize">{image.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    {image.processed && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        ✓ Processed
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      {image.dimensions} • {image.size}
                    </div>
                  </div>

                  {image.issues.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-red-800 mb-2">Issues Detected:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {image.issues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {image.aiActions.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">AI Enhancements:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {image.aiActions.map((action, index) => (
                          <li key={index}>• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handlePreviewImage(image)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </button>
                    <button 
                      onClick={() => handleEditImage(image)}
                      className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDuplicateImage(itemIndex, imageIndex)}
                      className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteImage(itemIndex, imageIndex)}
                      className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleProcessSingleImage(itemIndex, imageIndex)}
                      disabled={image.processed}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {image.processed ? 'Processed' : 'Apply'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Batch Upload Modal */}
      {showBatchUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Images for Enhancement</h3>
              <button
                onClick={() => setShowBatchUpload(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div 
              onClick={handleBatchUpload}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Images for Enhancement</h4>
              <p className="text-gray-600 mb-4">Drag & drop images or click to browse</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Choose Images
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: JPEG, PNG, WebP (Max 10MB each)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Editor Modal */}
      {showImageEditor && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Image Editor</h3>
              <button
                onClick={() => setShowImageEditor(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <img 
                  src={selectedImage.url} 
                  alt="Editing" 
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Enhancement Tools</h4>
                <div className="grid grid-cols-2 gap-3">
                  {enhancementOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => toast.info(`Applying ${option.label}`)}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <Icon className="w-5 h-5 mr-2 text-blue-600" />
                        <span className="text-sm">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      setShowImageEditor(false);
                      toast.success('Image enhancements applied');
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Apply Enhancements
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEnhancement;