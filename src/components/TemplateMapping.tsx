import React, { useState } from 'react';
import { 
  Shuffle, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Settings,
  Eye,
  Download
} from 'lucide-react';

const TemplateMapping = () => {
  const [selectedMarketplace, setSelectedMarketplace] = useState('namshi');
  const [mappingStatus, setMappingStatus] = useState('ready');

  const marketplaces = [
    { id: 'namshi', name: 'Namshi', color: 'bg-purple-500', status: 'active' },
    { id: 'centrepoint', name: 'Centrepoint', color: 'bg-blue-500', status: 'active' },
    { id: 'amazon', name: 'Amazon', color: 'bg-orange-500', status: 'active' },
    { id: 'noon', name: 'Noon', color: 'bg-yellow-500', status: 'active' },
    { id: 'trendyol', name: 'Trendyol', color: 'bg-red-500', status: 'draft' },
    { id: 'sixthstreet', name: '6th Street', color: 'bg-green-500', status: 'draft' },
  ];

  const fieldMappings = [
    { 
      source: 'product_name', 
      target: 'title', 
      confidence: 98, 
      status: 'mapped',
      aiSuggestion: 'Exact match found'
    },
    { 
      source: 'brand_name', 
      target: 'brand', 
      confidence: 95, 
      status: 'mapped',
      aiSuggestion: 'Direct mapping'
    },
    { 
      source: 'category_path', 
      target: 'product_type', 
      confidence: 87, 
      status: 'mapped',
      aiSuggestion: 'Category hierarchy mapped'
    },
    { 
      source: 'color_desc', 
      target: 'color', 
      confidence: 92, 
      status: 'mapped',
      aiSuggestion: 'Color standardized'
    },
    { 
      source: 'size_info', 
      target: 'size', 
      confidence: 89, 
      status: 'mapped',
      aiSuggestion: 'Size conversion applied'
    },
    { 
      source: 'material_type', 
      target: 'material', 
      confidence: 78, 
      status: 'review',
      aiSuggestion: 'Multiple material values detected'
    },
    { 
      source: 'gender_target', 
      target: 'gender', 
      confidence: 94, 
      status: 'mapped',
      aiSuggestion: 'Gender normalized'
    },
    { 
      source: 'product_images', 
      target: 'image_urls', 
      confidence: 85, 
      status: 'review',
      aiSuggestion: 'Image validation required'
    },
  ];

  const templateVersions = [
    { version: 'v2.4', date: '2024-01-10', status: 'current', changes: 'Added sustainability fields' },
    { version: 'v2.3', date: '2024-01-03', status: 'deprecated', changes: 'Updated size chart requirements' },
    { version: 'v2.2', date: '2023-12-15', status: 'deprecated', changes: 'Image dimension changes' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Template Mapping</h1>
          <p className="text-gray-600">AI-powered field mapping for marketplace templates</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Run AI Mapping
          </button>
        </div>
      </div>

      {/* Marketplace Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Marketplace</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {marketplaces.map((marketplace) => (
            <button
              key={marketplace.id}
              onClick={() => setSelectedMarketplace(marketplace.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMarketplace === marketplace.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-12 h-12 ${marketplace.color} rounded-lg mx-auto mb-2`}></div>
              <p className="font-medium text-gray-900 text-sm">{marketplace.name}</p>
              <p className={`text-xs ${
                marketplace.status === 'active' ? 'text-green-600' : 'text-orange-600'
              }`}>
                {marketplace.status}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Mapping */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Field Mapping</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Confidence threshold:</span>
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>80%</option>
                <option>85%</option>
                <option>90%</option>
                <option>95%</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {fieldMappings.map((mapping, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                mapping.status === 'mapped' ? 'border-green-200 bg-green-50' :
                mapping.status === 'review' ? 'border-orange-200 bg-orange-50' :
                'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{mapping.source}</code>
                    <Shuffle className="w-4 h-4 text-gray-400" />
                    <code className="text-sm bg-blue-100 px-2 py-1 rounded">{mapping.target}</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    {mapping.status === 'mapped' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    )}
                    <span className="text-sm font-medium">{mapping.confidence}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{mapping.aiSuggestion}</p>
                {mapping.status === 'review' && (
                  <div className="mt-2 flex space-x-2">
                    <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
                      Accept
                    </button>
                    <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">
                      Modify
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Template Info & Actions */}
        <div className="space-y-6">
          {/* Template Version */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Versions</h3>
            <div className="space-y-3">
              {templateVersions.map((version, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  version.status === 'current' ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{version.version}</span>
                    {version.status === 'current' && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Current</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{version.changes}</p>
                  <p className="text-xs text-gray-500 mt-1">{version.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mapping Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mapping Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Auto-mapped</span>
                <span className="font-semibold text-green-600">6/8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Needs Review</span>
                <span className="font-semibold text-orange-600">2/8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Confidence Score</span>
                <span className="font-semibold text-blue-600">89.5%</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Target className="w-4 h-4 mr-2" />
                Apply Mapping
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                <Eye className="w-4 h-4 mr-2" />
                Preview Mapping
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                <Download className="w-4 h-4 mr-2" />
                Export Template
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                <Settings className="w-4 h-4 mr-2" />
                Custom Rules
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateMapping;