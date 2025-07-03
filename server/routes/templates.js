import express from 'express';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Marketplace templates with enhanced attributes
let templates = [
  {
    id: 'namshi_v3',
    name: 'Namshi Fashion Template',
    version: '3.0',
    marketplace: 'namshi',
    category: 'fashion',
    attributes: [
      { name: 'title', type: 'string', required: true, validation: { maxLength: 200 }, priority: 95 },
      { name: 'brand', type: 'string', required: true, priority: 90 },
      { name: 'category', type: 'string', required: true, priority: 85 },
      { name: 'gender', type: 'string', required: true, validation: { enum: ['Men', 'Women', 'Kids', 'Unisex'] }, priority: 80 },
      { name: 'color', type: 'string', required: true, priority: 80 },
      { name: 'size', type: 'string', required: false, priority: 75 },
      { name: 'material', type: 'string', required: false, priority: 70 },
      { name: 'description', type: 'string', required: true, validation: { maxLength: 1000 }, priority: 85 },
      { name: 'price', type: 'number', required: true, validation: { min: 0 }, priority: 90 },
      { name: 'images', type: 'array', required: true, priority: 85 },
      { name: 'season', type: 'string', required: false, validation: { enum: ['Spring', 'Summer', 'Fall', 'Winter'] }, priority: 60 },
      { name: 'style', type: 'string', required: false, priority: 60 },
      { name: 'care_instructions', type: 'string', required: false, priority: 55 },
      { name: 'sustainability_info', type: 'string', required: false, priority: 50 }
    ],
    imageSpecs: { width: 1000, height: 1333, format: 'JPEG', maxSize: '2MB', aspectRatio: '3:4' },
    rules: {
      categoryMappings: {
        'T-Shirts': 'Tops/T-Shirts',
        'Dresses': 'Clothing/Dresses',
        'Shoes': 'Footwear/Shoes'
      },
      valueMappings: {
        gender: { 'M': 'Men', 'F': 'Women', 'U': 'Unisex' }
      }
    },
    lastUpdated: new Date(),
    isActive: true,
    performance: {
      accuracy: 96.2,
      processingSpeed: 847,
      successRate: 94.8
    }
  },
  {
    id: 'amazon_v4',
    name: 'Amazon Marketplace Template',
    version: '4.2',
    marketplace: 'amazon',
    category: 'general',
    attributes: [
      { name: 'item_name', type: 'string', required: true, validation: { maxLength: 500 }, priority: 95 },
      { name: 'brand_name', type: 'string', required: true, priority: 90 },
      { name: 'item_type', type: 'string', required: true, priority: 85 },
      { name: 'department_name', type: 'string', required: true, validation: { enum: ['mens', 'womens', 'boys', 'girls', 'baby', 'unisex'] }, priority: 80 },
      { name: 'color_name', type: 'string', required: true, priority: 80 },
      { name: 'size_name', type: 'string', required: false, priority: 75 },
      { name: 'material_type', type: 'string', required: false, priority: 70 },
      { name: 'product_description', type: 'string', required: true, validation: { maxLength: 2000 }, priority: 85 },
      { name: 'list_price', type: 'number', required: true, validation: { min: 0 }, priority: 90 },
      { name: 'main_image_url', type: 'string', required: true, priority: 90 },
      { name: 'bullet_point1', type: 'string', required: false, validation: { maxLength: 255 }, priority: 75 },
      { name: 'search_terms', type: 'string', required: false, validation: { maxLength: 1000 }, priority: 65 }
    ],
    imageSpecs: { width: 1000, height: 1000, format: 'JPEG', maxSize: '10MB', aspectRatio: '1:1' },
    rules: {
      categoryMappings: {
        'T-Shirts': 'Clothing/Shirts/T-Shirts',
        'Dresses': 'Clothing/Dresses'
      },
      valueMappings: {
        department_name: { 'Men': 'mens', 'Women': 'womens' }
      }
    },
    lastUpdated: new Date(),
    isActive: true,
    performance: {
      accuracy: 89.3,
      processingSpeed: 1200,
      successRate: 87.6
    }
  }
];

// Get all templates
router.get('/', authenticateToken, (req, res) => {
  const { marketplace, category } = req.query;
  
  let filteredTemplates = templates.filter(t => t.isActive);
  
  if (marketplace) {
    filteredTemplates = filteredTemplates.filter(t => t.marketplace === marketplace);
  }
  
  if (category) {
    filteredTemplates = filteredTemplates.filter(t => t.category === category);
  }
  
  res.json(filteredTemplates);
});

// Get template by ID
router.get('/:id', authenticateToken, (req, res) => {
  const template = templates.find(t => t.id === req.params.id);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json(template);
});

// Create new template
router.post('/', authenticateToken, (req, res) => {
  const template = {
    id: `template_${Date.now()}`,
    ...req.body,
    lastUpdated: new Date(),
    isActive: true,
    performance: {
      accuracy: 0,
      processingSpeed: 0,
      successRate: 0
    }
  };
  
  templates.push(template);
  res.status(201).json(template);
});

// Update template
router.put('/:id', authenticateToken, (req, res) => {
  const index = templates.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  templates[index] = {
    ...templates[index],
    ...req.body,
    lastUpdated: new Date()
  };
  
  res.json(templates[index]);
});

// Delete template
router.delete('/:id', authenticateToken, (req, res) => {
  const index = templates.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  templates[index].isActive = false;
  res.json({ message: 'Template deactivated successfully' });
});

// Get marketplace performance
router.get('/marketplace/:marketplace/performance', authenticateToken, (req, res) => {
  const marketplaceTemplates = templates.filter(t => 
    t.marketplace === req.params.marketplace && t.isActive
  );
  
  if (marketplaceTemplates.length === 0) {
    return res.status(404).json({ error: 'Marketplace not found' });
  }
  
  const performance = marketplaceTemplates.reduce((acc, template) => {
    acc.accuracy += template.performance.accuracy;
    acc.processingSpeed += template.performance.processingSpeed;
    acc.successRate += template.performance.successRate;
    return acc;
  }, { accuracy: 0, processingSpeed: 0, successRate: 0 });
  
  const count = marketplaceTemplates.length;
  res.json({
    marketplace: req.params.marketplace,
    averageAccuracy: performance.accuracy / count,
    averageProcessingSpeed: performance.processingSpeed / count,
    averageSuccessRate: performance.successRate / count,
    templateCount: count
  });
});

export default router;