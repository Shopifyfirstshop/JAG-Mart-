import { Observable, ApplicationSettings } from '@nativescript/core';

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    inStock: boolean;
}

class ProductService extends Observable {
    private static instance: ProductService;
    private products: Map<string, Product> = new Map();

    private constructor() {
        super();
        this.loadProducts();
    }

    static getInstance(): ProductService {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }

    addProduct(product: Omit<Product, 'id'>): Product {
        const id = product.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        const newProduct = { ...product, id };
        this.products.set(id, newProduct);
        this.saveProducts();
        return newProduct;
    }

    updateProduct(id: string, updates: Partial<Product>): boolean {
        const product = this.products.get(id);
        if (product) {
            this.products.set(id, { ...product, ...updates });
            this.saveProducts();
            return true;
        }
        return false;
    }

    removeProduct(id: string): boolean {
        const result = this.products.delete(id);
        if (result) {
            this.saveProducts();
        }
        return result;
    }

    getProducts(category?: string): Product[] {
        const allProducts = Array.from(this.products.values());
        return category 
            ? allProducts.filter(p => p.category === category)
            : allProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    private saveProducts() {
        const productsData = JSON.stringify(Array.from(this.products.entries()));
        ApplicationSettings.setString('products', productsData);
        this.notifyPropertyChange('productsUpdated', null);
    }

    private loadProducts() {
        const productsData = ApplicationSettings.getString('products', '[]');
        try {
            const entries = JSON.parse(productsData);
            this.products = new Map(entries);
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = new Map();
        }
    }
}

export const productService = ProductService.getInstance();