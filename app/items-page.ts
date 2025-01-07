import { NavigatedData, Page, Frame, ItemEventData } from '@nativescript/core';
import { ItemsViewModel } from './items-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const category = args.context?.category || 'Dairy';
    page.bindingContext = new ItemsViewModel(category);
}

export function onBackButtonTap() {
    Frame.topmost().goBack();
}

export function onItemTap(args: ItemEventData) {
    const item = args.view.bindingContext;
    Frame.topmost().navigate({
        moduleName: 'item-detail-page',
        context: { item },
        animated: true
    });
}