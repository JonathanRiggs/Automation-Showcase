import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export type PaymentMethod =
  | 'bank-transfer'
  | 'cash-on-delivery'
  | 'credit-card'
  | 'buy-now-pay-later'
  | 'gift-card';


export interface Address {
    street: string;
    houseNumber: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface GuestDetails {
    firstName: string;
    lastName: string;
    email: string;
}

export type PaymentDetails =
  | { method: 'bank-transfer'; bankName: string; accountName: string; accountNumber: string }
  | { method: 'cash-on-delivery' }
  | {
      method: 'credit-card';
      cardNumber: string;
      expirationDate: string;
      cvv: string;
      cardHolderName: string;
    }
  | { method: 'buy-now-pay-later'; installments: '3' | '6' | '9' | '12' }
  | { method: 'gift-card'; giftCardNumber: string; validationCode: string };

  /**
 * Checkout steps 2-4. Step 1 (cart) lives in CartPage because it is reachable
 * on its own; steps 2-4 are only ever traversed in order.
 */

export class CheckoutPage extends BasePage {
    protected readonly path = '/checkout';

    readonly pageLoadedMarker: Locator;

    // Step 2
    readonly email: Locator;
    readonly password: Locator;
    readonly loginSubmit: Locator;
    readonly loginError: Locator;
    readonly proceedToAddress: Locator;
    readonly guestFirstName: Locator;
    readonly guestLastName: Locator;
    readonly guestEmail: Locator;
    readonly guestSubmit: Locator;
    readonly proceedToAddressAsGuest: Locator;

    // Step 3
    readonly street: Locator;
    readonly houseNumber: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly country: Locator;
    readonly postalCode: Locator;
    readonly proceedToPayment: Locator;

    // Step 4
    readonly paymentMethod: Locator;
    readonly bankName: Locator;
    readonly accountNmae: Locator;
    readonly accountNumber: Locator;
    readonly creditCardNumber: Locator;
    readonly expirationDate: Locator;
    readonly cvv: Locator;
    readonly cardHolderName: Locator;
    readonly monthlyInstallments: Locator;
    readonly giftCardNumber: Locator;
    readonly validationCode: Locator;
    readonly finish: Locator;
    readonly successMessage: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.email = page.getByTestId('email');
        this.password = page.getByTestId('password');
        this.loginSubmit = page.getByTestId('login-submit');
        this.loginError = page.getByTestId('login-error');
        this.proceedToAddress = page.getByTestId('proceed-2')
        this.guestFirstName = page.getByTestId('guest-first-name')
        this.guestLastName = page.getByTestId('guest-last-name')
        this.guestEmail = page.getByTestId('guest-email')
        this.guestSubmit = page.getByTestId('guest-submit')
        this.proceedToAddressAsGuest = page.getByTestId('proceed-2-guest')

        this.street = page.getByTestId('street')
        this.houseNumber = page.getByTestId('house_number')
        this.city = page.getByTestId('city')
        this.state = page.getByTestId('state')
        this.country = page.getByTestId('country')
        this.postalCode = page.getByTestId('postal_code')
        this.proceedToPayment = page.getByTestId('proceed-3')

        this.paymentMethod = page.getByTestId('payment-method')
        this.bankName = page.getByTestId('bank_name')
        this.accountNmae = page.getByTestId('account_name')
        this.accountNumber = page.getByTestId('account_number')
        this.creditCardNumber = page.getByTestId('credit_card_number')
        this.expirationDate = page.getByTestId('expiration_date')
        this.cvv = page.getByTestId('cvv')
        this.cardHolderName = page.getByTestId('card_holder_name')
        this.monthlyInstallments = page.getByTestId('monthly_installments')
        this.giftCardNumber = page.getByTestId('gift_card_number ')
        this.validationCode = page.getByTestId('validation_code')
        this.finish = page.getByTestId('finish')
        this.successMessage = page.getByTestId('payment-success-message')
        this.errorMessage = page.getByTestId('payment-error-message')

        this.pageLoadedMarker = page.getByTestId('proceed-1')
    }

    // Step 2 for existing account
    async singIn(user: { email:string; password:string }): Promise<void>
    {
        await this.email.fill(user.email)
        await this.password.fill(user.password)
        await this.loginSubmit.click()
        await this.proceedToAddress.click()
    }

    // Step 2 for guest
    async continueAsGuest(guest: GuestDetails): Promise<void> {
        await this.guestFirstName.fill(guest.firstName)
        await this.guestLastName.fill(guest.lastName)
        await this.guestEmail.fill(guest.email)
        await this.guestSubmit.click()
        await this.proceedToAddressAsGuest.click()
    }

    // Step for customer saved in browser storage
    async skipSignIn(): Promise<void> {
        await this.proceedToAddress.click()
    }

    // Step 3 for prefilled fields
    async fillAddress(address: Address): Promise<void> {
        await this.street.fill(address.street)
        await this.houseNumber.fill(address.houseNumber)
        await this.city.fill(address.city)
        await this.state.fill(address.state)
        await this.country.fill(address.country)
        await this.postalCode.fill(address.postalCode)
        await this.proceedToPayment.click()
    }

    async pay(details: PaymentDetails): Promise<void> {
        await this.paymentMethod.selectOption(details.method)

        switch (details.method) {
            case 'bank-transfer':
                await this.bankName.fill(details.bankName)
                await this.accountNmae.fill(details.accountName)
                await this.accountNumber.fill(details.accountNumber)
                break
            case 'credit-card':
                await this.creditCardNumber.fill(details.cardNumber)
                await this.expirationDate.fill(details.expirationDate)
                await this.cvv.fill(details.cvv)
                await this.cardHolderName.fill(details.cardHolderName)
                break
            case 'buy-now-pay-later':
                await this.monthlyInstallments.selectOption(details.installments)
                break
            case 'gift-card':
                await this.giftCardNumber.fill(details.giftCardNumber)
                await this.validationCode.fill(details.validationCode)
                break
            case 'cash-on-delivery':
                break
        }

        await this.finish.click()
    }
}