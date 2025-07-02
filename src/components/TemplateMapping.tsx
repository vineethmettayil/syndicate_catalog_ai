import React, { useState, useEffect } from 'react';
import { 
  Shuffle, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Settings,
  Eye,
  Download,
  Save,
  Upload,
  Zap,
  Brain,
  Layers,
  X,
  Edit,
  Trash2,
  Plus,
  Copy,
  FileText
} from 'lucide-react';
import { templateAdaptationService } from '../services/templateAdaptationService';
import toast from 'react-hot-toast';

const TemplateMapping = () => {
  const [selectedMarketplace, setSelectedMarketplace] = useState('namshi');
  const [mappingStatus, setMappingStatus] = useState('ready');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mappingResults, setMappingResults] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showCustomRules, setShowCustomRules] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState(null);

  const marketplaces = [
    { id: 'namshi', name: 'Namshi', color: 'bg-purple-500', status: 'active', version: 'v3.0' },
    { id: 'centrepoint', name: 'Centrepoint', color: 'bg-blue-500', status: 'active', version: 'v2.8' },
    { id: 'amazon', name: 'Amazon', color: 'bg-orange-500', status: 'active', version: 'v4.2' },
    { id: 'noon', name: 'Noon', color: 'bg-yellow-500', status: 'active', version: 'v3.1' },
    { id: 'trendyol', name: 'Trendyol', color: 'bg-red-500', status: 'draft', version: 'v2.1' },
    { id: 'sixthstreet', name: '6th Street', color: 'bg-green-500', status: 'draft', version: 'v1.9' },
  ];

  const [fieldMappings, setFieldMappings] = useState([
    { 
      source: 'product_name', 
      target: 'title', 
      confidence: 98, 
      status: 'mapped',
      aiSuggestion: 'Exact match found',
      transformation: 'direct'
    },
    { 
      source: 'brand_name', 
      target: 'brand', 
      confidence: 95, 
      status: 'mapped',
      aiSuggestion: 'Direct mapping',
      transformation: 'direct'
    },
    { 
      source: 'category_path', 
      target: 'product_type', 
      confidence: 87, 
      status: 'mapped',
      aiSuggestion: 'Category hierarchy mapped',
      transformation: 'calculated'
    },
    { 
      source: 'color_desc', 
      target: 'color', 
      confidence: 92, 
      status: 'mapped',
      aiSuggestion: 'Color standardized',
      transformation: 'mapped'
    },
    { 
      source: 'size_info', 
      target: 'size', 
      confidence: 89, 
      status: 'mapped',
      aiSuggestion: 'Size conversion applied',
      transformation: 'mapped'
    },
    { 
      source: 'material_type', 
      target: 'material', 
      confidence: 78, 
      status: 'review',
      aiSuggestion: 'Multiple material values detected',
      transformation: 'generated'
    },
    { 
      source: 'gender_target', 
      target: 'gender', 
      confidence: 94, 
      status: 'mapped',
      aiSuggestion: 'Gender normalized',
      transformation: 'mapped'
    },
    { 
      source: 'product_images', 
      target: 'image_urls', 
      confidence: 85, 
      status: 'review',
      aiSuggestion: 'Image validation required',
      transformation: 'calculated'
    },
  ]);

  const templateVersions = [
    { version: 'v3.0', date: '2024-01-15', status: 'current', changes: 'Added AI-powered attribute inference' },
    { version: 'v2.4', date: '2024-01-10', status: 'deprecated', changes: 'Added sustainability fields' },
    { version: 'v2.3', date: '2024-01-03', status: 'deprecated', changes: 'Updated size chart requirements' },
  ];

  const handleRunAIMapping = async () => {
    setIsProcessing(true);
    setMappingStatus('processing');
    
    try {
      toast.success('AI mapping analysis started...');
      
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update mappings with improved confidence
      const updatedMappings = fieldMappings.map(mapping => ({
        ...mapping,
        confidence: Math.min(100, mapping.confidence + Math.random() * 10),
        status: mapping.confidence > 85 ? 'mapped' : 'review'
      }));
      
      setFieldMappings(updatedMappings);
      setMappingStatus('completed');
      toast.success('AI mapping completed successfully!');
    } catch (error) {
      toast.error('AI mapping failed. Please try again.');
      setMappingStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptMapping = (index) => {
    const updated = [...fieldMappings];
    updated[index].status = 'mapped';
    updated[index].confidence = Math.min(100, updated[index].confidence + 5);
    setFieldMappings(updated);
    toast.success(`Mapping accepted for ${updated[index].source}`);
  };

  const handleRejectMapping = (index) => {
    const updated = [...fieldMappings];
    updated[index].status = 'review';
    updated[index].confidence = Math.max(0, updated[index].confidence - 10);
    setFieldMappings(updated);
    toast.info(`Mapping rejected for ${updated[index].source}`);
  };

  const handleEditMapping = (index) => {
    setSelectedMapping(index);
    toast.info(`Editing mapping for ${fieldMappings[index].source}`);
  };

  const handleDeleteMapping = (index) => {
    const updated = fieldMappings.filter((_, i) => i !== index);
    setFieldMappings(updated);
    toast.success('Mapping deleted successfully');
  };

  const handleAddMapping = () => {
    const newMapping = {
      source: 'new_field',
      target: 'target_field',
      confidence: 50,
      status: 'review',
      aiSuggestion: 'Manual mapping added',
      transformation: 'direct'
    };
    setFieldMappings([...fieldMappings, newMapping]);
    toast.success('New mapping added');
  };

  const handleDuplicateMapping = (index) => {
    const mapping = fieldMappings[index];
    const duplicated = {
      ...mapping,
      source: `${mapping.source}_copy`,
      status: 'review'
    };
    setFieldMappings([...fieldMappings, duplicated]);
    toast.success('Mapping duplicated');
  };

  const handleApplyMapping = () => {
    const mappedCount = fieldMappings.filter(m => m.status === 'mapped').length;
    toast.success(`Applied ${mappedCount} field mappings to ${selectedMarketplace}`);
    setMappingStatus('applied');
  };

  const handlePreviewMapping = () => {
    setShowPreview(true);
    toast.info('Opening mapping preview...');
  };

  const handleExportTemplate = () => {
    const template = {
      marketplace: selectedMarketplace,
      version: marketplaces.find(m => m.id === selectedMarketplace)?.version,
      mappings: fieldMappings,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMarketplace}_template_mapping.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Template mapping exported successfully!');
  };

  const handleSaveTemplate = () => {
    toast.success('Template mapping saved successfully!');
  };

  const handleUploadTemplate = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const template = JSON.parse(e.target.result);
            setFieldMappings(template.mappings || []);
            toast.success('Template mapping uploaded successfully!');
          } catch (error) {
            toast.error('Invalid template file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleMarketplaceSelect = (marketplace) => {
    setSelectedMarketplace(marketplace.id);
    toast.info(`Selected ${marketplace.name} template ${marketplace.version}`);
  };

  const handleCustomRules = () => {
    setShowCustomRules(true);
    toast.info('Opening custom mapping rules editor');
  };

  const handleBulkAction = (action) => {
    const selectedMappings = fieldMappings.filter(m => m.status === 'review');
    if (selectedMappings.length === 0) {
      toast.error('No mappings available for bulk action');
      return;
    }

    switch (action) {
      case 'accept_all':
        setFieldMappings(prev => prev.map(m => 
          m.status === 'review' ? { ...m, status: 'mapped', confidence: Math.min(100, m.confidence + 10) } : m
        ));
        toast.success(`Accepted ${selectedMappings.length} mappings`);
        break;
      case 'reject_all':
        setFieldMappings(prev => prev.map(m => 
          m.status === 'review' ? { ...m, confidence: Math.max(0, m.confidence - 20) } : m
        ));
        toast.info(`Rejected ${selectedMappings.length} mappings`);
        break;
      case 'reset_all':
        setFieldMappings(prev => prev.map(m => ({ ...m, status: 'review', confidence: 50 })));
        toast.info('All mappings reset for review');
        break;
    }
  };

  const getTransformationIcon = (transformation) => {
    switch (transformation) {
      case 'direct': return <Target className="w-4 h-4 text-green-500" />;
      case 'mapped': return <Shuffle className="w-4 h-4 text-blue-500" />;
      case 'calculated': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'generated': return <Brain className="w-4 h-4 text-purple-500" />;
      default: return <Layers className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dynamic Template Mapping</h1>
          <p className="text-gray-600">AI-powered field mapping with intelligent template adaptation</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleUploadTemplate}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Template
          </button>
          <button 
            onClick={handleSaveTemplate}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </button>
          <button 
            onClick={handleRunAIMapping}
            disabled={isProcessing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Run AI Mapping
          </button>
        </div>
      </div>

      {/* AI Status Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Syndicate AI Template Engine</h3>
              <p className="text-gray-600">
                Intelligent field mapping and template adaptation for {selectedMarketplace}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">AI Active</span>
            </div>
            <button 
              onClick={handleCustomRules}
              className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <Settings className="w-4 h-4 mr-1" />
              Custom Rules
            </button>
          </div>
        </div>
      </div>

      {/* Marketplace Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Target Marketplace</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {marketplaces.map((marketplace) => (
            <button
              key={marketplace.id}
              onClick={() => handleMarketplaceSelect(marketplace)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMarketplace === marketplace.id
                  ? 'border-blue-500 bg-blue-50 transform scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-12 h-12 ${marketplace.color} rounded-lg mx-auto mb-2`}></div>
              <p className="font-medium text-gray-900 text-sm">{marketplace.name}</p>
              <p className="text-xs text-gray-500">{marketplace.version}</p>
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
            <h3 className="text-lg font-semibold text-gray-900">Intelligent Field Mapping</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Confidence threshold:</span>
                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                  <option>80%</option>
                  <option>85%</option>
                  <option>90%</option>
                  <option>95%</option>
                </select>
              </div>
              <button
                onClick={handlePreviewMapping}
                className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </button>
              <button
                onClick={handleAddMapping}
                className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
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
                    {getTransformationIcon(mapping.transformation)}
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
                <p className="text-sm text-gray-600 mb-2">{mapping.aiSuggestion}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">
                    Transformation: {mapping.transformation}
                  </span>
                  <div className="flex items-center space-x-2">
                    {mapping.status === 'review' && (
                      <>
                        <button 
                          onClick={() => handleAcceptMapping(index)}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleRejectMapping(index)}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleEditMapping(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDuplicateMapping(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteMapping(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk Actions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Bulk Actions</h4>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleBulkAction('accept_all')}
                className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Accept All
              </button>
              <button 
                onClick={() => handleBulkAction('reject_all')}
                className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <X className="w-4 h-4 mr-1" />
                Reject All
              </button>
              <button 
                onClick={() => handleBulkAction('reset_all')}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset All
              </button>
            </div>
          </div>
        </div>

        {/* Template Info & Actions */}
        <div className="space-y-6">
          {/* Template Version */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Versions</h3>
            <div className="space-y-3">
              {templateVersions.map((version, index) => (
                <div key={index} className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                  version.status === 'current' ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}
                     onClick={() => toast.info(`Viewing template ${version.version}`)}>
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
                <span className="font-semibold text-green-600">
                  {fieldMappings.filter(m => m.status === 'mapped').length}/{fieldMappings.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Needs Review</span>
                <span className="font-semibold text-orange-600">
                  {fieldMappings.filter(m => m.status === 'review').length}/{fieldMappings.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Confidence</span>
                <span className="font-semibold text-blue-600">
                  {Math.round(fieldMappings.reduce((sum, m) => sum + m.confidence, 0) / fieldMappings.length)}%
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button 
                onClick={handleApplyMapping}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Target className="w-4 h-4 mr-2" />
                Apply Mapping
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={handlePreviewMapping}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Mapping
              </button>
              <button 
                onClick={handleExportTemplate}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Template
              </button>
              <button 
                onClick={handleCustomRules}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Settings className="w-4 h-4 mr-2" />
                Custom Rules
              </button>
              <button 
                onClick={() => toast.info('Opening template documentation')}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                Documentation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Mapping Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {fieldMappings.map((mapping, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Source</h4>
                      <p className="text-sm text-gray-600">{mapping.source}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Target</h4>
                      <p className="text-sm text-gray-600">{mapping.target}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Transformation</h4>
                      <p className="text-sm text-gray-600 capitalize">{mapping.transformation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Rules Modal */}
      {showCustomRules && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Custom Mapping Rules</h3>
              <button
                onClick={() => setShowCustomRules(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter rule name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                  placeholder="Define mapping condition..."
                />
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    setShowCustomRules(false);
                    toast.success('Custom rule saved');
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Rule
                </button>
                <button 
                  onClick={() => setShowCustomRules(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateMapping;