import { NavigatedData, Page, Frame } from '@nativescript/core';
import { CartViewModel } from './cart-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new CartViewModel();
}

export function onBackButtonTap() {
    Frame.topmost().goBack();
}