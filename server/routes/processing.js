import express from 'express';
import { authenticateToken } from './auth.js';

const router = express.Router();

// In-memory storage for processing jobs
let processingJobs = [];
let processedData = [];

// Create processing job
router.post('/jobs', authenticateToken, async (req, res) => {
  try {
    const { fileName, marketplace, data, options = {} } = req.body;
    
    const job = {
      id: `job_${Date.now()}`,
      userId: req.user.userId,
      fileName,
      marketplace,
      status: 'pending',
      totalSkus: data.length,
      processedSkus: 0,
      successfulSkus: 0,
      failedSkus: 0,
      createdAt: new Date(),
      options,
      progress: {
        currentStep: 'Initializing',
        percentage: 0,
        estimatedTimeRemaining: 0
      }
    };
    
    processingJobs.push(job);
    
    // Start processing asynchronously
    processDataAsync(job, data);
    
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create processing job' });
  }
});

// Get processing job status
router.get('/jobs/:id', authenticateToken, (req, res) => {
  const job = processingJobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

// Get user's processing jobs
router.get('/jobs', authenticateToken, (req, res) => {
  const userJobs = processingJobs.filter(j => j.userId === req.user.userId);
  res.json(userJobs);
});

// Get processed data
router.get('/jobs/:id/results', authenticateToken, (req, res) => {
  const job = processingJobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  const results = processedData.filter(d => d.jobId === job.id);
  res.json(results);
});

// Enhanced AI processing simulation
async function processDataAsync(job, data) {
  const startTime = Date.now();
  
  try {
    job.status = 'processing';
    job.progress.currentStep = 'Analyzing data structure';
    
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      
      // Simulate processing time with realistic delays
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      
      // Update progress
      job.processedSkus = i + 1;
      job.progress.percentage = Math.round((i + 1) / data.length * 100);
      job.progress.currentStep = `Processing ${item.sku || `item ${i + 1}`}`;
      
      // Calculate ETA
      const elapsed = Date.now() - startTime;
      const avgTimePerItem = elapsed / (i + 1);
      const remainingItems = data.length - (i + 1);
      job.progress.estimatedTimeRemaining = Math.round((remainingItems * avgTimePerItem) / 1000);
      
      try {
        // Simulate AI processing with enhanced logic
        const processedItem = await enhancedAIProcessing(item, job.marketplace);
        
        processedData.push({
          jobId: job.id,
          originalData: item,
          processedData: processedItem,
          confidence: processedItem.confidence,
          issues: processedItem.issues || [],
          timestamp: new Date()
        });
        
        job.successfulSkus++;
      } catch (error) {
        job.failedSkus++;
        console.error(`Processing failed for item ${i + 1}:`, error);
      }
    }
    
    job.status = 'completed';
    job.completedAt = new Date();
    job.progress.currentStep = 'Processing completed';
    job.progress.percentage = 100;
    
  } catch (error) {
    job.status = 'failed';
    job.errorMessage = error.message;
    console.error('Job processing failed:', error);
  }
}

// Enhanced AI processing simulation
async function enhancedAIProcessing(item, marketplace) {
  // Simulate advanced AI processing
  const confidence = 70 + Math.random() * 25; // 70-95% confidence
  const issues = [];
  
  // Enhanced field mapping
  const mappedData = { ...item };
  
  // Marketplace-specific transformations
  if (marketplace === 'namshi') {
    if (item.product_name) mappedData.title = item.product_name;
    if (item.target_gender) mappedData.gender = mapGender(item.target_gender);
    if (item.color_name) mappedData.color = item.color_name;
  } else if (marketplace === 'amazon') {
    if (item.title) mappedData.item_name = item.title;
    if (item.brand) mappedData.brand_name = item.brand;
    if (item.gender) mappedData.department_name = mapDepartment(item.gender);
  }
  
  // AI content generation
  if (!mappedData.description && mappedData.title) {
    mappedData.description = generateDescription(mappedData);
  }
  
  // Quality checks
  if (!mappedData.title || mappedData.title.length < 10) {
    issues.push('Title too short or missing');
  }
  
  if (!mappedData.price || mappedData.price <= 0) {
    issues.push('Invalid or missing price');
  }
  
  if (!mappedData.images || mappedData.images.length === 0) {
    issues.push('No product images provided');
  }
  
  return {
    ...mappedData,
    confidence: Math.round(confidence),
    issues,
    aiEnhancements: {
      titleOptimized: item.title !== mappedData.title,
      descriptionGenerated: !item.description && mappedData.description,
      attributesInferred: getInferredAttributes(item, mappedData),
      missingFieldsGenerated: getMissingFields(item, mappedData)
    }
  };
}

// Helper functions
function mapGender(gender) {
  const mapping = { 'M': 'Men', 'F': 'Women', 'U': 'Unisex', 'Male': 'Men', 'Female': 'Women' };
  return mapping[gender] || gender;
}

function mapDepartment(gender) {
  const mapping = { 'Men': 'mens', 'Women': 'womens', 'Kids': 'boys', 'Unisex': 'unisex' };
  return mapping[gender] || 'unisex';
}

function generateDescription(data) {
  const parts = [];
  parts.push(`Premium ${data.category || 'product'} from ${data.brand || 'top brand'}.`);
  
  if (data.material) {
    parts.push(`Crafted from high-quality ${data.material} for comfort and durability.`);
  }
  
  if (data.color) {
    parts.push(`Available in ${data.color} color.`);
  }
  
  parts.push('Perfect for everyday wear and special occasions.');
  
  return parts.join(' ');
}

function getInferredAttributes(original, processed) {
  const inferred = [];
  
  if (!original.gender && processed.gender) inferred.push('gender');
  if (!original.category && processed.category) inferred.push('category');
  if (!original.material && processed.material) inferred.push('material');
  
  return inferred;
}

function getMissingFields(original, processed) {
  const generated = [];
  
  Object.keys(processed).forEach(key => {
    if (!original[key] && processed[key]) {
      generated.push(key);
    }
  });
  
  return generated;
}

// Batch operations
router.post('/batch/approve', authenticateToken, (req, res) => {
  const { jobId, itemIds } = req.body;
  
  const updatedCount = processedData.filter(item => 
    item.jobId === jobId && itemIds.includes(item.originalData.sku)
  ).length;
  
  res.json({ message: `Approved ${updatedCount} items`, updatedCount });
});

router.post('/batch/reject', authenticateToken, (req, res) => {
  const { jobId, itemIds } = req.body;
  
  const updatedCount = processedData.filter(item => 
    item.jobId === jobId && itemIds.includes(item.originalData.sku)
  ).length;
  
  res.json({ message: `Rejected ${updatedCount} items`, updatedCount });
});

export default router;