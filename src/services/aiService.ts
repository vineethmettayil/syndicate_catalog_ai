import OpenAI from 'openai';

// Initialize OpenAI client with fallback for demo
const openai = import.meta.env.VITE_OPENAI_API_KEY ? new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
}) : null;

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
    },
    noon: {
      name: 'Noon',
      fields: {
        title: { required: true, type: 'string', maxLength: 250 },
        brand: { required: true, type: 'string' },
        category: { required: true, type: 'string' },
        gender: { required: true, type: 'string', validation: ['Men', 'Women', 'Kids', 'Unisex'] },
        color: { required: true, type: 'string' },
        size: { required: false, type: 'string' },
        material: { required: false, type: 'string' },
        description: { required: true, type: 'string', maxLength: 1500 },
        price: { required: true, type: 'number' },
        images: { required: true, type: 'array' }
      },
      imageSpecs: {
        width: 800,
        height: 800,
        format: 'JPEG',
        maxSize: '5MB'
      }
    },
    trendyol: {
      name: 'Trendyol',
      fields: {
        urun_adi: { required: true, type: 'string', maxLength: 200 },
        marka: { required: true, type: 'string' },
        kategori: { required: true, type: 'string' },
        cinsiyet: { required: true, type: 'string', validation: ['Erkek', 'Kadın', 'Çocuk', 'Unisex'] },
        renk: { required: true, type: 'string' },
        beden: { required: false, type: 'string' },
        malzeme: { required: false, type: 'string' },
        aciklama: { required: true, type: 'string', maxLength: 1200 },
        fiyat: { required: true, type: 'number' },
        resimler: { required: true, type: 'array' }
      },
      imageSpecs: {
        width: 750,
        height: 1100,
        format: 'JPEG',
        maxSize: '3MB'
      }
    },
    sixthstreet: {
      name: '6th Street',
      fields: {
        product_title: { required: true, type: 'string', maxLength: 180 },
        brand_name: { required: true, type: 'string' },
        category_name: { required: true, type: 'string' },
        gender_type: { required: true, type: 'string', validation: ['Men', 'Women', 'Kids', 'Unisex'] },
        color_name: { required: true, type: 'string' },
        size_value: { required: false, type: 'string' },
        material_info: { required: false, type: 'string' },
        product_desc: { required: true, type: 'string', maxLength: 900 },
        retail_price: { required: true, type: 'number' },
        image_list: { required: true, type: 'array' }
      },
      imageSpecs: {
        width: 1200,
        height: 1600,
        format: 'WebP',
        maxSize: '2MB'
      }
    }
  };

  async mapFieldsWithAI(sourceData: ProductData, marketplace: string): Promise<FieldMapping[]> {
    const template = this.marketplaceTemplates[marketplace];
    if (!template) {
      throw new Error(`Marketplace template not found: ${marketplace}`);
    }

    // If OpenAI is available, use it
    if (openai) {
      try {
        const sourceFields = Object.keys(sourceData);
        const targetFields = Object.keys(template.fields);

        const prompt = `Map these source product fields to ${marketplace} marketplace fields:

Source Fields: ${sourceFields.join(', ')}
Target Fields: ${targetFields.join(', ')}

Source Data: ${JSON.stringify(sourceData, null, 2)}

Return JSON with mappings array containing sourceField, targetField, confidence (0-100), and aiSuggestion.`;

        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 1000
        });

        const result = JSON.parse(response.choices[0].message.content || '{"mappings": []}');
        return result.mappings || [];
      } catch (error) {
        console.warn('OpenAI mapping failed, using fallback:', error);
      }
    }

    // Fallback intelligent mapping
    return this.intelligentFieldMapping(sourceData, marketplace);
  }

  async generateMarketplaceContent(productData: ProductData, marketplace: string): Promise<{ [key: string]: string }> {
    const template = this.marketplaceTemplates[marketplace];
    if (!template) {
      throw new Error(`Marketplace template not found: ${marketplace}`);
    }

    // If OpenAI is available, use it
    if (openai) {
      try {
        const prompt = `Generate optimized product content for ${marketplace}:

Product: ${JSON.stringify(productData, null, 2)}

Create compelling, SEO-friendly content that follows ${marketplace} guidelines. Return JSON with title, description, and other relevant fields.`;

        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1500
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');
        return result;
      } catch (error) {
        console.warn('OpenAI content generation failed, using fallback:', error);
      }
    }

    // Fallback content generation
    return this.generateFallbackContent(productData, marketplace);
  }

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

      if (config.maxLength && productData[field] && 
          typeof productData[field] === 'string' && 
          productData[field].length > config.maxLength) {
        issues.push(`Field '${field}' exceeds maximum length of ${config.maxLength} characters`);
      }

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

  async processProductWithAI(productData: ProductData, marketplace: string): Promise<AIProcessingResult> {
    try {
      // Step 1: Map fields
      const mappings = await this.mapFieldsWithAI(productData, marketplace);

      // Step 2: Generate enhanced content
      const generatedContent = await this.generateMarketplaceContent(productData, marketplace);

      // Step 3: Apply mappings to create final product data
      const mappedData = { ...productData };
      mappings.forEach(mapping => {
        if (productData[mapping.sourceField]) {
          mappedData[mapping.targetField] = productData[mapping.sourceField];
        }
      });

      // Step 4: Merge generated content
      Object.assign(mappedData, generatedContent);

      // Step 5: Validate compliance
      const complianceIssues = await this.validateCompliance(mappedData, marketplace);

      // Step 6: Calculate confidence
      const avgMappingConfidence = mappings.length > 0 
        ? mappings.reduce((sum, mapping) => sum + mapping.confidence, 0) / mappings.length 
        : 70;
      
      const complianceScore = complianceIssues.length === 0 ? 100 : Math.max(50, 100 - (complianceIssues.length * 15));
      const confidence = Math.round((avgMappingConfidence + complianceScore) / 2);

      return {
        mappings,
        generatedContent: mappedData,
        complianceIssues,
        confidence
      };
    } catch (error) {
      console.error('AI processing error:', error);
      throw new Error(`Failed to process product with AI: ${error.message}`);
    }
  }

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
        
        // Add small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 200));
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

  // Intelligent fallback mapping without AI
  private intelligentFieldMapping(sourceData: ProductData, marketplace: string): FieldMapping[] {
    const template = this.marketplaceTemplates[marketplace];
    const mappings: FieldMapping[] = [];
    
    // Common field mappings by marketplace
    const marketplaceMappings: { [key: string]: { [key: string]: string } } = {
      namshi: {
        'product_name': 'title', 'title': 'title', 'name': 'title',
        'brand_name': 'brand', 'brand': 'brand',
        'category': 'category', 'product_type': 'category',
        'gender': 'gender', 'target_gender': 'gender',
        'color': 'color', 'color_name': 'color',
        'size': 'size', 'size_name': 'size',
        'material': 'material', 'fabric': 'material',
        'description': 'description', 'product_description': 'description',
        'price': 'price', 'selling_price': 'price',
        'images': 'images', 'image_urls': 'images'
      },
      centrepoint: {
        'title': 'product_name', 'product_name': 'product_name', 'name': 'product_name',
        'brand': 'brand_name', 'brand_name': 'brand_name',
        'category': 'product_type', 'product_type': 'product_type',
        'gender': 'target_gender', 'target_gender': 'target_gender',
        'color': 'primary_color', 'color_name': 'primary_color',
        'size': 'size_info', 'size_name': 'size_info',
        'material': 'fabric_material', 'fabric': 'fabric_material',
        'description': 'product_description', 'product_desc': 'product_description',
        'price': 'selling_price', 'selling_price': 'selling_price',
        'images': 'image_urls', 'image_urls': 'image_urls'
      }
    };

    const sourceFields = Object.keys(sourceData);
    const targetFields = Object.keys(template.fields);
    const mappingRules = marketplaceMappings[marketplace] || {};

    sourceFields.forEach(sourceField => {
      const normalizedSource = sourceField.toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      // Direct mapping
      if (mappingRules[sourceField]) {
        mappings.push({
          sourceField,
          targetField: mappingRules[sourceField],
          confidence: 95,
          transformation: 'Direct mapping',
          aiSuggestion: 'Exact field match found'
        });
        return;
      }

      // Fuzzy matching
      const bestMatch = this.findBestFieldMatch(normalizedSource, targetFields);
      if (bestMatch.confidence > 70) {
        mappings.push({
          sourceField,
          targetField: bestMatch.field,
          confidence: bestMatch.confidence,
          transformation: 'Fuzzy matching',
          aiSuggestion: `Matched based on field name similarity`
        });
      }
    });

    return mappings;
  }

  private findBestFieldMatch(sourceField: string, targetFields: string[]): { field: string; confidence: number } {
    let bestMatch = { field: '', confidence: 0 };

    targetFields.forEach(targetField => {
      const normalizedTarget = targetField.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const similarity = this.calculateStringSimilarity(sourceField, normalizedTarget);
      
      if (similarity > bestMatch.confidence) {
        bestMatch = { field: targetField, confidence: Math.round(similarity * 100) };
      }
    });

    return bestMatch;
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
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
  }

  private generateFallbackContent(productData: ProductData, marketplace: string): { [key: string]: string } {
    const template = this.marketplaceTemplates[marketplace];
    const content: { [key: string]: string } = {};

    // Generate title
    if (template.fields.title || template.fields.product_name || template.fields.item_name) {
      const titleField = Object.keys(template.fields).find(f => 
        f.includes('title') || f.includes('name')
      );
      if (titleField) {
        content[titleField] = this.generateTitle(productData);
      }
    }

    // Generate description
    if (template.fields.description || template.fields.product_description) {
      const descField = Object.keys(template.fields).find(f => 
        f.includes('description') || f.includes('desc')
      );
      if (descField) {
        content[descField] = this.generateDescription(productData);
      }
    }

    // Map other fields
    Object.keys(template.fields).forEach(field => {
      if (!content[field]) {
        const sourceValue = this.findSourceValue(productData, field);
        if (sourceValue) {
          content[field] = sourceValue;
        }
      }
    });

    return content;
  }

  private generateTitle(productData: ProductData): string {
    const parts = [];
    
    if (productData.brand) parts.push(productData.brand);
    if (productData.title) parts.push(productData.title);
    else if (productData.category) parts.push(productData.category);
    if (productData.color) parts.push(`- ${productData.color}`);
    if (productData.material) parts.push(`(${productData.material})`);
    
    return parts.join(' ').substring(0, 200);
  }

  private generateDescription(productData: ProductData): string {
    if (productData.description) return productData.description;
    
    const parts = [];
    parts.push(`Premium ${productData.category || 'product'} from ${productData.brand || 'top brand'}.`);
    
    if (productData.material) {
      parts.push(`Crafted from high-quality ${productData.material} for comfort and durability.`);
    }
    
    if (productData.color) {
      parts.push(`Available in ${productData.color} color.`);
    }
    
    if (productData.size) {
      parts.push(`Size: ${productData.size}.`);
    }
    
    parts.push('Perfect for everyday wear and special occasions.');
    
    return parts.join(' ');
  }

  private findSourceValue(productData: ProductData, targetField: string): string | null {
    const fieldMappings: { [key: string]: string[] } = {
      brand: ['brand', 'brand_name', 'manufacturer'],
      category: ['category', 'product_type', 'item_type'],
      color: ['color', 'color_name', 'primary_color'],
      size: ['size', 'size_name', 'size_info'],
      material: ['material', 'fabric', 'material_type'],
      gender: ['gender', 'target_gender', 'department'],
      price: ['price', 'selling_price', 'list_price']
    };

    const normalizedTarget = targetField.toLowerCase();
    
    for (const [key, sources] of Object.entries(fieldMappings)) {
      if (normalizedTarget.includes(key)) {
        for (const source of sources) {
          if (productData[source]) {
            return productData[source].toString();
          }
        }
      }
    }

    return null;
  }

  getMarketplaceTemplate(marketplace: string): MarketplaceTemplate | null {
    return this.marketplaceTemplates[marketplace] || null;
  }

  getSupportedMarketplaces(): string[] {
    return Object.keys(this.marketplaceTemplates);
  }
}

export const aiService = new AIService();