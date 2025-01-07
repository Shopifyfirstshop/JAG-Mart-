import { Observable, Frame } from '@nativescript/core';
import { cartService } from '../services/cart-service';
import { authService } from '../services/auth-service';

export class PageBaseViewModel extends Observable {
    constructor(showBack: boolean = true) {
        super();
        
        // Set initial values
        this.set('showBack', showBack);
        this.set('cartItemCount', 0);
        this.set('isLoggedIn', authService.isLoggedIn);
        
        // Listen for cart updates
        cartService.on(Observable.propertyChangeEvent, (data: any) => {
            if (data.propertyName === 'cartUpdated') {
                this.set('cartItemCount', data.value.itemCount);
            }
        });
        
        // Listen for auth changes
        authService.on(Observable.propertyChangeEvent, (data: any) => {
            if (data.propertyName === 'isLoggedIn') {
                this.set('isLoggedIn', data.value);
            }
        });
    }

    onTitleTap() {
        Frame.topmost().navigate({
            moduleName: 'main-page',
            clearHistory: true
        });
    }

    onProfileTap() {
        if (authService.isLoggedIn) {
            Frame.topmost().navigate('profile-page');
        } else {
            Frame.topmost().navigate('login-page');
        }
    }

    onCartTap() {
        Frame.topmost().navigate('cart-page');
    }

    onBackButtonTap() {
        Frame.topmost().goBack();
    }
}