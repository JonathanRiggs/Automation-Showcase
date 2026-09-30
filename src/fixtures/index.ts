import { test as base, expect, Page } from '@playwright/test';
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
import { Api, NewUser, Product } from '../api'
import { buildUser } from '../data/user.factory';

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

export interface CreateUser extends NewUser {
    id: string;
    token: string;
}

export interface SeededCart {
    cartId: string;
    products: Product[];
}

interface ApiFixtures {
    api: Api;

    // Fresh authenticated user so tests that write data get their own and no test depends on shared accounts

    newUser: CreateUser;
    // Browser page already signed in
    authedPage: Page;
    // Cart with in stock product
    seededCart: SeededCart;
}



// Tests only pay for the ones it names in it's signature

export const test = base.extend<Pages & ApiFixtures>({
    homePage: async ({ page }, use) => use(new HomePage(page)),
    productPage: async ({ page }, use) => use(new ProductDetailPage(page)),
    cartPage: async ({ page }, use) => use(new CartPage(page)),
    checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
    loginPage: async ({ page }, use) => (new LoginPage(page)),
    registerPage: async ({ page }, use) => (new RegisterPage(page)),
    accountPage: async ({ page }, use) => (new AccountPage(page)),
    profilePage: async ({ page }, use) => (new ProfilePage(page)),
    favoritesPage: async ({ page }, use) => (new FavoritesPage(page)),
    invoicesPage: async ({ page }, use) => (new InvoicesPage(page)),
    contactPage: async ({ page }, use) => (new ContactPage(page)),

    api: async ({ }, use) => {
        const api = await Api.create();
        await use(api)
        await api.dispose();
    },

    newUser: async ({ api }, use) => {
        const user = buildUser();
        const { id, token } = await api.auth.registerAndLogin(user);
        await use({ ...user, id, token });
    },

    authedPage: async ({ page, newUser }, use) => {
        await page.addInitScript(
            (token) => window.localStorage.setItem('auth-token', token),
            newUser.token
        )
        await use(page)
    },

    seededCart: async ({ api, page }, use) => {
        const product = await api.products.anyInStock();
        const cartId = await api.carts.createWith([{ product_id: product.id, quantity: 1 }]);

        await page.addInitScript((id) => window.sessionStorage.setItem('cart_id', id), cartId);
        await use({ cartId, products: [product] });
    }
})

export { expect };
