import { Faker, faker } from '@faker-js/faker'
import { NewUser } from '../api'
import { pickAddress } from './address.factory'
import { pick } from 'zod/v4/core/util.cjs'


export function strongPassword(): string {
    return [
        faker.string.alpha({ length: 5, casing: 'lower' }),
        faker.string.alpha({ length: 3, casing: 'upper' }),
        faker.string.numeric(3),
        faker.helpers.arrayElement(['!', '#', '$', '%', '&', '?']),
        faker.string.alphanumeric(4),
    ].join('')
}

export function testEmail(): string {
    return `pw-${Date.now()}-${faker.string.alphanumeric(6).toLowerCase()}@example.test`
}

// DOB is Y-M-D
export function validDob(): string {
    return faker.date.birthdate({ min: 20, max: 70, mode: 'age' })
        .toISOString()
        .slice(0, 10)
}

export function buildUser(overrides: Partial<NewUser> = {}): NewUser {
    return {
        first_name: faker.person.firstName().slice(0, 40),
        last_name: faker.person.lastName().slice(0, 20),
        dob: validDob(),
        phone: faker.string.numeric({ length: 10 }),
        email: testEmail(),
        password: strongPassword(),
        address: pickAddress(),
        ...overrides,
    }
}

export const invalidUsers = {
    underage: () => buildUser({ dob: validDobOffsetByAge(10) }),
    weakPassword: () => buildUser({ password: 'password' }),
    shortPassword: () => buildUser({ password: 'Aa1!' }),
    malformedEmail: () => buildUser({ email: 'not-an-email' }),
    missingFirstName: () => buildUser({ first_name: '' }),
};

function validDobOffsetByAge(age: number): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() - age);
    return d.toISOString().slice(0, 10)
}



