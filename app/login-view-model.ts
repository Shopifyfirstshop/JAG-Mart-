import { Observable, Frame } from '@nativescript/core';
import { authService } from './services/auth-service';
import { cartService } from './services/cart-service';

export class LoginViewModel extends Observable {
    private _email: string = '';
    private _password: string = '';
    private _errorMessage: string = '';
    private _cartItemCount: number = 0;

    constructor() {
        super();
        this.updateCartCount();
        
        cartService.on(Observable.propertyChangeEvent, (data: any) => {
            if (data.propertyName === 'cartUpdated') {
                this.updateCartCount();
            }
        });
    }

    private updateCartCount() {
        const items = cartService.getItems();
        this._cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        this.notifyPropertyChange('cartItemCount', this._cartItemCount);
    }

    get cartItemCount(): number {
        return this._cartItemCount;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        if (this._email !== value) {
            this._email = value;
            this.notifyPropertyChange('email', value);
        }
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange('password', value);
        }
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    set errorMessage(value: string) {
        if (this._errorMessage !== value) {
            this._errorMessage = value;
            this.notifyPropertyChange('errorMessage', value);
        }
    }

    async onLogin() {
        try {
            this.errorMessage = '';
            await authService.login(this.email, this.password);
            Frame.topmost().navigate({
                moduleName: 'main-page',
                clearHistory: true
            });
        } catch (error) {
            this.errorMessage = error.message;
        }
    }

    onRegisterTap() {
        Frame.topmost().navigate('register-page');
    }
}