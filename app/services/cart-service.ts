import { Observable } from '@nativescript/core';
import { ApplicationSettings } from '@nativescript/core';
import { productService } from './product-service';

export interface CartItem {
    name: string;
    price: number;
    quantity: number;
}

class CartService extends Observable {
    private static instance: CartService;
    private items: Map<string, CartItem> = new Map();
    
    private constructor() {
        super();
        this.loadCart();
    }

    static getInstance(): CartService {
        if (!CartService.instance) {
            CartService.instance = new CartService();
        }
        return CartService.instance;
    }

    addItem(name: string, price: number, quantity: number = 1) {
        const existingItem = this.items.get(name);
        if (existingItem) {
            existingItem.quantity += quantity;
            this.items.set(name, existingItem);
        } else {
            // Use the provided price from the product
            this.items.set(name, { name, price, quantity });
        }
        this.updateTotals();
        this.saveCart();
    }

    removeItem(name: string) {
        const item = this.items.get(name);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
                this.items.set(name, item);
            } else {
                this.items.delete(name);
            }
            this.updateTotals();
            this.saveCart();
        }
    }

    getItems(): CartItem[] {
        return Array.from(this.items.values());
    }

    private updateTotals() {
        const itemCount = Array.from(this.items.values()).reduce((sum, item) => sum + item.quantity, 0);
        const total = Array.from(this.items.values()).reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        this.notify({
            object: this,
            eventName: Observable.propertyChangeEvent,
            propertyName: 'cartUpdated',
            value: { itemCount, total }
        });
    }

    private saveCart() {
        const cartData = JSON.stringify(Array.from(this.items.entries()));
        ApplicationSettings.setString('cart', cartData);
    }

    private loadCart() {
        const cartData = ApplicationSettings.getString('cart', '[]');
        try {
            const entries = JSON.parse(cartData);
            this.items = new Map(entries);
            this.updateTotals();
        } catch (error) {
            console.error('Error loading cart:', error);
            this.items = new Map();
        }
    }
}

export const cartService = CartService.getInstance();