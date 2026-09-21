import type { Locator, Page } from "@playwright/test";

export class LoginPage {
	readonly page: Page;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly submitButton: Locator;
	readonly loginError: Locator;
	readonly emailError: Locator;
	readonly passwordError: Locator;
	readonly registerLink: Locator;
	readonly forgotPasswordLink: Locator;

	constructor(page: Page) {
		this.page = page;
		this.emailInput = page.locator("#email");
		this.passwordInput = page.locator("#password");
		this.submitButton = page.locator('button[type="submit"]');
		this.loginError = page.locator('[data-test="login-error"]');
		this.emailError = page.locator('[data-test="email-error"]');
		this.passwordError = page.locator('[data-test="password-error"]');
		this.registerLink = page.locator('[data-test="register-link"]');
		this.forgotPasswordLink = page.locator(
			'[data-test="forgot-password-link"]',
		);
	}

	async login(email: string, password: string) {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.submitButton.click();
	}
}
