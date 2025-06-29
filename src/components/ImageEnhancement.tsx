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
  Settings
} from 'lucide-react';

const ImageEnhancement = () => {
  const [selectedMarketplace, setSelectedMarketplace] = useState('namshi');
  const [processingMode, setProcessingMode] = useState('auto');

  const marketplaceSpecs = {
    namshi: { width: 1000, height: 1333, ratio: '3:4', format: 'JPEG', maxSize: '2MB' },
    centrepoint: { width: 1080, height: 1080, ratio: '1:1', format: 'JPEG', maxSize: '1.5MB' },
    amazon: { width: 1000, height: 1000, ratio: '1:1', format: 'JPEG', maxSize: '10MB' },
    noon: { width: 800, height: 800, ratio: '1:1', format: 'JPEG', maxSize: '5MB' },
    trendyol: { width: 750, height: 1100, ratio: '15:22', format: 'JPEG', maxSize: '3MB' },
    sixthstreet: { width: 1200, height: 1600, ratio: '3:4', format: 'WebP', maxSize: '2MB' },
  };

  const imageIssues = [
    {
      sku: 'SKU001',
      title: 'Premium Cotton T-Shirt',
      images: [
        {
          id: 1,
          url: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=200&h=267',
          status: 'compliant',
          issues: [],
          aiActions: ['Brightness adjusted', 'Background enhanced']
        },
        {
          id: 2,
          url: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
          status: 'needs_resize',
          issues: ['Wrong aspect ratio', 'Low resolution'],
          aiActions: ['Resize to 1000x1333', 'Upscale resolution']
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
          aiActions: ['Brightness correction needed', 'Background removal suggested']
        }
      ]
    }
  ];

  const enhancementOptions = [
    { id: 'resize', label: 'Smart Resize', description: 'Automatically resize to marketplace specs', icon: Maximize },
    { id: 'crop', label: 'Intelligent Crop', description: 'AI-powered product focus cropping', icon: Crop },
    { id: 'brightness', label: 'Brightness Fix', description: 'Adjust lighting and exposure', icon: Palette },
    { id: 'background', label: 'Background Clean', description: 'Remove or clean background', icon: Image },
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Image Enhancement</h1>
          <p className="text-gray-600">AI-powered image optimization for marketplace compliance</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Enhancement Settings
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Process All Images
          </button>
        </div>
      </div>

      {/* Marketplace Specifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketplace Image Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(marketplaceSpecs).map(([key, spec]) => (
            <button
              key={key}
              onClick={() => setSelectedMarketplace(key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedMarketplace === key
                  ? 'border-blue-500 bg-blue-50'
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Enhancement Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {enhancementOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center mb-2">
                  <Icon className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-gray-900">{option.label}</h4>
                </div>
                <p className="text-sm text-gray-600">{option.description}</p>
                <label className="flex items-center mt-3">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-600">Auto-apply</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Processing Mode */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Mode</h3>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="processingMode"
              value="auto"
              checked={processingMode === 'auto'}
              onChange={(e) => setProcessingMode(e.target.value)}
              className="text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-900">Automatic Enhancement</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="processingMode"
              value="review"
              checked={processingMode === 'review'}
              onChange={(e) => setProcessingMode(e.target.value)}
              className="text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-900">Review Before Apply</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="processingMode"
              value="manual"
              checked={processingMode === 'manual'}
              onChange={(e) => setProcessingMode(e.target.value)}
              className="text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-900">Manual Processing</span>
          </label>
        </div>
      </div>

      {/* Image Issues and Processing */}
      <div className="space-y-6">
        {imageIssues.map((item) => (
          <div key={item.sku} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{item.sku}</h3>
                <p className="text-gray-600">{item.title}</p>
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Process All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {item.images.map((image) => (
                <div key={image.id} className="space-y-4">
                  <div className="relative">
                    <img
                      src={image.url}
                      alt="Product"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <div className={`absolute top-2 right-2 flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(image.status)}`}>
                      {getStatusIcon(image.status)}
                      <span className="ml-1 capitalize">{image.status.replace('_', ' ')}</span>
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
                    <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </button>
                    <button className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Batch Upload */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Images</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
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
  );
};

export default ImageEnhancement;