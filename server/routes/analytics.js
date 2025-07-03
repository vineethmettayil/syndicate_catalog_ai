import express from 'express';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', authenticateToken, (req, res) => {
  const { timeRange = '30d' } = req.query;
  
  // Simulate analytics data
  const analytics = {
    overview: {
      totalSkusProcessed: 12847 + Math.floor(Math.random() * 1000),
      successRate: 96.8 + (Math.random() * 2 - 1),
      averageProcessingTime: 847 + Math.floor(Math.random() * 200),
      activeUsers: 23 + Math.floor(Math.random() * 10)
    },
    marketplacePerformance: [
      { name: 'Namshi', processed: 3247, success: 97.8, adaptations: 45, revenue: 45230 },
      { name: 'Amazon', processed: 2891, success: 94.2, adaptations: 38, revenue: 52180 },
      { name: 'Centrepoint', processed: 2156, success: 96.1, adaptations: 29, revenue: 38450 },
      { name: 'Noon', processed: 1834, success: 95.3, adaptations: 22, revenue: 29670 },
      { name: 'Trendyol', processed: 1456, success: 93.7, adaptations: 31, revenue: 22340 },
      { name: '6th Street', processed: 1263, success: 94.9, adaptations: 18, revenue: 18920 }
    ],
    processingTrends: generateTrendData(timeRange),
    aiInsights: [
      {
        title: 'Peak Processing Hours',
        insight: 'Best performance observed between 10 AM - 2 PM UTC',
        recommendation: 'Schedule bulk uploads during these hours for optimal results',
        impact: '+8% success rate'
      },
      {
        title: 'Category Performance',
        insight: 'Fashion items have 97% success rate vs 84% for electronics',
        recommendation: 'Review electronics-specific templates and rules',
        impact: 'Potential +13% improvement'
      }
    ],
    recentActivity: [
      {
        id: 1,
        user: 'Sarah Johnson',
        action: 'Auto-adapted Namshi template v3.0 with 12 new attributes',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        type: 'template'
      },
      {
        id: 2,
        user: 'Michael Chen',
        action: 'AI generated 247 missing product descriptions',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        type: 'ai'
      }
    ]
  };
  
  res.json(analytics);
});

// Get performance metrics
router.get('/performance', authenticateToken, (req, res) => {
  const { marketplace, timeRange = '30d' } = req.query;
  
  const metrics = {
    processingSpeed: {
      current: 847,
      previous: 723,
      trend: 'up',
      data: generateMetricData(12)
    },
    successRate: {
      current: 94.2,
      previous: 92.1,
      trend: 'up',
      data: generateMetricData(12, 85, 98)
    },
    accuracyRate: {
      current: 96.8,
      previous: 95.2,
      trend: 'up',
      data: generateMetricData(12, 90, 99)
    }
  };
  
  if (marketplace) {
    // Filter metrics by marketplace
    metrics.marketplace = marketplace;
  }
  
  res.json(metrics);
});

// Get user activity
router.get('/activity', authenticateToken, (req, res) => {
  const { limit = 50 } = req.query;
  
  const activities = Array.from({ length: limit }, (_, i) => ({
    id: i + 1,
    userId: `user_${Math.floor(Math.random() * 10) + 1}`,
    action: getRandomAction(),
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: getRandomType(),
    metadata: {
      itemsProcessed: Math.floor(Math.random() * 100) + 1,
      marketplace: getRandomMarketplace()
    }
  }));
  
  res.json(activities);
});

// Get export analytics
router.get('/exports', authenticateToken, (req, res) => {
  const exports = {
    totalExports: 1247,
    successfulExports: 1198,
    failedExports: 49,
    averageExportTime: 45, // seconds
    popularFormats: [
      { format: 'CSV', count: 567, percentage: 45.5 },
      { format: 'Excel', count: 423, percentage: 33.9 },
      { format: 'JSON', count: 257, percentage: 20.6 }
    ],
    recentExports: Array.from({ length: 10 }, (_, i) => ({
      id: `export_${i + 1}`,
      fileName: `export_${Date.now() - i * 3600000}.csv`,
      marketplace: getRandomMarketplace(),
      itemCount: Math.floor(Math.random() * 500) + 50,
      status: Math.random() > 0.1 ? 'completed' : 'failed',
      createdAt: new Date(Date.now() - i * 3600000).toISOString()
    }))
  };
  
  res.json(exports);
});

// Helper functions
function generateTrendData(timeRange) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    processed: Math.floor(Math.random() * 200) + 50,
    successful: Math.floor(Math.random() * 180) + 40,
    failed: Math.floor(Math.random() * 20) + 5
  }));
}

function generateMetricData(count, min = 0, max = 100) {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min)) + min
  );
}

function getRandomAction() {
  const actions = [
    'Processed batch upload',
    'Generated product descriptions',
    'Adapted marketplace template',
    'Exported product data',
    'Reviewed AI suggestions',
    'Updated template mapping'
  ];
  return actions[Math.floor(Math.random() * actions.length)];
}

function getRandomType() {
  const types = ['upload', 'processing', 'export', 'template', 'review'];
  return types[Math.floor(Math.random() * types.length)];
}

function getRandomMarketplace() {
  const marketplaces = ['Namshi', 'Amazon', 'Centrepoint', 'Noon', 'Trendyol', '6th Street'];
  return marketplaces[Math.floor(Math.random() * marketplaces.length)];
}

export default router;