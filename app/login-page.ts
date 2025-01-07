import { NavigatedData, Page, Frame } from '@nativescript/core';
import { LoginViewModel } from './login-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new LoginViewModel();
}

export function onCategoryTap(args: any) {
    const tappedView = args.object;
    const category = tappedView.get('category');
    
    Frame.topmost().navigate({
        moduleName: 'items-page',
        context: {
            category: category
        },
        animated: true
    });
}

export function onCartTap() {
    Frame.topmost().navigate('cart-page');
}