import { Locator, Page } from '@playwright/test';

export type Language = 'en' | 'de' | 'fr' | 'es' | 'it' | 'nl' | 'pl' | 'pt' | 'ru';

/**
 * The header is present on every page, so it is a component object rather
 * than a page object. Page objects compose it instead of inheriting it.
 */

export class HeaderComp {
    readonly home: Locator;
    readonly categories: Locator;
    readonly contact: Locator;
    readonly signIn: Locator;
    readonly signOut: Locator;
    readonly cart: Locator;
    readonly cartQuantity: Locator;

    // Account dropdown trigger
    readonly userMenu: Locator;
    readonly myAccount: Locator;
    readonly myFavorites: Locator;
    readonly myProfile: Locator;
    readonly myInvoices: Locator;
    readonly myMessages: Locator;

    readonly LanguageSelect: Locator;

    // Category shortcuts inside the Categories dropdown
    readonly navHandTools: Locator;
    readonly navPowerTools: Locator;
    readonly navOther: Locator;
    readonly navRentals: Locator;

    //Admin-only
    readonly adminDashboard: Locator;
    readonly adminProducts: Locator;
    readonly adminOrders: Locator;
    readonly adminUsers: Locator;

    constructor(private readonly page: Page) {
        this.home = page.getByTestId('nav-home');
        this.categories = page.getByTestId('nav-categories');
        this.contact = page.getByTestId('nav-contact');
        this.signIn = page.getByTestId('nav-sign-in');
        this.signOut = page.getByTestId('nav-sign-out');
        this.cart = page.getByTestId('nav-cart');
        this.cartQuantity = page.getByTestId('cart-quantity');

        this.userMenu = page.getByTestId('nav-menu');
        this.myAccount = page.getByTestId('nav-my-account');
        this.myFavorites = page.getByTestId('nav-my-favorites');
        this.myProfile = page.getByTestId('nav-my-profile');
        this.myInvoices = page.getByTestId('nav-my-invoices');
        this.myMessages = page.getByTestId('nav-my-messages');

        this.LanguageSelect = page.getByTestId('language-select');

        this.navHandTools = page.getByTestId('nav-hand-tools');
        this.navPowerTools = page.getByTestId('nav-power-tools');
        this.navOther = page.getByTestId('nav-other');
        this.navRentals = page.getByTestId('nav-rentals');

        this.adminDashboard = page.getByTestId('nav-admin-dashboard');
        this.adminProducts = page.getByTestId('nav-admin-products');
        this.adminOrders = page.getByTestId('nav-admin-orders');
        this.adminUsers = page.getByTestId('nav-admin-users');
    }

    async openCart(): Promise<void> {
        await this.cart.click();
    }

    // Cart badge is not there when the cart is empty
    async cartCount(): Promise<number> {
        if ((await this.cartQuantity.count()) === 0) return 0;
        const text = (await this.cartQuantity.innerText()).trim();
        return text === '' ? 0 : Number(text);
    }

    async openCategory(category: 'hand-tools' | 'power-tools' | 'other' | 'rentals'): Promise<void> {
        await this.categories.click();
        const map = {
            'hand-tools': this.navHandTools,
            'power-tools': this.navPowerTools,
            'other': this.navOther,
            'rentals': this.navRentals,
        } as const;
        await map[category].click();
    }

    async signOutUser(): Promise<void> {
        await this.userMenu.click();
        await this.signOut.click();
    }

    async switchLanguage(lang: Language): Promise<void> {
        await this.LanguageSelect.click();
        await this.page.getByTestId(`lang-${lang}`).click();
    }

    async isSignedIn(): Promise<boolean> {
        return (await this.userMenu.count()) > 0;
    }
    
}
    