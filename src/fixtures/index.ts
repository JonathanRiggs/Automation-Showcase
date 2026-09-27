import { test as base, expect } from '@playwright/test';
import {
    BasePage,
    AccountPage,
    CartPage,
    CheckoutPage,
    ContactPage,
    HomePage,
    LoginPage,
    ProductDetailPage,
    RegisterPage,
    ProfilePage,
    FavoritesPage,
    InvoicesPage
} from '../pages'

interface Pages {
    homePage: HomePage;
    productPage: ProductDetailPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    loginPage: LoginPage;
    registerPage: RegisterPage;
    accountPage: AccountPage;
    profilePage: ProfilePage;
    favoritesPage: FavoritesPage;
    invoicesPage: InvoicesPage;
    contactPage: ContactPage
}

// Tests only pay for the ones it names in it's signature

export const test = base.extend<Pages>({
    homePage: async ({ page  }, use) => use(new HomePage(page)),
    productPage: async ({ page }, use) => use(new ProductDetailPage(page)),
    cartPage: async ({ page }, use) => use(new CartPage(page)),
    checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
    loginPage: async ({ page }, use) => (new LoginPage(page)),
    registerPage: async ({ page }, use) => (new RegisterPage(page)),
    accountPage: async ({ page }, use) => (new AccountPage(page)),
    profilePage: async ({ page }, use) => (new ProfilePage(page)),
    favoritesPage: async ({ page }, use) => (new FavoritesPage(page)),
    invoicesPage: async ({ page }, use) => (new InvoicesPage(page)),
    contactPage: async ({ page }, use) => (new ContactPage(page))
})

export { expect };
