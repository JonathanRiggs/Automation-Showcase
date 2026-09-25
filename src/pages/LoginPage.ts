import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { HeaderComp } from "../components/HeaderComp";

export class LoginPage extends BasePage {
	protected readonly path = '/auth/login'
	readonly header: HeaderComp

	readonly pageLoadedMarker: Locator;

	readonly form: Locator;
	readonly email: Locator;
	readonly password: Locator;
	readonly submit: Locator;

	readonly emailError: Locator;
	readonly passwordError: Locator;
	readonly loginError: Locator;

	readonly registerLink: Locator;
	readonly forgotPasswordLink: Locator;

	readonly totpCode: Locator;
	readonly verifyTotp: Locator;

	constructor(page: Page) {
		super(page);
		this.header = new HeaderComp(page)

		this.form = page.getByTestId('login-form')
		this.email = page.getByTestId('email')
		this.password = page.getByTestId('password')
		this.submit = page.getByTestId('login-submit')
		this.emailError = page.getByTestId('email-error')
		this.passwordError = page.getByTestId('password-error')
		this.loginError = page.getByTestId('login-error')
		this.registerLink = page.getByTestId('register-link')
		this.forgotPasswordLink = page.getByTestId('forgot-password-link')
		this.totpCode = page.getByTestId('totp-code')
		this.verifyTotp = page.getByTestId('verify-totp')

		this.pageLoadedMarker = this.submit;
	}

	async fillCredentials(email: string, password: string): Promise<void> {
		await this.email.fill(email)
		await this.password.fill(password)
	}

	async submitCredentials(email: string, password: string): Promise<void>
	{
		await this.fillCredentials(email, password)
		await this.submit.click()
	}

	async login(email: string, password: string): Promise<void> {
		await this.submitCredentials(email, password)
		await this.page.waitForURL('**/account', { timeout: 15_000 })
	}
}
