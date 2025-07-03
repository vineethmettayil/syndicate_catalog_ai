import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  X, 
  AlertTriangle, 
  Zap, 
  Target,
  RefreshCw,
  Eye,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FieldMapping {
  id: string;
  sourceField: string;
  targetField: string;
  confidence: number;
  transformation: 'direct' | 'mapped' | 'calculated' | 'generated';
  status: 'pending' | 'approved' | 'rejected';
  aiSuggestion?: string;
}

interface DragDropInterfaceProps {
  sourceFields: string[];
  targetFields: string[];
  initialMappings?: FieldMapping[];
  onMappingsChange: (mappings: FieldMapping[]) => void;
  marketplace: string;
}

const DragDropInterface: React.FC<DragDropInterfaceProps> = ({
  sourceFields,
  targetFields,
  initialMappings = [],
  onMappingsChange,
  marketplace
}) => {
  const [mappings, setMappings] = useState<FieldMapping[]>(initialMappings);
  const [selectedMapping, setSelectedMapping] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Handle mapping creation/update
    if (destination.droppableId.startsWith('target-')) {
      const targetField = destination.droppableId.replace('target-', '');
      const sourceField = draggableId.replace('source-', '');

      const existingMapping = mappings.find(m => m.sourceField === sourceField);
      
      if (existingMapping) {
        // Update existing mapping
        const updatedMappings = mappings.map(m =>
          m.sourceField === sourceField
            ? {
                ...m,
                targetField,
                confidence: calculateConfidence(sourceField, targetField),
                transformation: determineTransformation(sourceField, targetField),
                status: 'pending' as const
              }
            : m
        );
        setMappings(updatedMappings);
        onMappingsChange(updatedMappings);
      } else {
        // Create new mapping
        const newMapping: FieldMapping = {
          id: `mapping-${Date.now()}`,
          sourceField,
          targetField,
          confidence: calculateConfidence(sourceField, targetField),
          transformation: determineTransformation(sourceField, targetField),
          status: 'pending',
          aiSuggestion: generateAISuggestion(sourceField, targetField)
        };
        
        const updatedMappings = [...mappings, newMapping];
        setMappings(updatedMappings);
        onMappingsChange(updatedMappings);
      }

      toast.success(`Mapped ${sourceField} → ${targetField}`);
    }
  }, [mappings, onMappingsChange]);

  const calculateConfidence = (source: string, target: string): number => {
    // Simple confidence calculation based on string similarity
    const similarity = calculateStringSimilarity(source.toLowerCase(), target.toLowerCase());
    return Math.round(similarity * 100);
  };

  const calculateStringSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const determineTransformation = (source: string, target: string): FieldMapping['transformation'] => {
    if (source.toLowerCase() === target.toLowerCase()) return 'direct';
    if (source.includes('price') && target.includes('price')) return 'calculated';
    if (source.includes('category') && target.includes('type')) return 'mapped';
    return 'generated';
  };

  const generateAISuggestion = (source: string, target: string): string => {
    const suggestions = [
      `Direct mapping from ${source} to ${target}`,
      `Transform ${source} format to match ${target} requirements`,
      `Apply ${marketplace} specific rules for ${target}`,
      `Generate enhanced ${target} based on ${source} data`
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const handleMappingAction = (mappingId: string, action: 'approve' | 'reject' | 'edit') => {
    const updatedMappings = mappings.map(m =>
      m.id === mappingId
        ? { ...m, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : m.status }
        : m
    );
    setMappings(updatedMappings);
    onMappingsChange(updatedMappings);

    if (action === 'edit') {
      setSelectedMapping(mappingId);
    } else {
      toast.success(`Mapping ${action}d successfully`);
    }
  };

  const getTransformationIcon = (transformation: FieldMapping['transformation']) => {
    switch (transformation) {
      case 'direct': return <Target className="w-4 h-4 text-green-500" />;
      case 'mapped': return <RefreshCw className="w-4 h-4 text-blue-500" />;
      case 'calculated': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'generated': return <Settings className="w-4 h-4 text-purple-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50';
    if (confidence >= 70) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const unmappedSourceFields = sourceFields.filter(field => 
    !mappings.some(m => m.sourceField === field)
  );

  const unmappedTargetFields = targetFields.filter(field => 
    !mappings.some(m => m.targetField === field)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Intelligent Field Mapping</h3>
          <p className="text-sm text-gray-600">Drag source fields to target fields to create mappings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Settings className="w-4 h-4 mr-1" />
            Advanced
          </button>
          <div className="text-sm text-gray-600">
            {mappings.length} mappings created
          </div>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Source Fields */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Source Fields</h4>
            <Droppable droppableId="source-fields">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-2 min-h-[200px] p-4 border-2 border-dashed rounded-lg transition-colors ${
                    snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  {unmappedSourceFields.map((field, index) => (
                    <Draggable key={field} draggableId={`source-${field}`} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 bg-white border rounded-lg shadow-sm cursor-move transition-all ${
                            snapshot.isDragging ? 'shadow-lg scale-105 rotate-2' : 'hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{field}</span>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Mappings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Active Mappings</h4>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {mappings.map((mapping) => (
                  <motion.div
                    key={mapping.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-4 border rounded-lg transition-all ${
                      mapping.status === 'approved' ? 'border-green-200 bg-green-50' :
                      mapping.status === 'rejected' ? 'border-red-200 bg-red-50' :
                      'border-gray-200 bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getTransformationIcon(mapping.transformation)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(mapping.confidence)}`}>
                          {mapping.confidence}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {mapping.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleMappingAction(mapping.id, 'approve')}
                              className="p-1 text-green-600 hover:bg-green-100 rounded"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMappingAction(mapping.id, 'reject')}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleMappingAction(mapping.id, 'edit')}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <code className="px-2 py-1 bg-gray-100 rounded text-gray-800">
                        {mapping.sourceField}
                      </code>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <code className="px-2 py-1 bg-blue-100 rounded text-blue-800">
                        {mapping.targetField}
                      </code>
                    </div>
                    
                    {mapping.aiSuggestion && (
                      <p className="text-xs text-gray-600 mt-2">{mapping.aiSuggestion}</p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Target Fields */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Target Fields ({marketplace})</h4>
            <div className="space-y-2">
              {targetFields.map((field) => {
                const mapping = mappings.find(m => m.targetField === field);
                return (
                  <Droppable key={field} droppableId={`target-${field}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-3 border-2 border-dashed rounded-lg transition-all ${
                          snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50' :
                          mapping ? 'border-green-400 bg-green-50' : 'border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{field}</span>
                          {mapping && (
                            <div className="flex items-center space-x-2">
                              {getTransformationIcon(mapping.transformation)}
                              <span className="text-xs text-green-600">Mapped</span>
                            </div>
                          )}
                        </div>
                        {mapping && (
                          <div className="mt-2 text-xs text-gray-600">
                            from: {mapping.sourceField}
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* Advanced Options */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 rounded-lg p-4 space-y-4"
        >
          <h5 className="font-medium text-gray-900">Advanced Mapping Options</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confidence Threshold
              </label>
              <input
                type="range"
                min="50"
                max="100"
                defaultValue="70"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-approve High Confidence
              </label>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="font-medium text-blue-900">Mapping Progress:</span>
              <span className="ml-2 text-blue-700">
                {mappings.filter(m => m.status === 'approved').length} approved,
                {mappings.filter(m => m.status === 'pending').length} pending,
                {mappings.filter(m => m.status === 'rejected').length} rejected
              </span>
            </div>
          </div>
          <div className="text-sm text-blue-700">
            {unmappedTargetFields.length} fields remaining
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDropInterface;