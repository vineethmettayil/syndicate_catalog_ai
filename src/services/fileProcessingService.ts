import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { ProductData } from './aiService';

export interface FileProcessingResult {
  data: ProductData[];
  errors: string[];
  totalRows: number;
  validRows: number;
  fileName: string;
}

export interface FieldMapping {
  [sourceField: string]: string; // Maps source field to standard field name
}

class FileProcessingService {
  // Standard field mappings for common variations
  private standardFieldMappings: FieldMapping = {
    // SKU variations
    'sku': 'sku',
    'sku_id': 'sku',
    'product_id': 'sku',
    'item_id': 'sku',
    'id': 'sku',
    
    // Title variations
    'title': 'title',
    'product_name': 'title',
    'product_title': 'title',
    'name': 'title',
    'item_name': 'title',
    
    // Brand variations
    'brand': 'brand',
    'brand_name': 'brand',
    'manufacturer': 'brand',
    
    // Category variations
    'category': 'category',
    'product_type': 'category',
    'item_type': 'category',
    'category_path': 'category',
    'product_category': 'category',
    
    // Material variations
    'material': 'material',
    'material_type': 'material',
    'fabric': 'material',
    'fabric_material': 'material',
    
    // Gender variations
    'gender': 'gender',
    'target_gender': 'gender',
    'gender_target': 'gender',
    'department': 'gender',
    
    // Color variations
    'color': 'color',
    'color_name': 'color',
    'primary_color': 'color',
    'color_desc': 'color',
    
    // Size variations
    'size': 'size',
    'size_name': 'size',
    'size_info': 'size',
    
    // Description variations
    'description': 'description',
    'product_description': 'description',
    'product_desc': 'description',
    'long_description': 'description',
    
    // Price variations
    'price': 'price',
    'selling_price': 'price',
    'list_price': 'price',
    'retail_price': 'price',
    'unit_price': 'price',
    
    // Image variations
    'images': 'images',
    'image_urls': 'images',
    'product_images': 'images',
    'main_image': 'images',
    'image_url': 'images'
  };

  /**
   * Process Excel file and extract product data
   */
  async processExcelFile(file: File): Promise<FileProcessingResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          const result = this.processRawData(jsonData, file.name);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to process Excel file: ${error.message}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read Excel file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Process CSV file and extract product data
   */
  async processCSVFile(file: File): Promise<FileProcessingResult> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            // Convert Papa Parse results to our format
            const headers = results.meta.fields || [];
            const rows = results.data.map(row => 
              headers.map(header => row[header] || '')
            );
            const rawData = [headers, ...rows];
            
            const result = this.processRawData(rawData, file.name);
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to process CSV file: ${error.message}`));
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        }
      });
    });
  }

  /**
   * Process raw data array and convert to ProductData format
   */
  private processRawData(rawData: any[][], fileName: string): FileProcessingResult {
    const errors: string[] = [];
    const products: ProductData[] = [];
    
    if (rawData.length < 2) {
      return {
        data: [],
        errors: ['File must contain at least a header row and one data row'],
        totalRows: rawData.length,
        validRows: 0,
        fileName
      };
    }

    // Extract headers and normalize them
    const headers = rawData[0].map((header: string) => 
      this.normalizeFieldName(header.toString())
    );
    
    // Validate that we have essential fields
    const hasRequiredFields = this.validateRequiredFields(headers);
    if (!hasRequiredFields.isValid) {
      errors.push(`Missing required fields: ${hasRequiredFields.missing.join(', ')}`);
    }

    // Process data rows
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      
      try {
        const product = this.convertRowToProduct(headers, row, i + 1);
        if (product) {
          products.push(product);
        }
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    return {
      data: products,
      errors,
      totalRows: rawData.length - 1, // Exclude header
      validRows: products.length,
      fileName
    };
  }

  /**
   * Convert a single row to ProductData format
   */
  private convertRowToProduct(headers: string[], row: any[], rowNumber: number): ProductData | null {
    const product: ProductData = {
      sku: '',
      title: '',
      brand: '',
      category: ''
    };

    // Map each field
    headers.forEach((header, index) => {
      const value = row[index];
      const standardField = this.getStandardFieldName(header);
      
      if (standardField && value !== undefined && value !== null && value !== '') {
        if (standardField === 'images') {
          // Handle image URLs - split by comma or semicolon
          product[standardField] = this.parseImageUrls(value.toString());
        } else if (standardField === 'price') {
          // Parse price as number
          const numericValue = this.parsePrice(value.toString());
          if (numericValue !== null) {
            product[standardField] = numericValue;
          }
        } else {
          product[standardField] = value.toString().trim();
        }
      }
    });

    // Validate essential fields
    if (!product.sku) {
      throw new Error('SKU is required');
    }

    if (!product.title) {
      throw new Error('Product title is required');
    }

    return product;
  }

  /**
   * Normalize field names for consistent mapping
   */
  private normalizeFieldName(fieldName: string): string {
    return fieldName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /**
   * Get standard field name from normalized field name
   */
  private getStandardFieldName(normalizedField: string): string | null {
    return this.standardFieldMappings[normalizedField] || null;
  }

  /**
   * Validate that required fields are present
   */
  private validateRequiredFields(headers: string[]): { isValid: boolean; missing: string[] } {
    const requiredFields = ['sku', 'title'];
    const standardFields = headers
      .map(header => this.getStandardFieldName(header))
      .filter(field => field !== null);

    const missing = requiredFields.filter(field => !standardFields.includes(field));
    
    return {
      isValid: missing.length === 0,
      missing
    };
  }

  /**
   * Parse image URLs from string
   */
  private parseImageUrls(imageString: string): string[] {
    if (!imageString) return [];
    
    // Split by common delimiters and clean up
    return imageString
      .split(/[,;|\n]/)
      .map(url => url.trim())
      .filter(url => url.length > 0 && this.isValidUrl(url));
  }

  /**
   * Parse price from string
   */
  private parsePrice(priceString: string): number | null {
    if (!priceString) return null;
    
    // Remove currency symbols and spaces
    const cleanPrice = priceString
      .replace(/[^\d.,]/g, '')
      .replace(/,/g, '.');
    
    const numericValue = parseFloat(cleanPrice);
    return isNaN(numericValue) ? null : numericValue;
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get field mapping suggestions for user review
   */
  getFieldMappingSuggestions(headers: string[]): { [key: string]: string[] } {
    const suggestions: { [key: string]: string[] } = {};
    
    headers.forEach(header => {
      const normalized = this.normalizeFieldName(header);
      const standardField = this.getStandardFieldName(normalized);
      
      if (standardField) {
        if (!suggestions[standardField]) {
          suggestions[standardField] = [];
        }
        suggestions[standardField].push(header);
      }
    });
    
    return suggestions;
  }

  /**
   * Validate file format
   */
  validateFileFormat(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'application/csv'
    ];

    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file format. Please upload Excel (.xlsx, .xls) or CSV files only.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size exceeds 50MB limit.'
      };
    }

    return { isValid: true };
  }
}

export const fileProcessingService = new FileProcessingService();