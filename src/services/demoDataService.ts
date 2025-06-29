import { ProductData } from './aiService';

export interface DemoProduct extends ProductData {
  id: string;
}

class DemoDataService {
  private demoProducts: DemoProduct[] = [
    {
      id: '1',
      sku: 'TSH001',
      title: 'Premium Cotton T-Shirt',
      brand: 'FashionCo',
      category: 'T-Shirts',
      material: 'Cotton',
      gender: 'Men',
      color: 'Navy Blue',
      size: 'L',
      description: 'Comfortable premium cotton t-shirt perfect for casual wear',
      price: 29.99,
      images: [
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    {
      id: '2',
      sku: 'DRS002',
      title: 'Summer Floral Dress',
      brand: 'BreezyWear',
      category: 'Dresses',
      material: 'Polyester',
      gender: 'Women',
      color: 'Floral Print',
      size: 'M',
      description: 'Light and airy summer dress with beautiful floral patterns',
      price: 45.50,
      images: [
        'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    {
      id: '3',
      sku: 'JKT003',
      title: 'Denim Jacket',
      brand: 'UrbanStyle',
      category: 'Jackets',
      material: 'Denim',
      gender: 'Unisex',
      color: 'Blue',
      size: 'L',
      description: 'Classic denim jacket with modern fit and vintage appeal',
      price: 79.99,
      images: [
        'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    {
      id: '4',
      sku: 'SHO004',
      title: 'Running Sneakers',
      brand: 'ActiveGear',
      category: 'Shoes',
      material: 'Synthetic',
      gender: 'Men',
      color: 'Black/White',
      size: '10',
      description: 'High-performance running sneakers with advanced cushioning',
      price: 120.00,
      images: [
        'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    {
      id: '5',
      sku: 'BAG005',
      title: 'Leather Handbag',
      brand: 'LuxeLeather',
      category: 'Bags',
      material: 'Leather',
      gender: 'Women',
      color: 'Brown',
      size: 'One Size',
      description: 'Elegant leather handbag perfect for professional and casual use',
      price: 89.99,
      images: [
        'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    }
  ];

  getDemoProducts(): DemoProduct[] {
    return [...this.demoProducts];
  }

  generateSampleCSV(): string {
    const headers = [
      'SKU',
      'Product Name',
      'Brand',
      'Category',
      'Material',
      'Gender',
      'Color',
      'Size',
      'Description',
      'Price',
      'Images'
    ];

    const rows = this.demoProducts.map(product => [
      product.sku,
      product.title,
      product.brand,
      product.category,
      product.material || '',
      product.gender || '',
      product.color || '',
      product.size || '',
      product.description || '',
      product.price?.toString() || '',
      product.images?.join(';') || ''
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  downloadSampleCSV(): void {
    const csvContent = this.generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_catalog.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  createDemoFileProcessingResult() {
    return {
      data: this.demoProducts,
      errors: [],
      totalRows: this.demoProducts.length,
      validRows: this.demoProducts.length,
      fileName: 'demo_catalog.csv'
    };
  }
}

export const demoDataService = new DemoDataService();