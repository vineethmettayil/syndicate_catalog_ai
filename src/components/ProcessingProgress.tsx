import React from 'react';
import { CheckCircle, Clock, AlertTriangle, Loader } from 'lucide-react';

interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  details?: string;
}

interface ProcessingProgressProps {
  steps: ProcessingStep[];
  currentStep?: string;
  overallProgress: number;
  totalItems: number;
  processedItems: number;
  successfulItems: number;
  failedItems: number;
}

const ProcessingProgress: React.FC<ProcessingProgressProps> = ({
  steps,
  currentStep,
  overallProgress,
  totalItems,
  processedItems,
  successfulItems,
  failedItems
}) => {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Processing Progress</h3>
          <span className="text-sm text-gray-600">
            {processedItems} of {totalItems} items processed
          </span>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{successfulItems}</p>
            <p className="text-sm text-green-700">Successful</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{failedItems}</p>
            <p className="text-sm text-red-700">Failed</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{totalItems - processedItems}</p>
            <p className="text-sm text-blue-700">Remaining</p>
          </div>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 mb-3">Processing Steps</h4>
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center p-4 rounded-lg border ${getStepColor(step.status)}`}
          >
            <div className="flex-shrink-0 mr-3">
              {getStepIcon(step.status)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">{step.label}</p>
                {step.progress !== undefined && (
                  <span className="text-sm text-gray-600">{step.progress}%</span>
                )}
              </div>
              {step.details && (
                <p className="text-sm text-gray-600 mt-1">{step.details}</p>
              )}
              {step.status === 'processing' && step.progress !== undefined && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${step.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingProgress;