import { Observable, ApplicationSettings } from '@nativescript/core';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    isAdmin?: boolean;
}

class AuthService extends Observable {
    private static instance: AuthService;
    private currentUser: User | null = null;

    private constructor() {
        super();
        this.loadUser();
        this.createAdminIfNotExists();
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private createAdminIfNotExists() {
        const users = JSON.parse(ApplicationSettings.getString('users', '[]'));
        const adminExists = users.some(u => u.isAdmin);
        
        if (!adminExists) {
            const adminUser = {
                id: 'admin-' + Date.now().toString(),
                email: 'admin@jagmart.com',
                firstName: 'Admin',
                lastName: 'User',
                phoneNumber: '0000000000',
                address: 'Admin Address',
                password: this.hashPassword('admin123'),
                isAdmin: true
            };
            users.push(adminUser);
            ApplicationSettings.setString('users', JSON.stringify(users));
        }
    }

    async register(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        address: string;
    }): Promise<boolean> {
        try {
            const { email, password, firstName, lastName, phoneNumber, address } = userData;
            
            if (!email || !password || !firstName || !lastName || !phoneNumber || !address) {
                throw new Error('All fields are required');
            }
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            const existingUsers = JSON.parse(ApplicationSettings.getString('users', '[]'));
            if (existingUsers.find(u => u.email === email)) {
                throw new Error('Email already registered');
            }

            const user = {
                id: Date.now().toString(),
                email,
                firstName,
                lastName,
                phoneNumber,
                address,
                password: this.hashPassword(password),
                isAdmin: false
            };

            existingUsers.push(user);
            ApplicationSettings.setString('users', JSON.stringify(existingUsers));
            this.notifyPropertyChange('usersUpdated', null);
            
            return this.login(email, password);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async login(email: string, password: string): Promise<boolean> {
        try {
            const users = JSON.parse(ApplicationSettings.getString('users', '[]'));
            const user = users.find(u => 
                u.email === email && 
                u.password === this.hashPassword(password)
            );

            if (!user) {
                throw new Error('Invalid credentials');
            }

            const { password: _, ...userWithoutPassword } = user;
            this.currentUser = userWithoutPassword;
            ApplicationSettings.setString('currentUser', JSON.stringify(this.currentUser));
            
            this.notifyPropertyChange('isLoggedIn', true);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    logout(): void {
        this.currentUser = null;
        ApplicationSettings.remove('currentUser');
        this.notifyPropertyChange('isLoggedIn', false);
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }

    getAllUsers(): User[] {
        const users = JSON.parse(ApplicationSettings.getString('users', '[]'));
        return users.map(({ password: _, ...user }) => user);
    }

    updateUser(id: string, updates: Partial<User>): boolean {
        const users = JSON.parse(ApplicationSettings.getString('users', '[]'));
        const index = users.findIndex(u => u.id === id);
        
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            ApplicationSettings.setString('users', JSON.stringify(users));
            this.notifyPropertyChange('usersUpdated', null);
            return true;
        }
        return false;
    }

    removeUser(id: string): boolean {
        const users = JSON.parse(ApplicationSettings.getString('users', '[]'));
        const filteredUsers = users.filter(u => u.id !== id);
        
        if (users.length !== filteredUsers.length) {
            ApplicationSettings.setString('users', JSON.stringify(filteredUsers));
            this.notifyPropertyChange('usersUpdated', null);
            return true;
        }
        return false;
    }

    get isLoggedIn(): boolean {
        return this.currentUser !== null;
    }

    isAdmin(): boolean {
        return this.currentUser?.isAdmin || false;
    }

    private loadUser(): void {
        const savedUser = ApplicationSettings.getString('currentUser', '');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
            } catch (error) {
                console.error('Error loading user:', error);
                this.currentUser = null;
            }
        }
    }

    private hashPassword(password: string): string {
        return password.split('').reduce((hash, char) => 
            (((hash << 5) - hash) + char.charCodeAt(0))|0
        , 0).toString();
    }
}

export const authService = AuthService.getInstance();