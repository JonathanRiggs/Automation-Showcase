import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'
import { join } from 'node:path';

export interface RegistrationData {
    firstName: string;
    lastName: string;
    dob: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
    password: string;
}

export class RegisterPage extends BasePage {
    protected readonly path = '/auth/register'

    readonly pageLoadedMarker: Locator;

    readonly form: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly dob: Locator;
    readonly street: Locator;
    readonly houseNumber: Locator;
    readonly postalCode: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly country: Locator;
    readonly phone: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly submit: Locator;
    readonly registerError: Locator;

    constructor(page: Page) {
        super(page);

        this.form = page.getByTestId('register-form')
        this.firstName = page.getByTestId('first-name')
        this.lastName = page.getByTestId('last-name')
        this.dob = page.getByTestId('dob')
        this.street = page.getByTestId('street')
        this.houseNumber = page.getByTestId('house_number')
        this.postalCode = page.getByTestId('postal_code')
        this.city = page.getByTestId('city')
        this.state = page.getByTestId('state')
        this.country = page.getByTestId('country')
        this.phone = page.getByTestId('phone')
        this.email = page.getByTestId('email')
        this.password = page.getByTestId('password')
        this.submit = page.getByTestId('register-submit')
        this.registerError = page.getByTestId('register-error')

        this.pageLoadedMarker = this.submit;
    }

    // Field level validation message
    fieldError(field: string): Locator {
        return this.page.getByTestId(`${field}-error`)
    }

    async fillForm(data: RegistrationData): Promise<void> {
        await this.firstName.fill(data.firstName)
        await this.lastName.fill(data.lastName)
        await this.dob.fill(data.dob)
        await this.street.fill(data.street)
        await this.houseNumber.fill(data.houseNumber)
        await this.postalCode.fill(data.postalCode)
        await this.city.fill(data.city)
        await this.state.fill(data.state)
        await this.country.selectOption({ label: data.country }).catch(async () => {
            await this.country.fill(data.country)
        })
        await this.phone.fill(data.phone)
        await this.email.fill(data.email)
        await this.password.fill(data.password)
    }

    async register(data: RegistrationData): Promise<void> {
        await this.fillForm(data)
        await this.submit.click()
    }
}