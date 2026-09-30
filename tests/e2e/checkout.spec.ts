import { test, expect } from '../../src/fixtures'
import { ALL_PAYMENT_METHODS, buildPayment, defaultAddress, toBillingFields } from '../../src/data'

// Cross Layer Coverage

test.describe('Checkout', () => {
    test('a signed-in user completes checkout and gets an invoice @smoke @critical', async ({
        authedPage,
        seededCart,
        cartPage,
        checkoutPage,
        api,
    }) => {
        const address = defaultAddress();

        await authedPage.goto('/checkout');
        await cartPage.waitUntilLoaded();
        await cartPage.proceed();

        await checkoutPage.skipSignIn();
        await checkoutPage.fillAddress({
            street: address.street,
            houseNumber: address.house_number ?? '1',
            city: address.city,
            state: address.state,
            country: address.country,
            postalCode: address.postal_code,
        });

        await checkoutPage.pay({
            method: 'bank-transfer',
            bankName: 'Test Bank',
            accountName: 'Jane Doe',
            accountNumber: '1234567890',
        });

        await expect(checkoutPage.successMessage).toBeVisible();

        const invoice = await api.invoices.latest();
        expect(invoice.billing_city).toBe(address.city);
        expect(invoice.payment_method).toBe('bank-transfer');
        expect(invoice.total).toBeGreaterThan(0);
    });

    for (const method of ALL_PAYMENT_METHODS) {
        test(`checkout succeeds paying by ${method} @regression`, async ({
            newUser,
            api,
            seededCart,
        }) => {
            const address = defaultAddress();

            const invoice = await api.invoices.create({
                ...buildPayment(method),
                ...toBillingFields(address),
                cart_id: seededCart.cartId,
            });

            expect(invoice.invoice_number).toBeTruthy();
            expect(invoice.payment_method).toBe(method)
        })
    }
})