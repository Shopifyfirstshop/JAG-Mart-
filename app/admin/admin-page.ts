import { NavigatedData, Page, Frame } from '@nativescript/core';
import { AdminViewModel } from './admin-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new AdminViewModel();
}

export function onBackButtonTap() {
    Frame.topmost().goBack();
}