import { Observable, Frame } from '@nativescript/core';
import { authService } from '../services/auth-service';

export class UserProfileViewModel extends Observable {
    private _user: any;

    constructor(user: any) {
        super();
        this._user = user;
        this.set('user', this._user);
    }

    onToggleAdmin() {
        if (this._user.email === 'admin@jagmart.com') return;

        const success = authService.updateUser(this._user.id, {
            isAdmin: !this._user.isAdmin
        });

        if (success) {
            this._user.isAdmin = !this._user.isAdmin;
            this.notifyPropertyChange('user', this._user);
        }
    }

    onBackButtonTap() {
        Frame.topmost().goBack();
    }
}