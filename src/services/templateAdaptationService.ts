import { ProductData } from './aiService';

export interface AttributeDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: string[];
    min?: number;
    max?: number;
  };
  transformation?: {
    format?: string;
    mapping?: { [key: string]: string };
    calculation?: string;
  };
  marketplace?: string;
  category?: string;
  priority: number;
}

export interface TemplateSchema {
  id: string;
  name: string;
  version: string;
  marketplace: string;
  attributes: AttributeDefinition[];
  imageSpecs: {
    width: number;
    height: number;
    format: string;
    maxSize: string;
    aspectRatio?: string;
  };
  rules: {
    categoryMappings: { [key: string]: string };
    valueMappings: { [key: string]: { [key: string]: string } };
    conditionalFields: { [key: string]: string[] };
  };
  lastUpdated: Date;
  isActive: boolean;
}

export interface AttributeMapping {
  sourceAttribute: string;
  targetAttribute: string;
  transformation: 'direct' | 'mapped' | 'calculated' | 'generated' | 'split' | 'merged';
  confidence: number;
  rule?: string;
  fallback?: string;
}

export interface TemplateAdaptationResult {
  mappings: AttributeMapping[];
  newAttributes: AttributeDefinition[];
  removedAttributes: string[];
  renamedAttributes: { [oldName: string]: string };
  transformations: { [attribute: string]: string };
  confidence: number;
  issues: string[];
}

class TemplateAdaptationService {
  private knownTemplates: Map<string, TemplateSchema> = new Map();
  private attributeLibrary: Map<string, AttributeDefinition> = new Map();

  constructor() {
    this.initializeAttributeLibrary();
    this.loadMarketplaceTemplates();
  }

  /**
   * Initialize comprehensive attribute library with common e-commerce attributes
   */
  private initializeAttributeLibrary() {
    const commonAttributes: AttributeDefinition[] = [
      // Product Identity
      { name: 'sku', type: 'string', required: true, priority: 100 },
      { name: 'product_id', type: 'string', required: true, priority: 100 },
      { name: 'title', type: 'string', required: true, validation: { maxLength: 200 }, priority: 95 },
      { name: 'product_name', type: 'string', required: true, validation: { maxLength: 200 }, priority: 95 },
      { name: 'brand', type: 'string', required: true, priority: 90 },
      { name: 'manufacturer', type: 'string', required: false, priority: 70 },
      
      // Categorization
      { name: 'category', type: 'string', required: true, priority: 85 },
      { name: 'subcategory', type: 'string', required: false, priority: 75 },
      { name: 'product_type', type: 'string', required: true, priority: 85 },
      { name: 'department', type: 'string', required: false, priority: 70 },
      
      // Physical Attributes
      { name: 'color', type: 'string', required: true, priority: 80 },
      { name: 'size', type: 'string', required: false, priority: 75 },
      { name: 'material', type: 'string', required: false, priority: 70 },
      { name: 'weight', type: 'number', required: false, validation: { min: 0 }, priority: 60 },
      { name: 'dimensions', type: 'string', required: false, priority: 60 },
      
      // Target Demographics
      { name: 'gender', type: 'string', required: false, validation: { enum: ['Men', 'Women', 'Kids', 'Unisex'] }, priority: 75 },
      { name: 'age_group', type: 'string', required: false, validation: { enum: ['Adult', 'Teen', 'Child', 'Baby'] }, priority: 65 },
      
      // Pricing
      { name: 'price', type: 'number', required: true, validation: { min: 0 }, priority: 90 },
      { name: 'sale_price', type: 'number', required: false, validation: { min: 0 }, priority: 70 },
      { name: 'currency', type: 'string', required: false, validation: { pattern: '^[A-Z]{3}$' }, priority: 60 },
      
      // Content
      { name: 'description', type: 'string', required: true, validation: { maxLength: 2000 }, priority: 85 },
      { name: 'short_description', type: 'string', required: false, validation: { maxLength: 500 }, priority: 70 },
      { name: 'features', type: 'array', required: false, priority: 65 },
      { name: 'specifications', type: 'object', required: false, priority: 65 },
      
      // Media
      { name: 'images', type: 'array', required: true, priority: 85 },
      { name: 'main_image', type: 'string', required: true, priority: 90 },
      { name: 'videos', type: 'array', required: false, priority: 50 },
      
      // Inventory & Logistics
      { name: 'stock_quantity', type: 'number', required: false, validation: { min: 0 }, priority: 70 },
      { name: 'availability', type: 'string', required: false, validation: { enum: ['in_stock', 'out_of_stock', 'pre_order'] }, priority: 70 },
      { name: 'shipping_weight', type: 'number', required: false, validation: { min: 0 }, priority: 60 },
      { name: 'shipping_dimensions', type: 'string', required: false, priority: 60 },
      
      // SEO & Marketing
      { name: 'meta_title', type: 'string', required: false, validation: { maxLength: 60 }, priority: 55 },
      { name: 'meta_description', type: 'string', required: false, validation: { maxLength: 160 }, priority: 55 },
      { name: 'keywords', type: 'array', required: false, priority: 50 },
      { name: 'tags', type: 'array', required: false, priority: 50 },
      
      // Compliance & Quality
      { name: 'condition', type: 'string', required: false, validation: { enum: ['new', 'used', 'refurbished'] }, priority: 65 },
      { name: 'warranty', type: 'string', required: false, priority: 55 },
      { name: 'certifications', type: 'array', required: false, priority: 55 },
      { name: 'safety_warnings', type: 'array', required: false, priority: 60 },
      
      // Marketplace Specific
      { name: 'barcode', type: 'string', required: false, priority: 65 },
      { name: 'upc', type: 'string', required: false, validation: { pattern: '^[0-9]{12}$' }, priority: 65 },
      { name: 'ean', type: 'string', required: false, validation: { pattern: '^[0-9]{13}$' }, priority: 65 },
      { name: 'isbn', type: 'string', required: false, priority: 60 },
      
      // Fashion Specific
      { name: 'season', type: 'string', required: false, validation: { enum: ['Spring', 'Summer', 'Fall', 'Winter', 'All Season'] }, priority: 60 },
      { name: 'style', type: 'string', required: false, priority: 60 },
      { name: 'pattern', type: 'string', required: false, priority: 55 },
      { name: 'fit', type: 'string', required: false, priority: 55 },
      { name: 'care_instructions', type: 'string', required: false, priority: 55 },
      
      // Electronics Specific
      { name: 'model_number', type: 'string', required: false, priority: 70 },
      { name: 'power_consumption', type: 'string', required: false, priority: 55 },
      { name: 'connectivity', type: 'array', required: false, priority: 55 },
      { name: 'operating_system', type: 'string', required: false, priority: 60 },
      
      // Home & Garden Specific
      { name: 'room_type', type: 'string', required: false, priority: 55 },
      { name: 'assembly_required', type: 'boolean', required: false, priority: 55 },
      { name: 'installation_type', type: 'string', required: false, priority: 50 },
      
      // Beauty & Health Specific
      { name: 'skin_type', type: 'string', required: false, priority: 55 },
      { name: 'ingredients', type: 'array', required: false, priority: 60 },
      { name: 'expiry_date', type: 'string', required: false, priority: 65 },
      { name: 'volume', type: 'string', required: false, priority: 60 },
      
      // Sports & Outdoors Specific
      { name: 'sport_type', type: 'string', required: false, priority: 55 },
      { name: 'skill_level', type: 'string', required: false, validation: { enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'] }, priority: 50 },
      { name: 'weather_resistance', type: 'string', required: false, priority: 50 }
    ];

    commonAttributes.forEach(attr => {
      this.attributeLibrary.set(attr.name, attr);
    });
  }

  /**
   * Load marketplace-specific templates
   */
  private loadMarketplaceTemplates() {
    const marketplaceTemplates: TemplateSchema[] = [
      {
        id: 'namshi_v3',
        name: 'Namshi Fashion Template',
        version: '3.0',
        marketplace: 'namshi',
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
          },
          conditionalFields: {
            'Footwear': ['shoe_size', 'heel_height'],
            'Clothing': ['size', 'fit_type']
          }
        },
        lastUpdated: new Date(),
        isActive: true
      },
      {
        id: 'amazon_v4',
        name: 'Amazon Marketplace Template',
        version: '4.2',
        marketplace: 'amazon',
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
          { name: 'other_image_url1', type: 'string', required: false, priority: 70 },
          { name: 'bullet_point1', type: 'string', required: false, validation: { maxLength: 255 }, priority: 75 },
          { name: 'bullet_point2', type: 'string', required: false, validation: { maxLength: 255 }, priority: 70 },
          { name: 'search_terms', type: 'string', required: false, validation: { maxLength: 1000 }, priority: 65 },
          { name: 'upc', type: 'string', required: false, validation: { pattern: '^[0-9]{12}$' }, priority: 65 },
          { name: 'sustainability_features', type: 'array', required: false, priority: 55 }
        ],
        imageSpecs: { width: 1000, height: 1000, format: 'JPEG', maxSize: '10MB', aspectRatio: '1:1' },
        rules: {
          categoryMappings: {
            'T-Shirts': 'Clothing/Shirts/T-Shirts',
            'Dresses': 'Clothing/Dresses',
            'Shoes': 'Shoes'
          },
          valueMappings: {
            department_name: { 'Men': 'mens', 'Women': 'womens', 'Kids': 'boys' }
          },
          conditionalFields: {
            'Electronics': ['model_number', 'power_consumption'],
            'Clothing': ['size_name', 'material_type']
          }
        },
        lastUpdated: new Date(),
        isActive: true
      }
    ];

    marketplaceTemplates.forEach(template => {
      this.knownTemplates.set(template.id, template);
    });
  }

  /**
   * Analyze uploaded template and adapt to marketplace requirements
   */
  async analyzeAndAdaptTemplate(
    sourceData: ProductData[],
    targetMarketplace: string,
    uploadedTemplate?: any
  ): Promise<TemplateAdaptationResult> {
    
    // Step 1: Analyze source data structure
    const sourceAttributes = this.extractAttributesFromData(sourceData);
    
    // Step 2: Get target marketplace template
    const targetTemplate = this.getMarketplaceTemplate(targetMarketplace);
    if (!targetTemplate) {
      throw new Error(`Unknown marketplace: ${targetMarketplace}`);
    }

    // Step 3: Perform intelligent attribute mapping
    const mappings = await this.performIntelligentMapping(sourceAttributes, targetTemplate.attributes);
    
    // Step 4: Identify new attributes needed
    const newAttributes = this.identifyNewAttributes(sourceAttributes, targetTemplate.attributes);
    
    // Step 5: Identify attributes to remove
    const removedAttributes = this.identifyRemovedAttributes(sourceAttributes, targetTemplate.attributes);
    
    // Step 6: Identify renamed attributes
    const renamedAttributes = this.identifyRenamedAttributes(mappings);
    
    // Step 7: Define transformations
    const transformations = this.defineTransformations(mappings, targetTemplate);
    
    // Step 8: Calculate confidence score
    const confidence = this.calculateAdaptationConfidence(mappings, newAttributes, removedAttributes);
    
    // Step 9: Identify potential issues
    const issues = this.identifyAdaptationIssues(mappings, targetTemplate, sourceData);

    return {
      mappings,
      newAttributes,
      removedAttributes,
      renamedAttributes,
      transformations,
      confidence,
      issues
    };
  }

  /**
   * Extract attribute definitions from source data
   */
  private extractAttributesFromData(data: ProductData[]): AttributeDefinition[] {
    const attributeMap = new Map<string, AttributeDefinition>();
    
    data.forEach(product => {
      Object.entries(product).forEach(([key, value]) => {
        if (!attributeMap.has(key)) {
          const knownAttr = this.attributeLibrary.get(key);
          if (knownAttr) {
            attributeMap.set(key, { ...knownAttr });
          } else {
            // Infer attribute definition
            const inferredAttr = this.inferAttributeDefinition(key, value, data);
            attributeMap.set(key, inferredAttr);
          }
        }
      });
    });

    return Array.from(attributeMap.values());
  }

  /**
   * Infer attribute definition from data
   */
  private inferAttributeDefinition(key: string, value: any, allData: ProductData[]): AttributeDefinition {
    const samples = allData.map(item => item[key]).filter(v => v !== undefined && v !== null);
    
    let type: 'string' | 'number' | 'boolean' | 'array' | 'object' = 'string';
    let validation: any = {};
    
    // Infer type
    if (samples.every(v => typeof v === 'number')) {
      type = 'number';
      validation.min = Math.min(...samples);
      validation.max = Math.max(...samples);
    } else if (samples.every(v => typeof v === 'boolean')) {
      type = 'boolean';
    } else if (samples.every(v => Array.isArray(v))) {
      type = 'array';
    } else if (samples.every(v => typeof v === 'object' && !Array.isArray(v))) {
      type = 'object';
    } else {
      type = 'string';
      const lengths = samples.filter(v => typeof v === 'string').map(v => v.length);
      if (lengths.length > 0) {
        validation.maxLength = Math.max(...lengths);
      }
    }

    // Determine if required (present in most records)
    const presenceRate = samples.length / allData.length;
    const required = presenceRate > 0.8;

    // Determine priority based on key name and presence
    let priority = 50;
    if (key.includes('sku') || key.includes('id')) priority = 100;
    else if (key.includes('title') || key.includes('name')) priority = 95;
    else if (key.includes('price') || key.includes('brand')) priority = 90;
    else if (key.includes('category') || key.includes('description')) priority = 85;
    else if (key.includes('color') || key.includes('size')) priority = 80;
    else if (required) priority += 20;

    return {
      name: key,
      type,
      required,
      validation: Object.keys(validation).length > 0 ? validation : undefined,
      priority
    };
  }

  /**
   * Perform intelligent attribute mapping
   */
  private async performIntelligentMapping(
    sourceAttributes: AttributeDefinition[],
    targetAttributes: AttributeDefinition[]
  ): Promise<AttributeMapping[]> {
    const mappings: AttributeMapping[] = [];

    for (const sourceAttr of sourceAttributes) {
      const bestMatch = this.findBestAttributeMatch(sourceAttr, targetAttributes);
      
      if (bestMatch) {
        const transformation = this.determineTransformation(sourceAttr, bestMatch.target);
        
        mappings.push({
          sourceAttribute: sourceAttr.name,
          targetAttribute: bestMatch.target.name,
          transformation,
          confidence: bestMatch.confidence,
          rule: bestMatch.rule,
          fallback: this.determineFallback(sourceAttr, bestMatch.target)
        });
      }
    }

    return mappings;
  }

  /**
   * Find best attribute match using multiple strategies
   */
  private findBestAttributeMatch(
    sourceAttr: AttributeDefinition,
    targetAttributes: AttributeDefinition[]
  ): { target: AttributeDefinition; confidence: number; rule: string } | null {
    
    let bestMatch: { target: AttributeDefinition; confidence: number; rule: string } | null = null;

    for (const targetAttr of targetAttributes) {
      let confidence = 0;
      let rule = '';

      // Exact name match
      if (sourceAttr.name === targetAttr.name) {
        confidence = 100;
        rule = 'exact_match';
      }
      // Semantic similarity
      else {
        const semanticScore = this.calculateSemanticSimilarity(sourceAttr.name, targetAttr.name);
        if (semanticScore > 0.7) {
          confidence = semanticScore * 90;
          rule = 'semantic_match';
        }
        // Type compatibility
        else if (this.areTypesCompatible(sourceAttr.type, targetAttr.type)) {
          const nameScore = this.calculateStringSimilarity(sourceAttr.name, targetAttr.name);
          if (nameScore > 0.5) {
            confidence = nameScore * 70;
            rule = 'type_compatible';
          }
        }
      }

      // Priority boost for important fields
      if (targetAttr.required && confidence > 0) {
        confidence += 10;
      }

      if (confidence > (bestMatch?.confidence || 0)) {
        bestMatch = { target: targetAttr, confidence, rule };
      }
    }

    return bestMatch && bestMatch.confidence > 50 ? bestMatch : null;
  }

  /**
   * Calculate semantic similarity between attribute names
   */
  private calculateSemanticSimilarity(name1: string, name2: string): number {
    const synonyms: { [key: string]: string[] } = {
      'title': ['name', 'product_name', 'item_name', 'product_title'],
      'brand': ['brand_name', 'manufacturer', 'make'],
      'category': ['product_type', 'item_type', 'classification'],
      'color': ['color_name', 'colour', 'primary_color'],
      'size': ['size_name', 'size_info', 'dimensions'],
      'price': ['list_price', 'selling_price', 'retail_price', 'cost'],
      'description': ['product_description', 'product_desc', 'details'],
      'images': ['image_urls', 'product_images', 'main_image'],
      'gender': ['target_gender', 'department', 'gender_target'],
      'material': ['material_type', 'fabric', 'composition']
    };

    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const norm1 = normalize(name1);
    const norm2 = normalize(name2);

    // Check if they're in the same synonym group
    for (const [key, group] of Object.entries(synonyms)) {
      if ((group.includes(norm1) || norm1 === key) && (group.includes(norm2) || norm2 === key)) {
        return 0.95;
      }
    }

    // Fallback to string similarity
    return this.calculateStringSimilarity(norm1, norm2);
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance
   */
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

  /**
   * Check if types are compatible
   */
  private areTypesCompatible(type1: string, type2: string): boolean {
    if (type1 === type2) return true;
    
    const compatibleTypes: { [key: string]: string[] } = {
      'string': ['number'], // numbers can be converted to strings
      'number': ['string'], // strings can be parsed as numbers
      'array': ['string'], // strings can be split into arrays
      'string': ['array'] // arrays can be joined into strings
    };

    return compatibleTypes[type1]?.includes(type2) || false;
  }

  /**
   * Determine transformation type
   */
  private determineTransformation(
    sourceAttr: AttributeDefinition,
    targetAttr: AttributeDefinition
  ): 'direct' | 'mapped' | 'calculated' | 'generated' | 'split' | 'merged' {
    
    if (sourceAttr.name === targetAttr.name && sourceAttr.type === targetAttr.type) {
      return 'direct';
    }
    
    if (sourceAttr.type !== targetAttr.type) {
      return 'calculated';
    }
    
    if (targetAttr.validation?.enum) {
      return 'mapped';
    }
    
    return 'direct';
  }

  /**
   * Determine fallback value
   */
  private determineFallback(sourceAttr: AttributeDefinition, targetAttr: AttributeDefinition): string | undefined {
    if (targetAttr.validation?.enum) {
      return targetAttr.validation.enum[0];
    }
    
    if (targetAttr.type === 'string' && targetAttr.required) {
      return `Generated ${targetAttr.name}`;
    }
    
    return undefined;
  }

  /**
   * Identify new attributes that need to be added
   */
  private identifyNewAttributes(
    sourceAttributes: AttributeDefinition[],
    targetAttributes: AttributeDefinition[]
  ): AttributeDefinition[] {
    const sourceNames = new Set(sourceAttributes.map(attr => attr.name));
    return targetAttributes.filter(attr => !sourceNames.has(attr.name) && attr.required);
  }

  /**
   * Identify attributes that should be removed
   */
  private identifyRemovedAttributes(
    sourceAttributes: AttributeDefinition[],
    targetAttributes: AttributeDefinition[]
  ): string[] {
    const targetNames = new Set(targetAttributes.map(attr => attr.name));
    return sourceAttributes
      .filter(attr => !targetNames.has(attr.name))
      .map(attr => attr.name);
  }

  /**
   * Identify renamed attributes
   */
  private identifyRenamedAttributes(mappings: AttributeMapping[]): { [oldName: string]: string } {
    const renamed: { [oldName: string]: string } = {};
    
    mappings.forEach(mapping => {
      if (mapping.sourceAttribute !== mapping.targetAttribute && 
          mapping.transformation === 'direct') {
        renamed[mapping.sourceAttribute] = mapping.targetAttribute;
      }
    });
    
    return renamed;
  }

  /**
   * Define transformations for each attribute
   */
  private defineTransformations(
    mappings: AttributeMapping[],
    targetTemplate: TemplateSchema
  ): { [attribute: string]: string } {
    const transformations: { [attribute: string]: string } = {};
    
    mappings.forEach(mapping => {
      const targetAttr = targetTemplate.attributes.find(attr => attr.name === mapping.targetAttribute);
      
      if (targetAttr) {
        switch (mapping.transformation) {
          case 'mapped':
            if (targetAttr.validation?.enum) {
              transformations[mapping.targetAttribute] = `Map to enum: ${targetAttr.validation.enum.join(', ')}`;
            }
            break;
          case 'calculated':
            transformations[mapping.targetAttribute] = `Convert ${mapping.sourceAttribute} from ${this.getSourceType(mapping.sourceAttribute)} to ${targetAttr.type}`;
            break;
          case 'generated':
            transformations[mapping.targetAttribute] = `Generate using AI based on ${mapping.sourceAttribute}`;
            break;
        }
      }
    });
    
    return transformations;
  }

  /**
   * Get source attribute type (helper method)
   */
  private getSourceType(attributeName: string): string {
    const attr = this.attributeLibrary.get(attributeName);
    return attr?.type || 'unknown';
  }

  /**
   * Calculate adaptation confidence
   */
  private calculateAdaptationConfidence(
    mappings: AttributeMapping[],
    newAttributes: AttributeDefinition[],
    removedAttributes: string[]
  ): number {
    const totalMappings = mappings.length;
    const highConfidenceMappings = mappings.filter(m => m.confidence > 80).length;
    const mediumConfidenceMappings = mappings.filter(m => m.confidence > 60 && m.confidence <= 80).length;
    
    let score = 0;
    if (totalMappings > 0) {
      score = (highConfidenceMappings * 100 + mediumConfidenceMappings * 70) / totalMappings;
    }
    
    // Penalize for many new attributes or removed attributes
    const penalty = (newAttributes.length * 5) + (removedAttributes.length * 3);
    score = Math.max(0, score - penalty);
    
    return Math.round(score);
  }

  /**
   * Identify potential adaptation issues
   */
  private identifyAdaptationIssues(
    mappings: AttributeMapping[],
    targetTemplate: TemplateSchema,
    sourceData: ProductData[]
  ): string[] {
    const issues: string[] = [];
    
    // Check for unmapped required fields
    const mappedTargets = new Set(mappings.map(m => m.targetAttribute));
    const unmappedRequired = targetTemplate.attributes
      .filter(attr => attr.required && !mappedTargets.has(attr.name));
    
    unmappedRequired.forEach(attr => {
      issues.push(`Required field '${attr.name}' has no mapping and will need to be generated`);
    });
    
    // Check for low confidence mappings
    const lowConfidenceMappings = mappings.filter(m => m.confidence < 60);
    lowConfidenceMappings.forEach(mapping => {
      issues.push(`Low confidence mapping: ${mapping.sourceAttribute} → ${mapping.targetAttribute} (${mapping.confidence}%)`);
    });
    
    // Check for data quality issues
    const sampleSize = Math.min(100, sourceData.length);
    const sample = sourceData.slice(0, sampleSize);
    
    mappings.forEach(mapping => {
      const values = sample.map(item => item[mapping.sourceAttribute]).filter(v => v !== undefined);
      const nullRate = (sampleSize - values.length) / sampleSize;
      
      if (nullRate > 0.3) {
        issues.push(`High null rate (${Math.round(nullRate * 100)}%) for ${mapping.sourceAttribute}`);
      }
    });
    
    return issues;
  }

  /**
   * Get marketplace template by ID or marketplace name
   */
  private getMarketplaceTemplate(marketplace: string): TemplateSchema | null {
    // Try to find by marketplace name
    for (const template of this.knownTemplates.values()) {
      if (template.marketplace === marketplace && template.isActive) {
        return template;
      }
    }
    
    // Try to find by ID
    return this.knownTemplates.get(marketplace) || null;
  }

  /**
   * Apply template adaptation to product data
   */
  async applyTemplateAdaptation(
    productData: ProductData,
    adaptationResult: TemplateAdaptationResult
  ): Promise<ProductData> {
    const adaptedProduct: ProductData = { ...productData };
    
    // Apply mappings using for...of loop to handle async operations properly
    for (const mapping of adaptationResult.mappings) {
      const sourceValue = productData[mapping.sourceAttribute];
      
      if (sourceValue !== undefined) {
        switch (mapping.transformation) {
          case 'direct':
            adaptedProduct[mapping.targetAttribute] = sourceValue;
            break;
          case 'mapped':
            adaptedProduct[mapping.targetAttribute] = this.applyValueMapping(sourceValue, mapping);
            break;
          case 'calculated':
            adaptedProduct[mapping.targetAttribute] = this.applyCalculation(sourceValue, mapping);
            break;
          case 'generated':
            adaptedProduct[mapping.targetAttribute] = await this.generateValue(sourceValue, mapping);
            break;
        }
      } else if (mapping.fallback) {
        adaptedProduct[mapping.targetAttribute] = mapping.fallback;
      }
    }
    
    // Remove unmapped attributes
    adaptationResult.removedAttributes.forEach(attrName => {
      delete adaptedProduct[attrName];
    });
    
    // Add default values for new required attributes
    adaptationResult.newAttributes.forEach(attr => {
      if (attr.required && !adaptedProduct[attr.name]) {
        adaptedProduct[attr.name] = this.getDefaultValue(attr);
      }
    });
    
    return adaptedProduct;
  }

  /**
   * Apply value mapping
   */
  private applyValueMapping(value: any, mapping: AttributeMapping): any {
    // This would contain marketplace-specific value mappings
    const valueMappings: { [key: string]: { [key: string]: string } } = {
      gender: {
        'M': 'Men', 'F': 'Women', 'U': 'Unisex',
        'Male': 'Men', 'Female': 'Women'
      },
      department: {
        'Men': 'mens', 'Women': 'womens', 'Kids': 'boys'
      }
    };
    
    const mappingKey = mapping.targetAttribute.toLowerCase();
    if (valueMappings[mappingKey] && valueMappings[mappingKey][value]) {
      return valueMappings[mappingKey][value];
    }
    
    return value;
  }

  /**
   * Apply calculation/transformation
   */
  private applyCalculation(value: any, mapping: AttributeMapping): any {
    // Type conversions and calculations
    if (typeof value === 'string' && mapping.targetAttribute.includes('price')) {
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
      return isNaN(numericValue) ? 0 : numericValue;
    }
    
    if (typeof value === 'number' && mapping.targetAttribute.includes('name')) {
      return value.toString();
    }
    
    if (Array.isArray(value) && mapping.targetAttribute.includes('url')) {
      return value[0] || '';
    }
    
    return value;
  }

  /**
   * Generate value using AI or rules
   */
  private async generateValue(sourceValue: any, mapping: AttributeMapping): Promise<any> {
    // This would integrate with AI services for content generation
    // For now, return a rule-based generated value
    
    if (mapping.targetAttribute.includes('description')) {
      return `Premium ${sourceValue} with excellent quality and design.`;
    }
    
    if (mapping.targetAttribute.includes('title')) {
      return `High-Quality ${sourceValue}`;
    }
    
    return `Generated ${mapping.targetAttribute}`;
  }

  /**
   * Get default value for attribute
   */
  private getDefaultValue(attr: AttributeDefinition): any {
    switch (attr.type) {
      case 'string':
        return attr.validation?.enum?.[0] || '';
      case 'number':
        return attr.validation?.min || 0;
      case 'boolean':
        return false;
      case 'array':
        return [];
      case 'object':
        return {};
      default:
        return null;
    }
  }

  /**
   * Update marketplace template
   */
  async updateMarketplaceTemplate(
    marketplace: string,
    newTemplate: Partial<TemplateSchema>
  ): Promise<void> {
    const existingTemplate = this.getMarketplaceTemplate(marketplace);
    
    if (existingTemplate) {
      const updatedTemplate: TemplateSchema = {
        ...existingTemplate,
        ...newTemplate,
        lastUpdated: new Date(),
        version: this.incrementVersion(existingTemplate.version)
      };
      
      this.knownTemplates.set(updatedTemplate.id, updatedTemplate);
    }
  }

  /**
   * Increment version number
   */
  private incrementVersion(version: string): string {
    const parts = version.split('.');
    const patch = parseInt(parts[parts.length - 1]) + 1;
    parts[parts.length - 1] = patch.toString();
    return parts.join('.');
  }

  /**
   * Get all supported marketplaces
   */
  getSupportedMarketplaces(): string[] {
    return Array.from(new Set(
      Array.from(this.knownTemplates.values())
        .filter(template => template.isActive)
        .map(template => template.marketplace)
    ));
  }

  /**
   * Get template by marketplace
   */
  getTemplateByMarketplace(marketplace: string): TemplateSchema | null {
    return this.getMarketplaceTemplate(marketplace);
  }
}

export const templateAdaptationService = new TemplateAdaptationService();