import { Observable, Frame, alert } from '@nativescript/core';
import { cartService } from './services/cart-service';
import { authService } from './services/auth-service';
import { PageBaseViewModel } from './shared/page-base';

export class CartViewModel extends PageBaseViewModel {
    constructor() {
        super(true); // Show back button
        this.updateCart();
        
        cartService.on(Observable.propertyChangeEvent, (data: any) => {
            if (data.propertyName === 'cartUpdated') {
                this.updateCart();
            }
        });
    }

    private updateCart() {
        this.set('cartItems', cartService.getItems());
        const total = cartService.getItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.set('total', total);
    }

    onRemoveFromCart(args) {
        const item = args.object.bindingContext;
        cartService.removeItem(item.name);
    }

    onCheckout() {
        if (!authService.isLoggedIn) {
            alert({
                title: "Login Required",
                message: "Please login or register to complete your purchase.",
                okButtonText: "Login",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result) {
                    Frame.topmost().navigate('login-page');
                }
            });
            return;
        }

        alert({
            title: "Success",
            message: "Thank you for shopping with JAG Mart!",
            okButtonText: "OK"
        }).then(() => {
            Frame.topmost().navigate('main-page');
        });
    }
}