import { Observable } from '@nativescript/core';
import { productService } from './services/product-service';
import { PageBaseViewModel } from './shared/page-base';

export class ItemsViewModel extends PageBaseViewModel {
    private _items: Array<any>;
    private _categoryName: string;
    private categories = ['Dairy', 'Grains', 'Spices', 'Oils', 'Bulk'];

    constructor(category: string) {
        super(true); // Show back button
        this._categoryName = category;
        
        // Initialize all categories first
        this.categories.forEach(cat => {
            const products = productService.getProducts(cat);
            if (products.length === 0) {
                const defaultItems = this.getDefaultItems(cat);
                defaultItems.forEach(item => {
                    productService.addProduct({
                        name: item,
                        category: cat,
                        price: 100,
                        inStock: true
                    });
                });
            }
        });

        // Then get items for the selected category
        this._items = productService.getProducts(category);
        this.set('items', this._items);
        this.set('categoryName', this._categoryName);

        productService.on(Observable.propertyChangeEvent, (data: any) => {
            if (data.propertyName === 'productsUpdated') {
                this._items = productService.getProducts(this._categoryName);
                this.set('items', this._items);
            }
        });
    }

    private getDefaultItems(category: string): Array<string> {
        const categoryItems = {
            'Dairy': ['Milk', 'Curd', 'Butter', 'Ghee', 'Buttermilk'],
            'Grains': ['Wheat', 'Tur Dal', 'Rice', 'Barley', 'Moong Dal'],
            'Spices': ['Bay Leaf', 'Cinnamon', 'Cardamom', 'Clove', 'Black Pepper'],
            'Oils': ['Olive', 'Sunflower', 'Soybean', 'Rice Bran', 'Palm'],
            'Bulk': [
                'Wheat', 'Tur Dal', 'Rice', 'Barley', 'Moong Dal',
                'Bay Leaf', 'Cinnamon', 'Cardamom', 'Clove', 'Black Pepper',
                'Olive Oil', 'Sunflower Oil', 'Soybean Oil', 'Rice Bran Oil', 'Palm Oil'
            ]
        };

        return categoryItems[category] || [];
    }
}