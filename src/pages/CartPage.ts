import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { HeaderComp } from '../components/HeaderComp'
import { parsePrice } from '../utils/Price'

// Cart page object model.

export interface CartLine {
    title: string;
    quantity: number;
    unitPrice: number;
    linePrice: number;
}

export class CartPage extends BasePage {
    protected readonly path = '/checkout';
    readonly header: HeaderComp;

    readonly pageLoadedMarker: Locator;

    readonly rows: Locator;
    readonly titles: Locator;
    readonly quantities: Locator;
    readonly unitPrices: Locator;
    readonly linePrices: Locator;

    readonly subtotal: Locator;
    readonly total: Locator;
    readonly discount: Locator;
    readonly ecoDiscount: Locator;

    readonly continueShopping: Locator;
    readonly proceedToSignIn: Locator;

    constructor(page: Page) {
        super(page);
        this.header = new HeaderComp(page)

        this.rows = page.locator('tbody tr');
        this.titles = page.getByTestId('product-title');
        this.quantities = page.getByTestId('product-quantity');
        this.unitPrices = page.getByTestId('product-price');
        this.linePrices = page.getByTestId('line-price');

        this.subtotal = page.getByTestId('cart-subtotal');
        this.total = page.getByTestId('cart-total');
        this.discount = page.getByTestId('cart-discount');
        this.ecoDiscount = page.getByTestId('cart-eco-discount');

        this.continueShopping = page.getByTestId('continue-shopping');
        this.proceedToSignIn = page.getByTestId('proceed-1');

        this.pageLoadedMarker = this.proceedToSignIn;
    }

    rowFor(productTitle: string): Locator {
        return this.rows.filter({ hasText: productTitle });
    }

    async setQuantity(productTitle: string, quantity: number): Promise<void> {
    const input = this.rowFor(productTitle).getByTestId('product-quantity');
    await input.fill(String(quantity));
    await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/carts') && ['PUT', 'PATCH', 'POST'].includes(r.request().method()),
      ),
      input.blur(),
    ]);
  }
 
  removeButton(productTitle: string): Locator {
    return this.rowFor(productTitle).locator('a.btn-danger');
  }
 
  async removeItem(productTitle: string): Promise<void> {
    await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/carts')),
      this.removeButton(productTitle).click(),
    ]);
  }
 
  async lines(): Promise<CartLine[]> {
    const count = await this.rows.count();
    const lines: CartLine[] = [];
    for (let i = 0; i < count; i++) {
      const row = this.rows.nth(i);
      lines.push({
        title: (await row.getByTestId('product-title').innerText()).trim(),
        quantity: Number(await row.getByTestId('product-quantity').inputValue()),
        unitPrice: parsePrice(await row.getByTestId('product-price').innerText()),
        linePrice: parsePrice(await row.getByTestId('line-price').innerText()),
      });
    }
    return lines;
  }
 
  async totalValue(): Promise<number> {
    return parsePrice(await this.total.innerText());
  }
 
  async proceed(): Promise<void> {
    await this.proceedToSignIn.click();
  }
}