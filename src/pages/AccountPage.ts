import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComp } from '../components/HeaderComp';

/** Account landing page (route "/account"). */
export class AccountPage extends BasePage {
  protected readonly path = '/account';
  readonly header: HeaderComp;

  readonly pageLoadedMarker: Locator;
  readonly title: Locator;
  readonly favoritesLink: Locator;
  readonly invoicesLink: Locator;
  readonly messagesLink: Locator;
  readonly profileLink: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComp(page);

    this.title = page.getByTestId('page-title');
    this.favoritesLink = page.getByTestId('nav-favorites');
    this.invoicesLink = page.getByTestId('nav-invoices');
    this.messagesLink = page.getByTestId('nav-messages');
    this.profileLink = page.getByTestId('nav-profile');

    this.pageLoadedMarker = this.title;
  }
}

/** Profile (route "/account/profile"). */
export class ProfilePage extends BasePage {
  protected readonly path = '/account/profile';

  readonly pageLoadedMarker: Locator;
  readonly title: Locator;

  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly phone: Locator;
  readonly street: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly country: Locator;
  readonly postalCode: Locator;
  readonly email: Locator;
  readonly updateSubmit: Locator;

  readonly currentPassword: Locator;
  readonly changePasswordSubmit: Locator;

  constructor(page: Page) {
    super(page);

    this.title = page.getByTestId('page-title');
    this.firstName = page.getByTestId('first-name');
    this.lastName = page.getByTestId('last-name');
    this.phone = page.getByTestId('phone');
    this.street = page.getByTestId('street');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
    this.country = page.getByTestId('country');
    this.postalCode = page.getByTestId('postal_code');
    this.email = page.getByTestId('email');
    this.updateSubmit = page.getByTestId('update-profile-submit');

    this.currentPassword = page.getByTestId('current-password');
    this.changePasswordSubmit = page.getByTestId('change-password-submit');

    this.pageLoadedMarker = this.updateSubmit;
  }

  async updatePhone(phone: string): Promise<void> {
    await this.phone.fill(phone);
    await this.updateSubmit.click();
  }
}

/** Favorites (route "/account/favorites"). */
export class FavoritesPage extends BasePage {
  protected readonly path = '/account/favorites';

  readonly pageLoadedMarker: Locator;
  readonly title: Locator;
  readonly items: Locator;
  readonly names: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('page-title');
    this.items = page.locator('[data-test^="favorite-"]');
    this.names = page.getByTestId('product-name');
    this.pageLoadedMarker = this.title;
  }

  itemFor(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  async remove(productName: string): Promise<void> {
    await this.itemFor(productName).getByTestId('delete').click();
  }
}

/** Invoices (route "/account/invoices"). */
export class InvoicesPage extends BasePage {
  protected readonly path = '/account/invoices';

  readonly pageLoadedMarker: Locator;
  readonly title: Locator;
  readonly rows: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('page-title');
    // The invoice table has no per-row data-test yet; scope by table instead.
    this.rows = page.locator('table tbody tr');
    this.pageLoadedMarker = this.title;
  }

  rowFor(invoiceNumber: string): Locator {
    return this.rows.filter({ hasText: invoiceNumber });
  }

  async open(invoiceNumber: string): Promise<void> {
    await this.rowFor(invoiceNumber).getByRole('link').first().click();
  }
}