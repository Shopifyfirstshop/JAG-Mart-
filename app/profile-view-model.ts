import { Observable, Frame } from '@nativescript/core';
import { authService } from './services/auth-service';
import { PageBaseViewModel } from './shared/page-base';

export class ProfileViewModel extends PageBaseViewModel {
    constructor() {
        super(true); // Show back button
        const user = authService.getCurrentUser();
        this.set('user', user);
        this.set('isAdmin', authService.isAdmin());
    }

    onAdminPanel() {
        Frame.topmost().navigate('admin/admin-page');
    }

    onLogout() {
        authService.logout();
        Frame.topmost().navigate({
            moduleName: 'login-page',
            clearHistory: true
        });
    }
}