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
  Brain
} from 'lucide-react';
import FileUploadZone from './FileUploadZone';
import AIProcessingInterface from './AIProcessingInterface';
import { FileProcessingResult } from '../services/fileProcessingService';
import { ProductData, AIProcessingResult } from '../services/aiService';
import { useAuth } from '../hooks/useFirebase';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';

const UploadInterface = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [fileResult, setFileResult] = useState<FileProcessingResult | null>(null);
  const [selectedMarketplace, setSelectedMarketplace] = useState('namshi');
  const [aiResults, setAIResults] = useState<AIProcessingResult[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const { user, userProfile } = useAuth();

  const marketplaces = [
    { id: 'namshi', name: 'Namshi', color: 'bg-purple-500' },
    { id: 'centrepoint', name: 'Centrepoint', color: 'bg-blue-500' },
    { id: 'amazon', name: 'Amazon', color: 'bg-orange-500' },
    { id: 'noon', name: 'Noon', color: 'bg-yellow-500' },
    { id: 'trendyol', name: 'Trendyol', color: 'bg-red-500' },
    { id: 'sixthstreet', name: '6th Street', color: 'bg-green-500' },
  ];

  const handleFileProcessed = (result: FileProcessingResult) => {
    setFileResult(result);
    if (result.validRows > 0) {
      setActiveTab('ai-processing');
      toast.success(`File processed successfully! ${result.validRows} products ready for AI processing.`);
    }
  };

  const handleAIProcessingComplete = (results: AIProcessingResult[]) => {
    setAIResults(results);
    toast.success('AI processing completed! Review results and export when ready.');
  };

  const handleProcessingStart = () => {
    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true);
      return;
    }
  };

  const exportResults = () => {
    if (aiResults.length === 0) {
      toast.error('No processed data to export');
      return;
    }

    // Create export data
    const exportData = aiResults.map((result, index) => ({
      sku: fileResult?.data[index]?.sku || `SKU_${index + 1}`,
      ...result.generatedContent,
      confidence: result.confidence,
      issues: result.complianceIssues.join('; '),
      mappings_applied: result.mappings.length
    }));

    // Convert to CSV
    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMarketplace}_processed_catalog_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Export completed successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Ingestion & AI Processing</h1>
          <p className="text-gray-600">Upload your product catalogs and let AI optimize them for marketplaces</p>
        </div>
        <div className="flex space-x-3">
          {!user && (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          )}
          {aiResults.length > 0 && (
            <button 
              onClick={exportResults}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </button>
          )}
        </div>
      </div>

      {/* User Status */}
      {user && userProfile && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-800">
              Signed in as {userProfile.name} ({userProfile.role})
            </span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'upload', label: 'File Upload', icon: Upload },
            { id: 'ai-processing', label: 'AI Processing', icon: Brain, disabled: !fileResult },
            { id: 'history', label: 'Processing History', icon: Eye }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : tab.disabled
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Marketplace Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Target Marketplace</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <FileUploadZone
            onFileProcessed={handleFileProcessed}
            onProcessingStart={handleProcessingStart}
          />

          {/* File Processing Results */}
          {fileResult && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">File Processing Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{fileResult.totalRows}</p>
                  <p className="text-sm text-blue-700">Total Rows</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{fileResult.validRows}</p>
                  <p className="text-sm text-green-700">Valid Products</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{fileResult.errors.length}</p>
                  <p className="text-sm text-red-700">Errors</p>
                </div>
              </div>

              {fileResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-red-800 mb-2">Processing Errors:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {fileResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {fileResult.errors.length > 5 && (
                      <li>• And {fileResult.errors.length - 5} more errors...</li>
                    )}
                  </ul>
                </div>
              )}

              {fileResult.validRows > 0 && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setActiveTab('ai-processing')}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Proceed to AI Processing
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Expected Fields */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Fields</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                'SKU ID', 'Product Title', 'Brand', 'Category', 'Material', 
                'Gender', 'Color', 'Size', 'Price', 'Description', 'Images', 'Weight'
              ].map((field) => (
                <span key={field} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                  {field}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Missing fields will be auto-completed by our AI system
            </p>
          </div>
        </div>
      )}

      {activeTab === 'ai-processing' && fileResult && (
        <AIProcessingInterface
          products={fileResult.data}
          selectedMarketplace={selectedMarketplace}
          onProcessingComplete={handleAIProcessingComplete}
          onProcessingStart={handleProcessingStart}
        />
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing History</h3>
          <div className="text-center py-12">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No processing history available</p>
            <p className="text-sm text-gray-500 mt-2">
              {user ? 'Start by uploading a file to see your processing history' : 'Sign in to view your processing history'}
            </p>
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