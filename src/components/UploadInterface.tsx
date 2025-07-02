import React, { useState } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Globe, 
  CheckCircle, 
  AlertCircle,
  X,
  Download,
  Eye,
  Brain,
  Play,
  Zap,
  Target,
  Layers,
  Settings,
  RefreshCw,
  Trash2
} from 'lucide-react';
import FileUploadZone from './FileUploadZone';
import { FileProcessingResult } from '../services/fileProcessingService';
import { ProductData } from '../services/enhancedAIService';
import { enhancedAIService, EnhancedAIProcessingResult, BatchProcessingProgress } from '../services/enhancedAIService';
import { demoDataService } from '../services/demoDataService';
import { useAuth } from '../hooks/useFirebase';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';

const UploadInterface = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [fileResult, setFileResult] = useState<FileProcessingResult | null>(null);
  const [selectedMarketplace, setSelectedMarketplace] = useState('namshi');
  const [aiResults, setAIResults] = useState<EnhancedAIProcessingResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<BatchProcessingProgress | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [processingMode, setProcessingMode] = useState<'auto' | 'review' | 'manual'>('auto');
  const [uploadHistory, setUploadHistory] = useState([
    { id: 1, name: 'sample_catalog.csv', date: '2024-01-15', status: 'completed', items: 5 },
    { id: 2, name: 'fashion_products.xlsx', date: '2024-01-14', status: 'processing', items: 12 },
  ]);
  
  const { user, userProfile } = useAuth();

  const marketplaces = [
    { id: 'namshi', name: 'Namshi', color: 'bg-purple-500', version: 'v3.0', attributes: 14 },
    { id: 'amazon', name: 'Amazon', color: 'bg-orange-500', version: 'v4.2', attributes: 16 },
    { id: 'centrepoint', name: 'Centrepoint', color: 'bg-blue-500', version: 'v2.8', attributes: 12 },
    { id: 'noon', name: 'Noon', color: 'bg-yellow-500', version: 'v3.1', attributes: 13 },
    { id: 'trendyol', name: 'Trendyol', color: 'bg-red-500', version: 'v2.1', attributes: 15 },
    { id: 'sixthstreet', name: '6th Street', color: 'bg-green-500', version: 'v1.9', attributes: 11 },
  ];

  const handleFileProcessed = (result: FileProcessingResult) => {
    setFileResult(result);
    if (result.validRows > 0) {
      setActiveTab('ai-processing');
      toast.success(`File processed! ${result.validRows} products ready for intelligent adaptation.`);
      
      // Add to upload history
      const newUpload = {
        id: Date.now(),
        name: result.fileName,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        items: result.validRows
      };
      setUploadHistory(prev => [newUpload, ...prev]);
    }
  };

  const handleAIProcessingStart = async () => {
    if (!fileResult || fileResult.data.length === 0) {
      toast.error('No data to process');
      return;
    }

    setProcessing(true);
    setProgress(null);

    try {
      const results = await enhancedAIService.batchProcessProducts(
        fileResult.data,
        selectedMarketplace,
        (progressUpdate) => {
          setProgress(progressUpdate);
        }
      );

      setAIResults(results);
      setActiveTab('results');
      
      const successCount = results.filter(r => r.confidence > 70).length;
      toast.success(`AI processing completed! ${successCount} products optimized and ready.`);
    } catch (error) {
      console.error('AI processing error:', error);
      toast.error('AI processing failed. Please try again.');
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  const loadDemoData = () => {
    const demoResult = demoDataService.createDemoFileProcessingResult();
    setFileResult(demoResult);
    setActiveTab('ai-processing');
    toast.success('Enhanced demo data loaded! Ready for AI template adaptation.');
  };

  const downloadSample = () => {
    demoDataService.downloadSampleCSV();
    toast.success('Enhanced sample CSV downloaded with comprehensive attributes!');
  };

  const exportResults = () => {
    if (aiResults.length === 0) {
      toast.error('No processed data to export');
      return;
    }

    const exportData = aiResults.map((result, index) => ({
      original_sku: result.originalData.sku,
      ...result.adaptedData,
      confidence: result.confidence,
      template_adaptations: result.templateAdaptation.mappings.length,
      ai_enhancements: Object.values(result.aiEnhancements).filter(Boolean).length,
      compliance_issues: result.complianceIssues.join('; '),
      generated_fields: result.aiEnhancements.missingFieldsGenerated.join(', ')
    }));

    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `syndicate_ai_${selectedMarketplace}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Enhanced results exported successfully!');
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleClearData = () => {
    setFileResult(null);
    setAIResults([]);
    setActiveTab('upload');
    toast.success('Data cleared successfully');
  };

  const handleRetryProcessing = () => {
    if (fileResult) {
      setActiveTab('ai-processing');
      toast.info('Ready to retry AI processing');
    }
  };

  const handleViewUploadHistory = () => {
    toast.info('Opening upload history details');
  };

  const handleDeleteUpload = (uploadId: number) => {
    setUploadHistory(prev => prev.filter(upload => upload.id !== uploadId));
    toast.success('Upload deleted from history');
  };

  const handleMarketplaceInfo = (marketplace: any) => {
    toast.info(`${marketplace.name} template v${marketplace.version} with ${marketplace.attributes} attributes`);
  };

  const handleProcessingModeInfo = (mode: string) => {
    const descriptions = {
      auto: 'AI automatically handles all template adaptations and optimizations',
      review: 'AI suggests changes for your review and approval before applying',
      manual: 'Full manual control over all template adaptations and changes'
    };
    toast.info(descriptions[mode]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Syndicate AI Processing</h1>
          <p className="text-gray-600 mt-1">Intelligent template adaptation with AI-powered content generation</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={downloadSample}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Enhanced Sample
          </button>
          <button 
            onClick={loadDemoData}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Play className="w-4 h-4 mr-2" />
            AI Demo
          </button>
          {!user && (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Sign In
            </button>
          )}
          {aiResults.length > 0 && (
            <button 
              onClick={exportResults}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Enhanced
            </button>
          )}
          {(fileResult || aiResults.length > 0) && (
            <button 
              onClick={handleClearData}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Data
            </button>
          )}
        </div>
      </div>

      {/* AI Capabilities Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Syndicate AI Engine Active</h2>
              <p className="text-blue-100">Advanced template adaptation • Content generation • Compliance validation</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI Online</span>
            </div>
            <button 
              onClick={() => toast.info('AI engine status: All systems operational')}
              className="flex items-center px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <Settings className="w-4 h-4 mr-1" />
              Status
            </button>
          </div>
        </div>
      </div>

      {/* User Status */}
      {user && userProfile && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-800">
              Signed in as {userProfile.name} ({userProfile.role}) - Full AI capabilities enabled
            </span>
          </div>
        </div>
      )}

      {/* Enhanced Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'upload', label: 'Smart Upload', icon: Upload, description: 'Upload & analyze' },
            { id: 'ai-processing', label: 'AI Processing', icon: Brain, disabled: !fileResult, description: 'Template adaptation' },
            { id: 'results', label: 'Enhanced Results', icon: Target, disabled: aiResults.length === 0, description: 'View optimized data' }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`group flex flex-col items-center py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : tab.disabled
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{tab.label}</span>
                <span className="text-xs text-gray-400 group-hover:text-gray-500">{tab.description}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Enhanced Marketplace Selection */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Select Target Marketplace</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {marketplaces.map((marketplace) => (
                <button
                  key={marketplace.id}
                  onClick={() => {
                    setSelectedMarketplace(marketplace.id);
                    handleMarketplaceInfo(marketplace);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedMarketplace === marketplace.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 ${marketplace.color} rounded-xl mx-auto mb-3 flex items-center justify-center`}>
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{marketplace.name}</p>
                  <p className="text-xs text-gray-500">{marketplace.version}</p>
                  <p className="text-xs text-blue-600 font-medium">{marketplace.attributes} attributes</p>
                </button>
              ))}
            </div>
          </div>

          {/* Processing Mode Selection */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI Processing Mode</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  id: 'auto', 
                  title: 'Fully Automatic', 
                  description: 'AI handles all adaptations and optimizations',
                  icon: Zap,
                  color: 'border-green-500 bg-green-50 text-green-700'
                },
                { 
                  id: 'review', 
                  title: 'Review & Approve', 
                  description: 'AI suggests changes for your approval',
                  icon: Eye,
                  color: 'border-blue-500 bg-blue-50 text-blue-700'
                },
                { 
                  id: 'manual', 
                  title: 'Manual Control', 
                  description: 'Full control over all adaptations',
                  icon: Settings,
                  color: 'border-gray-500 bg-gray-50 text-gray-700'
                }
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <label
                    key={mode.id}
                    className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      processingMode === mode.id ? mode.color : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleProcessingModeInfo(mode.id)}
                  >
                    <input
                      type="radio"
                      name="processingMode"
                      value={mode.id}
                      checked={processingMode === mode.id}
                      onChange={(e) => setProcessingMode(e.target.value as any)}
                      className="sr-only"
                    />
                    <Icon className="w-6 h-6 mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">{mode.title}</h4>
                      <p className="text-sm opacity-80">{mode.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Start Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={loadDemoData}
                className="group flex items-center justify-center p-8 border-2 border-dashed border-green-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Brain className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Experience AI Demo</h4>
                  <p className="text-sm text-gray-600">See intelligent template adaptation with sample data</p>
                </div>
              </button>
              <button
                onClick={downloadSample}
                className="group flex items-center justify-center p-8 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Download className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Enhanced Template</h4>
                  <p className="text-sm text-gray-600">Download comprehensive CSV template with all attributes</p>
                </div>
              </button>
            </div>
          </div>

          {/* File Upload */}
          <FileUploadZone
            onFileProcessed={handleFileProcessed}
            onProcessingStart={() => {}}
          />

          {/* Upload History */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Upload History</h3>
              <button 
                onClick={handleViewUploadHistory}
                className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <Eye className="w-4 h-4 mr-1" />
                View All
              </button>
            </div>
            <div className="space-y-3">
              {uploadHistory.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileSpreadsheet className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{upload.name}</p>
                      <p className="text-sm text-gray-600">{upload.date} • {upload.items} items</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      upload.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {upload.status}
                    </span>
                    <button 
                      onClick={() => handleDeleteUpload(upload.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* File Processing Results */}
          {fileResult && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">File Analysis Complete</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">{fileResult.totalRows}</p>
                  <p className="text-sm text-blue-700">Total Rows</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">{fileResult.validRows}</p>
                  <p className="text-sm text-green-700">Valid Products</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">{Object.keys(fileResult.data[0] || {}).length}</p>
                  <p className="text-sm text-purple-700">Attributes Detected</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <p className="text-2xl font-bold text-orange-600">{fileResult.errors.length}</p>
                  <p className="text-sm text-orange-700">Issues Found</p>
                </div>
              </div>

              {fileResult.errors.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Analysis Issues:</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {fileResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {fileResult.errors.length > 5 && (
                      <li>• And {fileResult.errors.length - 5} more issues...</li>
                    )}
                  </ul>
                </div>
              )}

              {fileResult.validRows > 0 && (
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setActiveTab('ai-processing')}
                    className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Start AI Template Adaptation
                  </button>
                  <button
                    onClick={handleRetryProcessing}
                    className="flex items-center px-6 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'ai-processing' && fileResult && (
        <div className="space-y-6">
          {/* AI Processing Interface */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">AI Template Adaptation Engine</h3>
                <p className="text-gray-600">Intelligent mapping and optimization for {marketplaces.find(m => m.id === selectedMarketplace)?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">{fileResult.validRows}</p>
                <p className="text-sm text-gray-600">Products Ready</p>
              </div>
            </div>

            {/* Processing Progress */}
            {processing && progress && (
              <div className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-blue-900">AI Processing in Progress</h4>
                  <span className="text-sm text-blue-700">
                    {progress.itemsProcessed} of {progress.totalItems} completed
                  </span>
                </div>
                
                <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.itemsProcessed / progress.totalItems) * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">{progress.itemsSuccessful}</p>
                    <p className="text-xs text-blue-700">Successful</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-orange-600">{progress.itemsFailed}</p>
                    <p className="text-xs text-orange-700">Failed</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-600">{progress.totalItems - progress.itemsProcessed}</p>
                    <p className="text-xs text-gray-700">Remaining</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{formatTime(progress.estimatedTimeRemaining)}</p>
                    <p className="text-xs text-green-700">ETA</p>
                  </div>
                </div>

                <p className="text-sm text-blue-700 mt-4 text-center">{progress.currentStep}</p>
              </div>
            )}

            {/* AI Capabilities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 border border-blue-200 rounded-xl bg-blue-50">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-blue-600 mr-2" />
                  <h5 className="font-semibold text-blue-900">Smart Template Mapping</h5>
                </div>
                <p className="text-sm text-blue-700">
                  AI analyzes your fields and intelligently maps them to {marketplaces.find(m => m.id === selectedMarketplace)?.name} requirements
                </p>
              </div>
              
              <div className="p-4 border border-purple-200 rounded-xl bg-purple-50">
                <div className="flex items-center mb-2">
                  <Brain className="w-5 h-5 text-purple-600 mr-2" />
                  <h5 className="font-semibold text-purple-900">Content Generation</h5>
                </div>
                <p className="text-sm text-purple-700">
                  Generate optimized titles, descriptions, and missing attributes using advanced AI
                </p>
              </div>
              
              <div className="p-4 border border-green-200 rounded-xl bg-green-50">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <h5 className="font-semibold text-green-900">Compliance Validation</h5>
                </div>
                <p className="text-sm text-green-700">
                  Validate against marketplace rules and automatically fix compliance issues
                </p>
              </div>
            </div>

            {/* Start Processing Button */}
            <div className="text-center">
              <button
                onClick={handleAIProcessingStart}
                disabled={processing}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg mx-auto"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing with AI...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Start AI Template Adaptation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && aiResults.length > 0 && (
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">AI Processing Results</h3>
              <div className="flex space-x-3">
                <button 
                  onClick={exportResults}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Enhanced Data
                </button>
                <button 
                  onClick={handleRetryProcessing}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Process Again
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">
                  {aiResults.filter(r => r.confidence > 80).length}
                </p>
                <p className="text-sm text-green-700">High Confidence</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">
                  {aiResults.reduce((sum, r) => sum + r.aiEnhancements.missingFieldsGenerated.length, 0)}
                </p>
                <p className="text-sm text-blue-700">Fields Generated</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">
                  {aiResults.reduce((sum, r) => sum + r.templateAdaptation.mappings.length, 0)}
                </p>
                <p className="text-sm text-purple-700">Adaptations Made</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <p className="text-2xl font-bold text-orange-600">
                  {aiResults.filter(r => r.complianceIssues.length > 0).length}
                </p>
                <p className="text-sm text-orange-700">Need Review</p>
              </div>
            </div>

            {/* Results Preview */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Processing Results Preview</h4>
              {aiResults.slice(0, 5).map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                     onClick={() => toast.info(`Viewing details for ${result.originalData.sku}`)}>
                  <div className="flex items-center space-x-3">
                    {result.confidence > 80 ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : result.confidence > 60 ? (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {result.originalData.sku || `Product ${index + 1}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {result.aiEnhancements.missingFieldsGenerated.length} fields generated • 
                        {result.templateAdaptation.mappings.length} adaptations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{result.confidence}%</p>
                      <p className="text-sm text-gray-600">Confidence</p>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
              {aiResults.length > 5 && (
                <p className="text-center text-gray-600 text-sm">
                  And {aiResults.length - 5} more products processed...
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default UploadInterface;