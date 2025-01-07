import { NavigatedData, Page, Frame } from '@nativescript/core';
import { UserProfileViewModel } from './user-profile-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const user = args.context.user;
    page.bindingContext = new UserProfileViewModel(user);
}

export function onBackButtonTap() {
    Frame.topmost().goBack();
}