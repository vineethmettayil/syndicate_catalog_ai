import OpenAI from 'openai';
import { templateAdaptationService, TemplateAdaptationResult, AttributeMapping } from './templateAdaptationService';

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

export interface EnhancedAIProcessingResult {
  originalData: ProductData;
  adaptedData: ProductData;
  templateAdaptation: TemplateAdaptationResult;
  generatedContent: { [key: string]: any };
  complianceIssues: string[];
  confidence: number;
  aiEnhancements: {
    titleOptimized: boolean;
    descriptionGenerated: boolean;
    attributesInferred: string[];
    missingFieldsGenerated: string[];
  };
}

export interface BatchProcessingProgress {
  currentItem: number;
  totalItems: number;
  currentStep: string;
  itemsProcessed: number;
  itemsSuccessful: number;
  itemsFailed: number;
  estimatedTimeRemaining: number;
}

class EnhancedAIService {
  private processingQueue: ProductData[] = [];
  private isProcessing = false;

  /**
   * Enhanced product processing with template adaptation
   */
  async processProductWithTemplateAdaptation(
    productData: ProductData,
    targetMarketplace: string,
    sourceTemplate?: any
  ): Promise<EnhancedAIProcessingResult> {
    try {
      // Step 1: Analyze and adapt template
      const templateAdaptation = await templateAdaptationService.analyzeAndAdaptTemplate(
        [productData],
        targetMarketplace,
        sourceTemplate
      );

      // Step 2: Apply template adaptation
      const adaptedData = await templateAdaptationService.applyTemplateAdaptation(
        productData,
        templateAdaptation
      );

      // Step 3: Generate missing content with AI
      const generatedContent = await this.generateMissingContent(adaptedData, templateAdaptation, targetMarketplace);

      // Step 4: Apply AI enhancements
      const enhancedData = await this.applyAIEnhancements(adaptedData, generatedContent, targetMarketplace);

      // Step 5: Validate compliance
      const complianceIssues = await this.validateMarketplaceCompliance(enhancedData, targetMarketplace);

      // Step 6: Calculate confidence
      const confidence = this.calculateProcessingConfidence(templateAdaptation, generatedContent, complianceIssues);

      // Step 7: Track AI enhancements
      const aiEnhancements = this.trackAIEnhancements(productData, enhancedData, generatedContent);

      return {
        originalData: productData,
        adaptedData: enhancedData,
        templateAdaptation,
        generatedContent,
        complianceIssues,
        confidence,
        aiEnhancements
      };
    } catch (error) {
      console.error('Enhanced AI processing error:', error);
      throw new Error(`Failed to process product with enhanced AI: ${error.message}`);
    }
  }

  /**
   * Generate missing content using AI
   */
  private async generateMissingContent(
    adaptedData: ProductData,
    templateAdaptation: TemplateAdaptationResult,
    marketplace: string
  ): Promise<{ [key: string]: any }> {
    const generatedContent: { [key: string]: any } = {};
    const missingFields = templateAdaptation.newAttributes.filter(attr => attr.required);

    if (openai && missingFields.length > 0) {
      try {
        const prompt = this.buildContentGenerationPrompt(adaptedData, missingFields, marketplace);
        
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert e-commerce content generator. Create compelling, accurate, and marketplace-compliant product content."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        });

        const aiResponse = JSON.parse(response.choices[0].message.content || '{}');
        Object.assign(generatedContent, aiResponse);
      } catch (error) {
        console.warn('AI content generation failed, using fallback:', error);
        // Fallback to rule-based generation
        Object.assign(generatedContent, this.generateFallbackContent(adaptedData, missingFields, marketplace));
      }
    } else {
      // Use rule-based generation
      Object.assign(generatedContent, this.generateFallbackContent(adaptedData, missingFields, marketplace));
    }

    return generatedContent;
  }

  /**
   * Build content generation prompt
   */
  private buildContentGenerationPrompt(
    productData: ProductData,
    missingFields: any[],
    marketplace: string
  ): string {
    const fieldDescriptions = missingFields.map(field => 
      `${field.name} (${field.type}${field.required ? ', required' : ''})`
    ).join(', ');

    return `
Generate missing product content for ${marketplace} marketplace:

Existing Product Data:
${JSON.stringify(productData, null, 2)}

Missing Fields to Generate:
${fieldDescriptions}

Requirements:
1. Generate compelling, SEO-optimized content
2. Ensure marketplace compliance
3. Maintain consistency with existing data
4. Use appropriate tone for the product category
5. Include relevant keywords naturally

Return JSON with the generated fields only.
`;
  }

  /**
   * Generate fallback content using rules
   */
  private generateFallbackContent(
    productData: ProductData,
    missingFields: any[],
    marketplace: string
  ): { [key: string]: any } {
    const content: { [key: string]: any } = {};

    missingFields.forEach(field => {
      switch (field.name.toLowerCase()) {
        case 'title':
        case 'product_name':
        case 'item_name':
          content[field.name] = this.generateTitle(productData);
          break;
        case 'description':
        case 'product_description':
          content[field.name] = this.generateDescription(productData);
          break;
        case 'bullet_point1':
          content[field.name] = `Premium ${productData.category || 'product'} from ${productData.brand || 'top brand'}`;
          break;
        case 'bullet_point2':
          content[field.name] = `High-quality ${productData.material || 'materials'} for durability and comfort`;
          break;
        case 'search_terms':
        case 'keywords':
          content[field.name] = this.generateKeywords(productData);
          break;
        case 'meta_title':
          content[field.name] = `${productData.title || productData.brand} - ${productData.category}`;
          break;
        case 'meta_description':
          content[field.name] = `Shop ${productData.title || productData.brand} ${productData.category}. ${productData.color ? `Available in ${productData.color}.` : ''} Free shipping available.`;
          break;
        default:
          if (field.validation?.enum) {
            content[field.name] = field.validation.enum[0];
          } else if (field.type === 'string') {
            content[field.name] = `Generated ${field.name}`;
          } else if (field.type === 'number') {
            content[field.name] = 0;
          } else if (field.type === 'array') {
            content[field.name] = [];
          }
      }
    });

    return content;
  }

  /**
   * Generate optimized title
   */
  private generateTitle(productData: ProductData): string {
    const parts = [];
    
    if (productData.brand) parts.push(productData.brand);
    if (productData.title && productData.title !== productData.brand) {
      parts.push(productData.title);
    } else if (productData.category) {
      parts.push(productData.category);
    }
    if (productData.color && !parts.join(' ').toLowerCase().includes(productData.color.toLowerCase())) {
      parts.push(`in ${productData.color}`);
    }
    if (productData.material && !parts.join(' ').toLowerCase().includes(productData.material.toLowerCase())) {
      parts.push(`(${productData.material})`);
    }
    
    return parts.join(' ').substring(0, 200);
  }

  /**
   * Generate comprehensive description
   */
  private generateDescription(productData: ProductData): string {
    if (productData.description) return productData.description;
    
    const parts = [];
    
    // Opening statement
    parts.push(`Discover the perfect ${productData.category || 'product'} from ${productData.brand || 'our premium collection'}.`);
    
    // Material and quality
    if (productData.material) {
      parts.push(`Expertly crafted from high-quality ${productData.material} for exceptional comfort and durability.`);
    }
    
    // Color and style
    if (productData.color) {
      parts.push(`This stunning piece comes in ${productData.color}, perfect for any occasion.`);
    }
    
    // Size information
    if (productData.size) {
      parts.push(`Available in size ${productData.size} for the perfect fit.`);
    }
    
    // Gender targeting
    if (productData.gender) {
      const genderText = productData.gender === 'Unisex' ? 'suitable for everyone' : `designed for ${productData.gender.toLowerCase()}`;
      parts.push(`Thoughtfully ${genderText}.`);
    }
    
    // Closing statement
    parts.push('Perfect for everyday wear and special occasions alike.');
    
    return parts.join(' ');
  }

  /**
   * Generate keywords
   */
  private generateKeywords(productData: ProductData): string {
    const keywords = [];
    
    if (productData.brand) keywords.push(productData.brand.toLowerCase());
    if (productData.category) keywords.push(productData.category.toLowerCase());
    if (productData.color) keywords.push(productData.color.toLowerCase());
    if (productData.material) keywords.push(productData.material.toLowerCase());
    if (productData.gender) keywords.push(productData.gender.toLowerCase());
    
    // Add category-specific keywords
    if (productData.category?.toLowerCase().includes('shirt')) {
      keywords.push('clothing', 'apparel', 'fashion');
    } else if (productData.category?.toLowerCase().includes('shoe')) {
      keywords.push('footwear', 'sneakers', 'fashion');
    }
    
    return keywords.join(', ');
  }

  /**
   * Apply AI enhancements
   */
  private async applyAIEnhancements(
    adaptedData: ProductData,
    generatedContent: { [key: string]: any },
    marketplace: string
  ): Promise<ProductData> {
    const enhancedData = { ...adaptedData, ...generatedContent };

    // Optimize existing content
    if (enhancedData.title && enhancedData.title.length < 50) {
      enhancedData.title = this.optimizeTitle(enhancedData.title, enhancedData);
    }

    // Enhance description with SEO keywords
    if (enhancedData.description) {
      enhancedData.description = this.enhanceDescription(enhancedData.description, enhancedData);
    }

    // Infer missing attributes from existing data
    this.inferMissingAttributes(enhancedData);

    return enhancedData;
  }

  /**
   * Optimize title for SEO and marketplace requirements
   */
  private optimizeTitle(title: string, productData: ProductData): string {
    let optimizedTitle = title;
    
    // Add brand if not present
    if (productData.brand && !title.toLowerCase().includes(productData.brand.toLowerCase())) {
      optimizedTitle = `${productData.brand} ${optimizedTitle}`;
    }
    
    // Add key attributes
    const keyAttributes = [];
    if (productData.color && !optimizedTitle.toLowerCase().includes(productData.color.toLowerCase())) {
      keyAttributes.push(productData.color);
    }
    if (productData.material && !optimizedTitle.toLowerCase().includes(productData.material.toLowerCase())) {
      keyAttributes.push(productData.material);
    }
    
    if (keyAttributes.length > 0) {
      optimizedTitle += ` - ${keyAttributes.join(', ')}`;
    }
    
    return optimizedTitle.substring(0, 200);
  }

  /**
   * Enhance description with SEO and marketplace optimization
   */
  private enhanceDescription(description: string, productData: ProductData): string {
    let enhanced = description;
    
    // Add key product attributes if not mentioned
    const attributes = ['brand', 'material', 'color', 'size'];
    attributes.forEach(attr => {
      if (productData[attr] && !enhanced.toLowerCase().includes(productData[attr].toLowerCase())) {
        enhanced += ` Features ${productData[attr]} for enhanced quality.`;
      }
    });
    
    // Add call-to-action
    if (!enhanced.toLowerCase().includes('shop') && !enhanced.toLowerCase().includes('buy')) {
      enhanced += ' Shop now for the best selection and fast shipping.';
    }
    
    return enhanced;
  }

  /**
   * Infer missing attributes from existing data
   */
  private inferMissingAttributes(productData: ProductData): void {
    // Infer gender from category or title
    if (!productData.gender) {
      const text = `${productData.title} ${productData.category}`.toLowerCase();
      if (text.includes('men') || text.includes('male')) {
        productData.gender = 'Men';
      } else if (text.includes('women') || text.includes('female') || text.includes('ladies')) {
        productData.gender = 'Women';
      } else if (text.includes('kid') || text.includes('child')) {
        productData.gender = 'Kids';
      } else {
        productData.gender = 'Unisex';
      }
    }

    // Infer age group
    if (!productData.age_group) {
      const text = `${productData.title} ${productData.category}`.toLowerCase();
      if (text.includes('baby') || text.includes('infant')) {
        productData.age_group = 'Baby';
      } else if (text.includes('kid') || text.includes('child')) {
        productData.age_group = 'Child';
      } else if (text.includes('teen')) {
        productData.age_group = 'Teen';
      } else {
        productData.age_group = 'Adult';
      }
    }

    // Infer condition
    if (!productData.condition) {
      productData.condition = 'new';
    }

    // Infer availability
    if (!productData.availability) {
      productData.availability = 'in_stock';
    }
  }

  /**
   * Validate marketplace compliance
   */
  private async validateMarketplaceCompliance(
    productData: ProductData,
    marketplace: string
  ): Promise<string[]> {
    const issues: string[] = [];
    const template = templateAdaptationService.getTemplateByMarketplace(marketplace);
    
    if (!template) {
      issues.push(`Unknown marketplace: ${marketplace}`);
      return issues;
    }

    // Check required fields
    template.attributes.forEach(attr => {
      if (attr.required && (!productData[attr.name] || productData[attr.name] === '')) {
        issues.push(`Missing required field: ${attr.name}`);
      }

      const value = productData[attr.name];
      if (value !== undefined && value !== null) {
        // Length validation
        if (attr.validation?.maxLength && typeof value === 'string' && value.length > attr.validation.maxLength) {
          issues.push(`Field '${attr.name}' exceeds maximum length of ${attr.validation.maxLength} characters`);
        }

        // Enum validation
        if (attr.validation?.enum && !attr.validation.enum.includes(value)) {
          issues.push(`Field '${attr.name}' must be one of: ${attr.validation.enum.join(', ')}`);
        }

        // Number validation
        if (attr.type === 'number') {
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          if (isNaN(numValue)) {
            issues.push(`Field '${attr.name}' must be a valid number`);
          } else {
            if (attr.validation?.min !== undefined && numValue < attr.validation.min) {
              issues.push(`Field '${attr.name}' must be at least ${attr.validation.min}`);
            }
            if (attr.validation?.max !== undefined && numValue > attr.validation.max) {
              issues.push(`Field '${attr.name}' must be at most ${attr.validation.max}`);
            }
          }
        }

        // Pattern validation
        if (attr.validation?.pattern && typeof value === 'string') {
          const regex = new RegExp(attr.validation.pattern);
          if (!regex.test(value)) {
            issues.push(`Field '${attr.name}' does not match required pattern`);
          }
        }
      }
    });

    // Image validation
    if (productData.images && Array.isArray(productData.images)) {
      if (productData.images.length === 0) {
        issues.push('At least one product image is required');
      } else {
        productData.images.forEach((url, index) => {
          if (!this.isValidImageUrl(url)) {
            issues.push(`Invalid image URL at position ${index + 1}`);
          }
        });
      }
    }

    return issues;
  }

  /**
   * Validate image URL
   */
  private isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    } catch {
      return false;
    }
  }

  /**
   * Calculate processing confidence
   */
  private calculateProcessingConfidence(
    templateAdaptation: TemplateAdaptationResult,
    generatedContent: { [key: string]: any },
    complianceIssues: string[]
  ): number {
    let confidence = templateAdaptation.confidence;

    // Boost for successful content generation
    const generatedFieldsCount = Object.keys(generatedContent).length;
    if (generatedFieldsCount > 0) {
      confidence += Math.min(20, generatedFieldsCount * 5);
    }

    // Penalize for compliance issues
    const compliancePenalty = complianceIssues.length * 10;
    confidence = Math.max(0, confidence - compliancePenalty);

    return Math.min(100, Math.round(confidence));
  }

  /**
   * Track AI enhancements
   */
  private trackAIEnhancements(
    originalData: ProductData,
    enhancedData: ProductData,
    generatedContent: { [key: string]: any }
  ): any {
    const enhancements = {
      titleOptimized: false,
      descriptionGenerated: false,
      attributesInferred: [] as string[],
      missingFieldsGenerated: [] as string[]
    };

    // Check if title was optimized
    if (originalData.title !== enhancedData.title) {
      enhancements.titleOptimized = true;
    }

    // Check if description was generated
    if (!originalData.description && enhancedData.description) {
      enhancements.descriptionGenerated = true;
    }

    // Track inferred attributes
    const inferredFields = ['gender', 'age_group', 'condition', 'availability'];
    inferredFields.forEach(field => {
      if (!originalData[field] && enhancedData[field]) {
        enhancements.attributesInferred.push(field);
      }
    });

    // Track generated fields
    enhancements.missingFieldsGenerated = Object.keys(generatedContent);

    return enhancements;
  }

  /**
   * Batch process products with enhanced AI
   */
  async batchProcessProducts(
    products: ProductData[],
    targetMarketplace: string,
    onProgress?: (progress: BatchProcessingProgress) => void,
    sourceTemplate?: any
  ): Promise<EnhancedAIProcessingResult[]> {
    const results: EnhancedAIProcessingResult[] = [];
    const startTime = Date.now();
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < products.length; i++) {
      const currentProgress: BatchProcessingProgress = {
        currentItem: i + 1,
        totalItems: products.length,
        currentStep: `Processing ${products[i].sku || `item ${i + 1}`}`,
        itemsProcessed: i,
        itemsSuccessful: successCount,
        itemsFailed: failCount,
        estimatedTimeRemaining: this.calculateETA(startTime, i, products.length)
      };

      if (onProgress) {
        onProgress(currentProgress);
      }

      try {
        const result = await this.processProductWithTemplateAdaptation(
          products[i],
          targetMarketplace,
          sourceTemplate
        );
        results.push(result);
        successCount++;
      } catch (error) {
        console.error(`Error processing product ${products[i].sku}:`, error);
        
        // Create error result
        const errorResult: EnhancedAIProcessingResult = {
          originalData: products[i],
          adaptedData: products[i],
          templateAdaptation: {
            mappings: [],
            newAttributes: [],
            removedAttributes: [],
            renamedAttributes: {},
            transformations: {},
            confidence: 0,
            issues: [`Processing failed: ${error.message}`]
          },
          generatedContent: {},
          complianceIssues: [`Processing failed: ${error.message}`],
          confidence: 0,
          aiEnhancements: {
            titleOptimized: false,
            descriptionGenerated: false,
            attributesInferred: [],
            missingFieldsGenerated: []
          }
        };
        results.push(errorResult);
        failCount++;
      }

      // Rate limiting to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  /**
   * Calculate estimated time of arrival
   */
  private calculateETA(startTime: number, currentIndex: number, totalItems: number): number {
    if (currentIndex === 0) return 0;
    
    const elapsed = Date.now() - startTime;
    const avgTimePerItem = elapsed / currentIndex;
    const remainingItems = totalItems - currentIndex;
    
    return Math.round((remainingItems * avgTimePerItem) / 1000); // Return in seconds
  }

  /**
   * Get supported marketplaces
   */
  getSupportedMarketplaces(): string[] {
    return templateAdaptationService.getSupportedMarketplaces();
  }

  /**
   * Get marketplace template
   */
  getMarketplaceTemplate(marketplace: string) {
    return templateAdaptationService.getTemplateByMarketplace(marketplace);
  }
}

export const enhancedAIService = new EnhancedAIService();