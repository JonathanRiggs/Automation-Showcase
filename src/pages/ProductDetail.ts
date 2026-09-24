import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { HeaderComp } from '../components/HeaderComp'
import { parsePrice } from '../utils/Price'

// Product Detail page object model.

export class ProductDetailPage extends BasePage {
    protected readonly path = '/product'
    readonly header: HeaderComp

    readonly pageLoadedMarker: Locator;

    readonly name: Locator;
    readonly description: Locator;
    readonly unitPrice: Locator;
    readonly offerPrice: Locator;
    readonly outOfStock: Locator;

    readonly quantityInput: Locator;
    readonly increaseQuantity: Locator;
    readonly decreaseQuantity: Locator

    readonly addToCart: Locator;
    readonly addToFavorites: Locator;
    readonly addToCompare: Locator;

    readonly specs: Locator;
    readonly specRows: Locator;
    readonly ecoBadge: Locator;
    readonly co2RatingBadge: Locator;

    constructor(page: Page) {
        super(page)
        this.header = new HeaderComp(page)

        this.name = page.getByTestId('product-name')
        this.description = page.getByTestId('product-description')
        this.unitPrice = page.getByTestId('unit-price')
        this.offerPrice = page.getByTestId('offer-price')
        this.outOfStock = page.getByTestId('out-of-stock')

        this.quantityInput = page.getByTestId('quantity')
        this.increaseQuantity = page.getByTestId('increase-quantity')
        this.decreaseQuantity = page.getByTestId('decrease-quantity')

        this.addToCart = page.getByTestId('add-to-cart')
        this.addToFavorites = page.getByTestId('add-to-favorites')
        this.addToCompare = page.getByTestId('add-to-compare')

        this.specs = page.getByTestId('product-specs')
        this.specRows = page.locator('spec-row')
        this.ecoBadge = page.getByTestId('eco-badge')
        this.co2RatingBadge = page.getByTestId('co2-rating-badge')

        this.pageLoadedMarker = this.addToCart;
    }

    // Navigate straight to product by id

    async gotoById(productId: string): Promise<void> {
        await this.goto(productId)
    }

    async setQuantity(quantity: number): Promise<void> {
        await this.quantityInput.fill(String(quantity))
        await this.quantityInput.blur() // trigger any onChange events
    }


    async addProductToCart(quantity: 1): Promise<void> {
        if (quantity !== 1) await this.setQuantity(quantity);
        await Promise.all([
            this.page.waitForResponse(
                (r) => r.url().includes('/carts') && r.request().method() === 'POST'),
                this.addToCart.click(),
        ]);
    }

    async price(): Promise<number> {
        return parsePrice(await this.unitPrice.innerText());
    }

    async productName(): Promise<string> {
        return (await this.name.innerText()).trim();
    }
}