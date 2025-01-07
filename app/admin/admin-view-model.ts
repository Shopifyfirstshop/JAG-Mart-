import { Observable, Frame, prompt, alert, action, confirm } from '@nativescript/core';
import { productService } from '../services/product-service';
import { authService } from '../services/auth-service';
import { categoryService } from '../services/category-service';
import { PageBaseViewModel } from '../shared/page-base';

export class AdminViewModel extends PageBaseViewModel {
    private _searchQuery: string = '';
    private _userSearchQuery: string = '';
    private allProducts: any[] = [];
    private allUsers: any[] = [];
    private _selectedTabIndex: number = 0;

    constructor() {
        super(true);
        this.loadProducts();
        this.loadUsers();
        this.loadCategories();
        
        productService.on(Observable.propertyChangeEvent, (data: any) => {
            if (data.propertyName === 'productsUpdated') {
                this.loadProducts();
            }
        });

        authService.on(Observable.propertyChangeEvent, (data: any) => {
            if (data.propertyName === 'usersUpdated') {
                this.loadUsers();
            }
        });

        categoryService.on(Observable.propertyChangeEvent, (data: any) => {
            if (data.propertyName === 'categoriesUpdated') {
                this.loadCategories();
            }
        });
    }

    get selectedTabIndex(): number {
        return this._selectedTabIndex;
    }

    set selectedTabIndex(value: number) {
        if (this._selectedTabIndex !== value) {
            this._selectedTabIndex = value;
            this.notifyPropertyChange('selectedTabIndex', value);
        }
    }

    get searchQuery(): string {
        return this._searchQuery;
    }

    set searchQuery(value: string) {
        if (this._searchQuery !== value) {
            this._searchQuery = value;
            this.notifyPropertyChange('searchQuery', value);
            this.filterProducts();
        }
    }

    get userSearchQuery(): string {
        return this._userSearchQuery;
    }

    set userSearchQuery(value: string) {
        if (this._userSearchQuery !== value) {
            this._userSearchQuery = value;
            this.notifyPropertyChange('userSearchQuery', value);
            this.filterUsers();
        }
    }

    clearSearch() {
        this.searchQuery = '';
    }

    clearUserSearch() {
        this.userSearchQuery = '';
    }

    private loadProducts() {
        this.allProducts = productService.getProducts();
        this.filterProducts();
    }

    private loadUsers() {
        this.allUsers = authService.getAllUsers();
        this.filterUsers();
    }

    private loadCategories() {
        this.set('categories', categoryService.getCategories());
    }

    private filterProducts() {
        if (!this._searchQuery) {
            this.set('filteredProducts', this.allProducts);
            return;
        }

        const query = this._searchQuery.toLowerCase();
        const filtered = this.allProducts.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.price.toString().includes(query)
        );
        
        this.set('filteredProducts', filtered);
    }

    private filterUsers() {
        if (!this._userSearchQuery) {
            this.set('filteredUsers', this.allUsers);
            return;
        }

        const query = this._userSearchQuery.toLowerCase();
        const filtered = this.allUsers.filter(user => 
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
        
        this.set('filteredUsers', filtered);
    }

    async onAddCategory() {
        const result = await prompt({
            title: "Add New Category",
            message: "Enter category name",
            okButtonText: "Add",
            cancelButtonText: "Cancel",
            inputType: "text"
        });

        if (result.result) {
            const success = categoryService.addCategory(result.text);
            if (!success) {
                alert({
                    title: "Error",
                    message: "Category already exists or invalid name",
                    okButtonText: "OK"
                });
            }
        }
    }

    async onRemoveCategory(args) {
        const category = args.object.bindingContext;
        
        const result = await confirm({
            title: "Remove Category",
            message: `Are you sure you want to remove "${category}"?`,
            okButtonText: "Yes",
            cancelButtonText: "No"
        });

        if (result) {
            const success = categoryService.removeCategory(category);
            if (success) {
                alert({
                    title: "Success",
                    message: "Category removed successfully",
                    okButtonText: "OK"
                });
            }
        }
    }

    onUserTap(args) {
        const user = args.object.bindingContext;
        Frame.topmost().navigate({
            moduleName: 'admin/user-profile-page',
            context: { user }
        });
    }
}