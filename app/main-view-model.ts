import { Observable, Frame } from '@nativescript/core';
import { cartService } from './services/cart-service';
import { authService } from './services/auth-service';

export class MainViewModel extends Observable {
    private _cartItemCount: number = 0;
    private _isLoggedIn: boolean = false;
    private _showBack: boolean = false;

    constructor() {
        super();
        this.updateState();
        
        cartService.on(Observable.propertyChangeEvent, (data: any) => {
            if (data.propertyName === 'cartUpdated') {
                this.updateCartCount();
            }
        });

        authService.on(Observable.propertyChangeEvent, (data: any) => {
            if (data.propertyName === 'isLoggedIn') {
                this.updateState();
            }
        });
    }

    private updateState() {
        this._isLoggedIn = authService.isLoggedIn;
        this.notifyPropertyChange('isLoggedIn', this._isLoggedIn);
        this.updateCartCount();
    }

    private updateCartCount() {
        const items = cartService.getItems();
        this._cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        this.notifyPropertyChange('cartItemCount', this._cartItemCount);
    }

    get cartItemCount(): number {
        return this._cartItemCount;
    }

    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    get showBack(): boolean {
        return this._showBack;
    }

    onTitleTap() {
        Frame.topmost().navigate({
            moduleName: 'main-page',
            clearHistory: true
        });
    }

    onProfileTap() {
        if (this._isLoggedIn) {
            Frame.topmost().navigate('profile-page');
        } else {
            Frame.topmost().navigate('login-page');
        }
    }

    onCartTap() {
        Frame.topmost().navigate('cart-page');
    }
}