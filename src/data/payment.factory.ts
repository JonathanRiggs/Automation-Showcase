import { faker } from '@faker-js/faker';
import { PaymentDetails, PaymentMethod } from '../api';

/** 
   bank_name            letters and spaces only
   account_name         letters, digits, spaces, dot, apostrophe, hyphen
   account_number       digits only
 
   credit_card_number   dddd-dddd-dddd-dddd
   expiration_date      mm/YYYY, strictly after today
   cvv                  3 or 4 digits
   card_holder_name     letters and spaces only
   gift_card_number     exactly 16 alphanumerics
   validation_code      exactly 4 alphanumerics
   */

function lettersOnly(words: number): string {
    return faker.helpers.multiple(() => faker.string.alpha({ length: { min: 4, max: 9 }, casing: 'mixed' }), {
        count: words,
    })
        .join(' ')
}

function futureExpiry(yearsAhead = 2): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() + yearsAhead);
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

export const paymentDetails = {
    'bank-transfer': (): PaymentDetails => ({
        bank_name: lettersOnly(2),
        account_name: lettersOnly(2),
        account_number: faker.string.numeric({ length: 10 }),
    }),
    'cash-on-delivery': (): PaymentDetails => ({}),
    'credit-card': (): PaymentDetails => ({
        credit_card_number: faker.helpers
            .multiple(() => faker.string.numeric(4), { count: 4 })
            .join('-'),
        expiration_date: futureExpiry(),
        cvv: faker.string.numeric(3),
        card_holder_name: lettersOnly(2),
    }),
    'buy-now-pay-later': (): PaymentDetails => ({
        monthly_installments: faker.helpers.arrayElement([3, 6, 9, 12]),
    }),
    'gift-card': (): PaymentDetails => ({
        gift_card_number: faker.string.alphanumeric(16),
        validation_code: faker.string.alphanumeric(4),
    }),
} satisfies Record<PaymentMethod, () => PaymentDetails>;

export function buildPayment(method: PaymentMethod) {
    return { payment_method: method, payment_details: paymentDetails[method]() };
}

/** All five methods, for data-driven checkout coverage. */
export const ALL_PAYMENT_METHODS: PaymentMethod[] = [
    'bank-transfer',
    'cash-on-delivery',
    'credit-card',
    'buy-now-pay-later',
    'gift-card',
];

/** Malformed variants that must be rejected. */
export const invalidPaymentDetails = {
    giftCardTooShort: () => ({ gift_card_number: faker.string.alphanumeric(8), validation_code: 'AB12' }),
    expiredCard: () => ({
        credit_card_number: '1234-5678-9012-3456',
        expiration_date: '01/2020',
        cvv: '123',
        card_holder_name: 'Jane Doe',
    }),
    accountNumberWithLetters: () => ({
        bank_name: 'Test Bank',
        account_name: 'Jane Doe',
        account_number: 'NOT-DIGITS',
    }),
};