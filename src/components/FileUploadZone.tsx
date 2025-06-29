import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { fileProcessingService, FileProcessingResult } from '../services/fileProcessingService';
import toast from 'react-hot-toast';

interface FileUploadZoneProps {
  onFileProcessed: (result: FileProcessingResult) => void;
  onProcessingStart: () => void;
  disabled?: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileProcessed,
  onProcessingStart,
  disabled = false
}) => {
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file format
    const validation = fileProcessingService.validateFileFormat(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file format');
      return;
    }

    setProcessing(true);
    onProcessingStart();

    try {
      let result: FileProcessingResult;

      if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        result = await fileProcessingService.processExcelFile(file);
      } else if (file.type.includes('csv') || file.name.endsWith('.csv')) {
        result = await fileProcessingService.processCSVFile(file);
      } else {
        throw new Error('Unsupported file format');
      }

      if (result.errors.length > 0) {
        toast.error(`File processed with ${result.errors.length} errors`);
      } else {
        toast.success(`Successfully processed ${result.validRows} products`);
      }

      onFileProcessed(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process file';
      toast.error(errorMessage);
      console.error('File processing error:', error);
    } finally {
      setProcessing(false);
    }
  }, [onFileProcessed, onProcessingStart]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/csv': ['.csv']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: disabled || processing
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
        ${isDragActive && !isDragReject ? 'border-blue-400 bg-blue-50' : ''}
        ${isDragReject ? 'border-red-400 bg-red-50' : ''}
        ${!isDragActive && !isDragReject ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50' : ''}
        ${disabled || processing ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      {processing ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing File...</h3>
          <p className="text-gray-600">Please wait while we analyze your data</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {isDragReject ? (
            <>
              <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">Invalid File Type</h3>
              <p className="text-red-600 mb-4">Please upload Excel (.xlsx, .xls) or CSV files only</p>
            </>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isDragActive ? 'Drop your file here' : 'Drag & drop your catalog file'}
              </h3>
              <p className="text-gray-600 mb-6">
                Or click to select from your computer
              </p>
            </>
          )}
          
          {!isDragReject && (
            <button 
              type="button"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={disabled || processing}
            >
              Choose File
            </button>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center">
          <FileSpreadsheet className="w-4 h-4 mr-1" />
          Excel (.xlsx, .xls)
        </div>
        <div className="flex items-center">
          <FileSpreadsheet className="w-4 h-4 mr-1" />
          CSV (.csv)
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-4">
        Maximum file size: 50MB
      </p>
    </div>
  );
};

export default FileUploadZone;