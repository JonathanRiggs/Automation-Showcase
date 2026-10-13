import { faker } from '@faker-js/faker'
import { NewAddress } from '../api'

const KNOWN_GOOD: readonly NewAddress[] = [
    {
        street: 'Broadway 111',
        city: 'Nashville',
        state: 'Tennessee',
        country: 'US',
        postal_code: '37216'
    },
    {
        street: 'Market 222',
        city: 'Brentwood',
        state: 'California',
        country: 'US',
        postal_code: '94105'
    },
    {
        street: 'Church 333',
        city: 'Nashville',
        state: 'Tennessee',
        country: 'US',
        postal_code: '37206'
    },
] as const;

export function pickAddress(): NewAddress {
    return faker.helpers.arrayElement(KNOWN_GOOD)
}

// Stable entry for tests needing same address twice
export function defaultAddress(): NewAddress {
    return KNOWN_GOOD[0]!;
}

// Valid address with the country swapped
export function mismatchedCountryAddress(): NewAddress {
    return { ...defaultAddress(), country: 'Austria' };
}

export function toBillingFields(address: NewAddress) {
    return {
        billing_street: address.street,
        billing_city: address.city,
        billing_state: address.state,
        billing_country: address.country,
        billing_postal_code: address.postal_code
    }
}