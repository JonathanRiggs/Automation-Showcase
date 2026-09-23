import { Locator, Page } from '@playwright/test';

/**
 * Shared behaviour for every page object.
 *
 * Rules for subclasses:
 *  - expose Locators and intention-revealing actions, never assertions
 *  - never call expect() in here; tests own the assertions
 *  - one locator definition per element, declared once in the constructor
 */

export abstract class BasePage {
    // Route this page lives on, relative to the base URL
    protected abstract readonly path: string;

    // Element that proves the page finished rendering
    abstract readonly pageLoadedMarker: Locator;

/**
* ngx-toastr renders outside the Angular component tree and carries no
* data-test attribute, so this is one of the few class-based locators
* in the suite. Keep it here so there is exactly one place to fix it.
*/

    readonly toast: Locator;

    protected constructor(protected readonly page: Page) {
        this.toast = page.locator('.toast-message');
    }

    async goto(suffix = ''): Promise<void> {
        await this.page.goto(`${this.path}${suffix}`);
        await this.pageLoadedMarker.waitFor({ state: 'visible' });
    }

    async waitUntilLoaded(): Promise<void> {
        await this.pageLoadedMarker.waitFor({ state: 'visible' });
    }

    async toastText(): Promise<string> {
        return (await this.toast.first().innerText()).trim();
    }
}