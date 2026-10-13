import { test as setup } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { ADMIN_STATE, API_URL, BASE_URL, CUSTOMER_STATE } from '../../playwright.config'
import { Api } from '../../src/api'
import { buildUser } from '../../src/data'

// App keeps JWT in localstorage under "auth-token"

function writeState(token: string, statePath: string): void {
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

setup('authenticate as customer', async () => {
    const api = await Api.create();
    const { token } = await api.auth.registerAndLogin(buildUser());
    await api.dispose();

    writeState(token, CUSTOMER_STATE);
})

setup('authenticate as admin', async () => {
    setup.skip(!process.env.ADMIN_EMAIL, 'Admin tests run against a local container only')

    const api = await Api.create();
    const token = await api.auth.login(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
    await api.dispose();

    writeState(token, ADMIN_STATE);
})