import { Observable, Frame } from '@nativescript/core';
import { authService } from './services/auth-service';

export class RegisterViewModel extends Observable {
    private _firstName: string = '';
    private _lastName: string = '';
    private _email: string = '';
    private _phoneNumber: string = '';
    private _address: string = '';
    private _password: string = '';
    private _errorMessage: string = '';

    constructor() {
        super();
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        if (this._firstName !== value) {
            this._firstName = value;
            this.notifyPropertyChange('firstName', value);
            this.notifyPropertyChange('canRegister', this.canRegister);
        }
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        if (this._lastName !== value) {
            this._lastName = value;
            this.notifyPropertyChange('lastName', value);
            this.notifyPropertyChange('canRegister', this.canRegister);
        }
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        if (this._email !== value) {
            this._email = value;
            this.notifyPropertyChange('email', value);
            this.notifyPropertyChange('canRegister', this.canRegister);
        }
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    set phoneNumber(value: string) {
        if (this._phoneNumber !== value) {
            this._phoneNumber = value;
            this.notifyPropertyChange('phoneNumber', value);
            this.notifyPropertyChange('canRegister', this.canRegister);
        }
    }

    get address(): string {
        return this._address;
    }

    set address(value: string) {
        if (this._address !== value) {
            this._address = value;
            this.notifyPropertyChange('address', value);
            this.notifyPropertyChange('canRegister', this.canRegister);
        }
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange('password', value);
            this.notifyPropertyChange('canRegister', this.canRegister);
        }
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    set errorMessage(value: string) {
        if (this._errorMessage !== value) {
            this._errorMessage = value;
            this.notifyPropertyChange('errorMessage', value);
        }
    }

    get canRegister(): boolean {
        return (
            this._firstName.trim() !== '' &&
            this._lastName.trim() !== '' &&
            this._email.trim() !== '' &&
            this._phoneNumber.trim() !== '' &&
            this._address.trim() !== '' &&
            this._password.trim() !== ''
        );
    }

    async onRegister() {
        try {
            this.errorMessage = '';
            if (!this.canRegister) {
                this.errorMessage = 'Please fill all fields';
                return;
            }

            await authService.register({
                email: this.email,
                password: this.password,
                firstName: this.firstName,
                lastName: this.lastName,
                phoneNumber: this.phoneNumber,
                address: this.address
            });

            Frame.topmost().navigate({
                moduleName: 'main-page',
                clearHistory: true
            });
        } catch (error) {
            this.errorMessage = error.message;
        }
    }
}