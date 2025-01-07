import { Observable } from '@nativescript/core';
import { cartService } from './services/cart-service';
import { productService } from './services/product-service';

export class ItemDetailViewModel extends Observable {
    private _item: any;
    private _quantity: number = 1;

    constructor(item: any) {
        super();
        this._item = item;
        this.set('item', this._item);
        this.set('quantity', this._quantity);

        productService.on(Observable.propertyChangeEvent, (data: any) => {
            if (data.propertyName === 'productsUpdated') {
                const updatedProduct = productService.getProducts().find(p => p.id === this._item.id);
                if (updatedProduct) {
                    this._item = updatedProduct;
                    this.set('item', this._item);
                }
            }
        });
    }

    increaseQuantity() {
        this._quantity++;
        this.set('quantity', this._quantity);
    }

    decreaseQuantity() {
        if (this._quantity > 1) {
            this._quantity--;
            this.set('quantity', this._quantity);
        }
    }

    onAddToCart() {
        if (this._item.inStock) {
            cartService.addItem(this._item.name, this._item.price, this._quantity);
        }
    }
}