import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Zap,
  Brain,
  Target,
  TrendingUp,
  Activity,
  Cpu,
  Database
} from 'lucide-react';
import { useProcessingJob, useRealTimeProcessing } from '../../hooks/useApi';
import toast from 'react-hot-toast';

interface RealTimeProcessingProps {
  jobId: string;
  onComplete?: (results: any) => void;
  onError?: (error: string) => void;
}

const RealTimeProcessing: React.FC<RealTimeProcessingProps> = ({
  jobId,
  onComplete,
  onError
}) => {
  const { data: job, isLoading } = useProcessingJob(jobId);
  const { isConnected } = useRealTimeProcessing(jobId);
  const [metrics, setMetrics] = useState({
    itemsPerSecond: 0,
    averageConfidence: 0,
    memoryUsage: 0,
    cpuUsage: 0
  });

  useEffect(() => {
    if (job?.status === 'completed' && onComplete) {
      onComplete(job);
    } else if (job?.status === 'failed' && onError) {
      onError(job.errorMessage || 'Processing failed');
    }
  }, [job?.status, onComplete, onError]);

  // Simulate real-time metrics
  useEffect(() => {
    if (job?.status === 'processing') {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          itemsPerSecond: 2 + Math.random() * 3,
          averageConfidence: 85 + Math.random() * 10,
          memoryUsage: 40 + Math.random() * 20,
          cpuUsage: 60 + Math.random() * 30
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [job?.status]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center p-8 text-gray-500">
        Processing job not found
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'processing': return <Clock className="w-5 h-5 animate-spin" />;
      case 'failed': return <AlertTriangle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center px-3 py-2 rounded-full ${getStatusColor(job.status)}`}>
              {getStatusIcon(job.status)}
              <span className="ml-2 font-medium capitalize">{job.status}</span>
            </div>
            {isConnected && job.status === 'processing' && (
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm">Live</span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Job ID: {job.id}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">
              {job.progress?.currentStep || 'Processing...'}
            </span>
            <span className="text-sm text-gray-600">
              {job.progress?.percentage || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-blue-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${job.progress?.percentage || 0}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{job.processedSkus}</div>
            <div className="text-sm text-gray-600">Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{job.successfulSkus}</div>
            <div className="text-sm text-gray-600">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{job.failedSkus}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{job.totalSkus - job.processedSkus}</div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
        </div>

        {/* ETA */}
        {job.status === 'processing' && job.progress?.estimatedTimeRemaining && (
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Estimated time remaining: {Math.floor(job.progress.estimatedTimeRemaining / 60)}m {job.progress.estimatedTimeRemaining % 60}s
            </span>
          </div>
        )}
      </div>

      {/* Real-time Metrics */}
      {job.status === 'processing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.itemsPerSecond.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Items/sec</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.averageConfidence.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg Confidence</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Database className="w-5 h-5 text-orange-600" />
              <div className="text-xs text-gray-500">{metrics.memoryUsage.toFixed(0)}%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {(metrics.memoryUsage * 2.4 / 100).toFixed(1)}GB
            </div>
            <div className="text-sm text-gray-600">Memory</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Cpu className="w-5 h-5 text-purple-600" />
              <div className="text-xs text-gray-500">{metrics.cpuUsage.toFixed(0)}%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {(metrics.cpuUsage / 100 * 8).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">CPU Cores</div>
          </motion.div>
        </div>
      )}

      {/* AI Processing Stages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Processing Pipeline</h3>
        <div className="space-y-4">
          {[
            { stage: 'Data Analysis', icon: Brain, status: 'completed', description: 'Analyzing product data structure' },
            { stage: 'Template Mapping', icon: Target, status: job.progress?.percentage > 25 ? 'completed' : 'processing', description: 'Intelligent field mapping' },
            { stage: 'Content Generation', icon: Zap, status: job.progress?.percentage > 50 ? 'completed' : job.progress?.percentage > 25 ? 'processing' : 'pending', description: 'AI-powered content enhancement' },
            { stage: 'Quality Validation', icon: CheckCircle, status: job.progress?.percentage > 75 ? 'completed' : job.progress?.percentage > 50 ? 'processing' : 'pending', description: 'Compliance and quality checks' }
          ].map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  stage.status === 'completed' ? 'bg-green-100 text-green-600' :
                  stage.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{stage.stage}</h4>
                    {stage.status === 'processing' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{stage.description}</p>
                </div>
                <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                  stage.status === 'completed' ? 'bg-green-100 text-green-700' :
                  stage.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {stage.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Display */}
      {job.status === 'failed' && job.errorMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Processing Failed</h3>
          </div>
          <p className="text-red-700 mb-4">{job.errorMessage}</p>
          <button
            onClick={() => toast.info('Retry functionality would be implemented here')}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Retry Processing
          </button>
        </motion.div>
      )}

      {/* Success Display */}
      {job.status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Processing Completed</h3>
          </div>
          <p className="text-green-700 mb-4">
            Successfully processed {job.successfulSkus} out of {job.totalSkus} items
            {job.failedSkus > 0 && ` (${job.failedSkus} failed)`}
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => toast.info('View results functionality would be implemented here')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              View Results
            </button>
            <button
              onClick={() => toast.info('Export functionality would be implemented here')}
              className="flex items-center px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RealTimeProcessing;