import React, { useState, useEffect } from 'react';
import { Brain, Target, Wand2, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { aiService, ProductData, AIProcessingResult } from '../services/aiService';
import { firebaseService } from '../services/firebaseService';
import ProcessingProgress from './ProcessingProgress';
import toast from 'react-hot-toast';

interface AIProcessingInterfaceProps {
  products: ProductData[];
  selectedMarketplace: string;
  onProcessingComplete: (results: AIProcessingResult[]) => void;
  onProcessingStart: () => void;
}

const AIProcessingInterface: React.FC<AIProcessingInterfaceProps> = ({
  products,
  selectedMarketplace,
  onProcessingComplete,
  onProcessingStart
}) => {
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<AIProcessingResult[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  const processingSteps = [
    { id: 'field_mapping', label: 'AI Field Mapping', status: 'pending' as const },
    { id: 'content_generation', label: 'Content Generation', status: 'pending' as const },
    { id: 'compliance_check', label: 'Compliance Validation', status: 'pending' as const },
    { id: 'quality_review', label: 'Quality Assessment', status: 'pending' as const }
  ];

  const [steps, setSteps] = useState(processingSteps);

  const updateStepStatus = (stepId: string, status: 'pending' | 'processing' | 'completed' | 'failed', progress?: number) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, progress }
        : step
    ));
    setCurrentStep(stepId);
  };

  const startProcessing = async () => {
    if (products.length === 0) {
      toast.error('No products to process');
      return;
    }

    setProcessing(true);
    onProcessingStart();
    setResults([]);
    setProcessedCount(0);
    setSuccessCount(0);
    setFailedCount(0);
    setProgress(0);

    try {
      // Reset steps
      setSteps(processingSteps);

      // Step 1: Field Mapping
      updateStepStatus('field_mapping', 'processing');
      toast.success('Starting AI field mapping...');

      // Step 2: Content Generation & Processing
      updateStepStatus('content_generation', 'processing');
      
      const processedResults = await aiService.batchProcessProducts(
        products,
        selectedMarketplace,
        (processed, total) => {
          const progressPercent = Math.round((processed / total) * 100);
          setProgress(progressPercent);
          setProcessedCount(processed);
          
          // Update success/failed counts based on results
          const currentResults = results.slice(0, processed);
          const successful = currentResults.filter(r => r.confidence > 70).length;
          const failed = currentResults.filter(r => r.confidence <= 70).length;
          setSuccessCount(successful);
          setFailedCount(failed);
        }
      );

      updateStepStatus('field_mapping', 'completed');
      updateStepStatus('content_generation', 'completed');

      // Step 3: Compliance Check
      updateStepStatus('compliance_check', 'processing');
      
      // Additional compliance validation
      const finalResults = processedResults.map(result => {
        const additionalIssues: string[] = [];
        
        // Check for missing critical fields
        if (!result.generatedContent.title) {
          additionalIssues.push('Missing product title');
        }
        if (!result.generatedContent.description) {
          additionalIssues.push('Missing product description');
        }

        return {
          ...result,
          complianceIssues: [...result.complianceIssues, ...additionalIssues]
        };
      });

      updateStepStatus('compliance_check', 'completed');

      // Step 4: Quality Review
      updateStepStatus('quality_review', 'processing');
      
      // Calculate final stats
      const finalSuccessCount = finalResults.filter(r => r.confidence > 70 && r.complianceIssues.length === 0).length;
      const finalFailedCount = finalResults.length - finalSuccessCount;
      
      setSuccessCount(finalSuccessCount);
      setFailedCount(finalFailedCount);
      
      updateStepStatus('quality_review', 'completed');

      setResults(finalResults);
      onProcessingComplete(finalResults);

      toast.success(`Processing completed! ${finalSuccessCount} products ready for export.`);

    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Processing failed. Please try again.');
      
      // Mark current step as failed
      if (currentStep) {
        updateStepStatus(currentStep, 'failed');
      }
    } finally {
      setProcessing(false);
    }
  };

  const getMarketplaceTemplate = () => {
    return aiService.getMarketplaceTemplate(selectedMarketplace);
  };

  const template = getMarketplaceTemplate();

  return (
    <div className="space-y-6">
      {/* AI Processing Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Processing Engine</h3>
              <p className="text-gray-600">
                Intelligent mapping and optimization for {selectedMarketplace}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{products.length}</p>
            <p className="text-sm text-gray-600">Products Ready</p>
          </div>
        </div>
      </div>

      {/* Marketplace Template Info */}
      {template && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {template.name} Template Requirements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Required Fields</h5>
              <div className="space-y-1">
                {Object.entries(template.fields)
                  .filter(([_, config]) => config.required)
                  .map(([field, config]) => (
                    <div key={field} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-gray-700">{field}</span>
                      {config.maxLength && (
                        <span className="text-gray-500 ml-2">
                          (max {config.maxLength} chars)
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Image Specifications</h5>
              <div className="space-y-1 text-sm text-gray-700">
                <p>Dimensions: {template.imageSpecs.width}×{template.imageSpecs.height}</p>
                <p>Format: {template.imageSpecs.format}</p>
                <p>Max Size: {template.imageSpecs.maxSize}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">AI Processing Options</h4>
          <button
            onClick={startProcessing}
            disabled={processing || products.length === 0}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Wand2 className="w-5 h-5 mr-2" />
            {processing ? 'Processing...' : 'Start AI Processing'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-blue-600 mr-2" />
              <h5 className="font-medium text-gray-900">Smart Mapping</h5>
            </div>
            <p className="text-sm text-gray-600">
              AI analyzes your fields and maps them to {selectedMarketplace} requirements
            </p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Brain className="w-5 h-5 text-purple-600 mr-2" />
              <h5 className="font-medium text-gray-900">Content Enhancement</h5>
            </div>
            <p className="text-sm text-gray-600">
              Generate optimized titles, descriptions, and missing attributes
            </p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h5 className="font-medium text-gray-900">Compliance Check</h5>
            </div>
            <p className="text-sm text-gray-600">
              Validate against marketplace rules and highlight issues
            </p>
          </div>
        </div>
      </div>

      {/* Processing Progress */}
      {(processing || results.length > 0) && (
        <ProcessingProgress
          steps={steps}
          currentStep={currentStep}
          overallProgress={progress}
          totalItems={products.length}
          processedItems={processedCount}
          successfulItems={successCount}
          failedItems={failedCount}
        />
      )}

      {/* Results Preview */}
      {results.length > 0 && !processing && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Processing Results</h4>
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{successCount}</p>
              <p className="text-sm text-green-700">Ready for Export</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {results.filter(r => r.complianceIssues.length > 0).length}
              </p>
              <p className="text-sm text-orange-700">Need Review</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{failedCount}</p>
              <p className="text-sm text-red-700">Failed Processing</p>
            </div>
          </div>

          <div className="space-y-3">
            {results.slice(0, 5).map((result, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {result.confidence > 70 && result.complianceIssues.length === 0 ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      Product {index + 1}
                    </p>
                    <p className="text-sm text-gray-600">
                      {result.complianceIssues.length > 0 
                        ? `${result.complianceIssues.length} issues found`
                        : 'Ready for export'
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{result.confidence}%</p>
                  <p className="text-sm text-gray-600">Confidence</p>
                </div>
              </div>
            ))}
            {results.length > 5 && (
              <p className="text-center text-gray-600 text-sm">
                And {results.length - 5} more products...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIProcessingInterface;