import { NavigatedData, Page, Frame } from '@nativescript/core';
import { RegisterViewModel } from './register-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new RegisterViewModel();
}

export function onBackButtonTap() {
    Frame.topmost().goBack();
}