import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

export interface ProductData {
  sku: string;
  title: string;
  brand: string;
  category: string;
  material?: string;
  gender?: string;
  color?: string;
  size?: string;
  description?: string;
  price?: number;
  images?: string[];
  [key: string]: any;
}

export interface MarketplaceTemplate {
  name: string;
  fields: {
    [key: string]: {
      required: boolean;
      type: 'string' | 'number' | 'array' | 'boolean';
      maxLength?: number;
      validation?: string[];
    };
  };
  imageSpecs: {
    width: number;
    height: number;
    format: string;
    maxSize: string;
  };
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  confidence: number;
  transformation?: string;
  aiSuggestion?: string;
}

export interface AIProcessingResult {
  mappings: FieldMapping[];
  generatedContent: {
    [key: string]: string;
  };
  complianceIssues: string[];
  confidence: number;
}

class AIService {
  // Marketplace templates configuration
  private marketplaceTemplates: { [key: string]: MarketplaceTemplate } = {
    namshi: {
      name: 'Namshi',
      fields: {
        title: { required: true, type: 'string', maxLength: 200 },
        brand: { required: true, type: 'string' },
        category: { required: true, type: 'string' },
        gender: { required: true, type: 'string', validation: ['Men', 'Women', 'Kids', 'Unisex'] },
        color: { required: true, type: 'string' },
        size: { required: false, type: 'string' },
        material: { required: false, type: 'string' },
        description: { required: true, type: 'string', maxLength: 1000 },
        price: { required: true, type: 'number' },
        images: { required: true, type: 'array' }
      },
      imageSpecs: {
        width: 1000,
        height: 1333,
        format: 'JPEG',
        maxSize: '2MB'
      }
    },
    centrepoint: {
      name: 'Centrepoint',
      fields: {
        product_name: { required: true, type: 'string', maxLength: 150 },
        brand_name: { required: true, type: 'string' },
        product_type: { required: true, type: 'string' },
        target_gender: { required: true, type: 'string', validation: ['Male', 'Female', 'Kids', 'Unisex'] },
        primary_color: { required: true, type: 'string' },
        size_info: { required: false, type: 'string' },
        fabric_material: { required: false, type: 'string' },
        product_description: { required: true, type: 'string', maxLength: 800 },
        selling_price: { required: true, type: 'number' },
        image_urls: { required: true, type: 'array' }
      },
      imageSpecs: {
        width: 1080,
        height: 1080,
        format: 'JPEG',
        maxSize: '1.5MB'
      }
    },
    amazon: {
      name: 'Amazon',
      fields: {
        item_name: { required: true, type: 'string', maxLength: 500 },
        brand_name: { required: true, type: 'string' },
        item_type: { required: true, type: 'string' },
        department_name: { required: true, type: 'string', validation: ['mens', 'womens', 'boys', 'girls', 'baby', 'unisex'] },
        color_name: { required: true, type: 'string' },
        size_name: { required: false, type: 'string' },
        material_type: { required: false, type: 'string' },
        product_description: { required: true, type: 'string', maxLength: 2000 },
        list_price: { required: true, type: 'number' },
        main_image_url: { required: true, type: 'string' },
        other_image_url1: { required: false, type: 'string' }
      },
      imageSpecs: {
        width: 1000,
        height: 1000,
        format: 'JPEG',
        maxSize: '10MB'
      }
    }
  };

  /**
   * Analyze and map fields from source data to target marketplace template
   */
  async mapFieldsWithAI(sourceData: ProductData, marketplace: string): Promise<FieldMapping[]> {
    const template = this.marketplaceTemplates[marketplace];
    if (!template) {
      throw new Error(`Marketplace template not found: ${marketplace}`);
    }

    const sourceFields = Object.keys(sourceData);
    const targetFields = Object.keys(template.fields);

    const prompt = `
You are an expert in e-commerce catalog mapping. Map the source product fields to the target marketplace fields.

Source Fields: ${sourceFields.join(', ')}
Target Fields (${marketplace}): ${targetFields.join(', ')}

Source Data Sample:
${JSON.stringify(sourceData, null, 2)}

Target Template Requirements:
${JSON.stringify(template.fields, null, 2)}

Provide a JSON response with field mappings, including confidence scores (0-100) and any necessary transformations:

{
  "mappings": [
    {
      "sourceField": "source_field_name",
      "targetField": "target_field_name", 
      "confidence": 95,
      "transformation": "description of any needed transformation",
      "aiSuggestion": "explanation of the mapping logic"
    }
  ]
}

Focus on semantic similarity and marketplace-specific naming conventions.
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1500
      });

      const result = JSON.parse(response.choices[0].message.content || '{"mappings": []}');
      return result.mappings || [];
    } catch (error) {
      console.error('AI field mapping error:', error);
      return this.fallbackFieldMapping(sourceData, marketplace);
    }
  }

  /**
   * Generate marketplace-specific content using AI
   */
  async generateMarketplaceContent(productData: ProductData, marketplace: string): Promise<{ [key: string]: string }> {
    const template = this.marketplaceTemplates[marketplace];
    if (!template) {
      throw new Error(`Marketplace template not found: ${marketplace}`);
    }

    const prompt = `
You are an expert e-commerce copywriter. Generate optimized product content for ${marketplace} marketplace.

Product Data:
${JSON.stringify(productData, null, 2)}

Marketplace Requirements (${marketplace}):
${JSON.stringify(template.fields, null, 2)}

Generate content that:
1. Follows ${marketplace} style guidelines
2. Is SEO optimized with relevant keywords
3. Highlights key product features
4. Meets character limits
5. Appeals to the target audience

Provide a JSON response with generated content:

{
  "title": "optimized product title",
  "description": "compelling product description with bullet points",
  "category": "appropriate category classification",
  "keywords": "relevant search keywords",
  "features": ["key feature 1", "key feature 2", "key feature 3"]
}
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      console.error('AI content generation error:', error);
      return this.fallbackContentGeneration(productData, marketplace);
    }
  }

  /**
   * Validate product data against marketplace compliance rules
   */
  async validateCompliance(productData: ProductData, marketplace: string): Promise<string[]> {
    const template = this.marketplaceTemplates[marketplace];
    if (!template) {
      return [`Unknown marketplace: ${marketplace}`];
    }

    const issues: string[] = [];

    // Check required fields
    Object.entries(template.fields).forEach(([field, config]) => {
      if (config.required && !productData[field]) {
        issues.push(`Missing required field: ${field}`);
      }

      // Check field length limits
      if (config.maxLength && productData[field] && 
          typeof productData[field] === 'string' && 
          productData[field].length > config.maxLength) {
        issues.push(`Field '${field}' exceeds maximum length of ${config.maxLength} characters`);
      }

      // Check validation rules
      if (config.validation && productData[field] && 
          !config.validation.includes(productData[field])) {
        issues.push(`Field '${field}' must be one of: ${config.validation.join(', ')}`);
      }
    });

    // Check image requirements
    if (productData.images && Array.isArray(productData.images)) {
      if (productData.images.length === 0) {
        issues.push('At least one product image is required');
      }
    }

    return issues;
  }

  /**
   * Process complete product data with AI enhancement
   */
  async processProductWithAI(productData: ProductData, marketplace: string): Promise<AIProcessingResult> {
    try {
      // Step 1: Map fields
      const mappings = await this.mapFieldsWithAI(productData, marketplace);

      // Step 2: Generate enhanced content
      const generatedContent = await this.generateMarketplaceContent(productData, marketplace);

      // Step 3: Validate compliance
      const complianceIssues = await this.validateCompliance(productData, marketplace);

      // Step 4: Calculate overall confidence
      const avgConfidence = mappings.reduce((sum, mapping) => sum + mapping.confidence, 0) / mappings.length;
      const confidence = Math.round(avgConfidence * (complianceIssues.length === 0 ? 1 : 0.8));

      return {
        mappings,
        generatedContent,
        complianceIssues,
        confidence
      };
    } catch (error) {
      console.error('AI processing error:', error);
      throw new Error(`Failed to process product with AI: ${error.message}`);
    }
  }

  /**
   * Batch process multiple products
   */
  async batchProcessProducts(products: ProductData[], marketplace: string, 
                           onProgress?: (processed: number, total: number) => void): Promise<AIProcessingResult[]> {
    const results: AIProcessingResult[] = [];
    
    for (let i = 0; i < products.length; i++) {
      try {
        const result = await this.processProductWithAI(products[i], marketplace);
        results.push(result);
        
        if (onProgress) {
          onProgress(i + 1, products.length);
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing product ${products[i].sku}:`, error);
        results.push({
          mappings: [],
          generatedContent: {},
          complianceIssues: [`Processing failed: ${error.message}`],
          confidence: 0
        });
      }
    }
    
    return results;
  }

  /**
   * Get marketplace template information
   */
  getMarketplaceTemplate(marketplace: string): MarketplaceTemplate | null {
    return this.marketplaceTemplates[marketplace] || null;
  }

  /**
   * Get all supported marketplaces
   */
  getSupportedMarketplaces(): string[] {
    return Object.keys(this.marketplaceTemplates);
  }

  // Fallback methods for when AI services are unavailable
  private fallbackFieldMapping(sourceData: ProductData, marketplace: string): FieldMapping[] {
    const commonMappings: { [key: string]: { [key: string]: string } } = {
      namshi: {
        'product_name': 'title',
        'brand_name': 'brand',
        'category_path': 'category',
        'gender_target': 'gender',
        'color_desc': 'color',
        'size_info': 'size',
        'material_type': 'material',
        'product_desc': 'description',
        'selling_price': 'price',
        'product_images': 'images'
      }
    };

    const mappings: FieldMapping[] = [];
    const sourceFields = Object.keys(sourceData);
    const marketplaceMappings = commonMappings[marketplace] || {};

    sourceFields.forEach(sourceField => {
      const targetField = marketplaceMappings[sourceField] || sourceField;
      mappings.push({
        sourceField,
        targetField,
        confidence: 75,
        transformation: 'Direct mapping',
        aiSuggestion: 'Fallback mapping based on common patterns'
      });
    });

    return mappings;
  }

  private fallbackContentGeneration(productData: ProductData, marketplace: string): { [key: string]: string } {
    return {
      title: productData.title || `${productData.brand} ${productData.category}`,
      description: productData.description || `High-quality ${productData.category} from ${productData.brand}`,
      category: productData.category || 'Fashion',
      keywords: `${productData.brand}, ${productData.category}, ${productData.color}`,
      features: [
        `Brand: ${productData.brand}`,
        `Material: ${productData.material || 'Premium quality'}`,
        `Color: ${productData.color}`
      ]
    };
  }
}

export const aiService = new AIService();