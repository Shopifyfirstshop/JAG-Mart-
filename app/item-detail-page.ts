import { NavigatedData, Page, Frame } from '@nativescript/core';
import { ItemDetailViewModel } from './item-detail-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const context = args.context;
    page.bindingContext = new ItemDetailViewModel(context.item);
}

export function onBackButtonTap() {
    Frame.topmost().goBack();
}