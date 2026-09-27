import { test as setup, expect, request } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { ADMIN_STATE, API_URL, BASE_URL, CUSTOMER_STATE } from '../../playwright.config'

// App keeps JWT in localstorage under "auth-token"

async function storageState(
    email: string,
    password: string,
    statePath: string,
): Promise<void> {
    const api = await request.newContext({ baseURL: API_URL });
    const res = await api.post('/users/login', { data: { email, password }
    })
    expect(res.ok(), `login failed for ${email}: ${res.status()}`).toBeTruthy( );

    const { access_token: token } = await res.json();
    expect(token, `no access_token returned for ${email}`).toBeTruthy();
    await api.dispose();

    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.writeFileSync(
        statePath,
        JSON.stringify(
            {
                cookies: [],
                origins: [
                    {
                        origin: BASE_URL,
                        localStorage: [{ name: 'auth-token', value: token }]
                    },
                ],
            },
            null, 2,
        ),
    );
}

setup('authenticate as custome', async () => {
    await storageState(
        process.env.CUSTOMER_EMAIL!,
        process.env.CUSTOMER_PASSWORD!,
        CUSTOMER_STATE
    )
})

setup('authenticate as admin', async () => {
    setup.skip(!process.env.ADMIN_EMAIL, 'Admin tests run against a local container only')
    await storageState(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!, ADMIN_STATE)
})