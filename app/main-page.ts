import { EventData, Page, Frame } from '@nativescript/core';
import { MainViewModel } from './main-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    if (!page.bindingContext) {
        page.bindingContext = new MainViewModel();
    }
}

export function onCategoryTap(args: EventData) {
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