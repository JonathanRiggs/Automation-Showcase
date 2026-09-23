import { Locator, Page } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { parsePrice } from '../utils/Price';
import { HeaderComp } from '../components/HeaderComp';

export type SortOption =
  | 'name,asc'
  | 'name,desc'
  | 'price,asc'
  | 'price,desc'
  | 'co2_rating,asc'
  | 'co2_rating,desc';

// Catalog route
export class HomePage extends BasePage {
    protected readonly path = '/';
    readonly header: HeaderComp;

    readonly pageLoadedMarker: Locator;

    readonly searchInput: Locator;
    readonly searchSubmit: Locator;
    readonly searchReset: Locator;
    readonly searchCaption: Locator;
    readonly searchTerm: Locator;
    readonly searchResultCount: Locator;
    readonly noResults: Locator;
 
    readonly filters: Locator;
    readonly ecoFriendlyFilter: Locator;
    readonly sortSelect: Locator;
 
    readonly productCards: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
 
    readonly paginationNext: Locator;
    readonly paginationPrev: Locator;
 
    readonly compareBar: Locator;
    readonly compareLink: Locator;
    readonly clearComparison: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComp(page);
 
    this.searchInput = page.getByTestId('search-query');
    this.searchSubmit = page.getByTestId('search-submit');
    this.searchReset = page.getByTestId('search-reset');
    this.searchCaption = page.getByTestId('search-caption');
    this.searchTerm = page.getByTestId('search-term');
    this.searchResultCount = page.getByTestId('search-result-count');
    this.noResults = page.getByTestId('no-results');
 
    this.filters = page.getByTestId('filters');
    this.ecoFriendlyFilter = page.getByTestId('eco-friendly-filter');
    this.sortSelect = page.getByTestId('sort');
 
    // Cards carry data-test="product-<uuid>", so match on the prefix.
    this.productCards = page.locator('[data-test^="product-"]');
    this.productNames = page.getByTestId('product-name');
    this.productPrices = page.getByTestId('product-price');
 
    this.paginationNext = page.getByTestId('pagination-next');
    this.paginationPrev = page.getByTestId('pagination-prev');
 
    this.compareBar = page.getByTestId('comparison-bar');
    this.compareLink = page.getByTestId('compare-link');
    this.clearComparison = page.getByTestId('clear-comparison');
 
    this.pageLoadedMarker = this.sortSelect;
  }
 
  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);

    // The grid re-renders from an API call; wait for it instead of sleeping.

    await Promise.all([
      this.page.waitForResponse(
        (r) => r.url().includes('/products') && r.request().method() === 'GET',
      ),
      this.searchSubmit.click(),
    ]);
  }
 
  async sortBy(option: SortOption): Promise<void> {
    await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/products')),
      this.sortSelect.selectOption(option),
    ]);
  }
 
  // Filters are checkboxes, so we can use the label to find them.

  filterByLabel(label: string): Locator {
    return this.filters.getByLabel(label, { exact: false });
  }
 
  async toggleFilter(label: string): Promise<void> {
    await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/products')),
      this.filterByLabel(label).check(),
    ]);
  }
 
  productCard(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }
 
  async openProduct(name: string): Promise<void> {
    await this.productCard(name).first().click();
  }
 
  async openFirstProduct(): Promise<string> {
    const first = this.productCards.first();
    const name = (await first.getByTestId('product-name').innerText()).trim();
    await first.click();
    return name;
  }
 
  async visibleProductNames(): Promise<string[]> {
    return (await this.productNames.allInnerTexts()).map((t) => t.trim());
  }
 
  async visibleProductPrices(): Promise<number[]> {
    return (await this.productPrices.allInnerTexts()).map(parsePrice);
  }
}