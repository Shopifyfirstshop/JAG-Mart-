import { Observable, ApplicationSettings } from '@nativescript/core';

class CategoryService extends Observable {
    private static instance: CategoryService;
    private categories: string[] = [];

    private constructor() {
        super();
        this.loadCategories();
    }

    static getInstance(): CategoryService {
        if (!CategoryService.instance) {
            CategoryService.instance = new CategoryService();
        }
        return CategoryService.instance;
    }

    getCategories(): string[] {
        return [...this.categories];
    }

    addCategory(name: string): boolean {
        const normalizedName = name.trim();
        if (!normalizedName) return false;
        
        if (this.categories.includes(normalizedName)) return false;
        
        this.categories.push(normalizedName);
        this.saveCategories();
        return true;
    }

    removeCategory(name: string): boolean {
        const index = this.categories.indexOf(name);
        if (index === -1) return false;
        
        this.categories.splice(index, 1);
        this.saveCategories();
        return true;
    }

    private loadCategories() {
        const defaultCategories = ['Dairy', 'Grains', 'Spices', 'Oils', 'Bulk'];
        const savedCategories = ApplicationSettings.getString('categories', '');
        
        if (savedCategories) {
            this.categories = JSON.parse(savedCategories);
        } else {
            this.categories = defaultCategories;
            this.saveCategories();
        }
    }

    private saveCategories() {
        ApplicationSettings.setString('categories', JSON.stringify(this.categories));
        this.notifyPropertyChange('categoriesUpdated', null);
    }
}

export const categoryService = CategoryService.getInstance();