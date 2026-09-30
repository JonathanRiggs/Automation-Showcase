import { test, expect } from '@playwright/test'
import { Api, schemas } from '../../src/api'
import { buildUser } from '../../src/data/user.factory'

test.describe('Products API contract', () => {
    let api: Api;

    test.beforeAll(async () => {
        api = await Api.create()
    });

    test.afterAll(async () => {
        await api.dispose();
    });

    test('GET /products returns a valid paginated product list @api @smoke', async () => {
        const body = await api.products.list();
        const result = schemas.paginatedSchema(schemas.productSchema).safeParse(body);

        expect(result.success, JSON.stringify(result.error?.issues, null, 2)).toBe(true);
        expect(body.data.length).toBeGreaterThan(0);
    });

    test('GET /products/{id} matches the product schema @api', async () => {
        const { id } = await api.products.anyInStock();
        const product = await api.products.byId(id);

        expect(schemas.productSchema.safeParse(product).success).toBe(true);
    });

    test('GET /products sorted by price ascending is actually sorted @api', async () => {
        const { data } = await api.products.list({ sort: 'price,asc', 'page[size]': 20 });
        const prices = data.map((p) => p.price)

        expect(prices).toEqual([...prices].sort((a, b) => a - b));
    })
})

test.describe('Authorization', () => {
    test('GET /invoices without a token is rejected @api @security', async () => {
        const api = await Api.create()

        const res = await api.http.raw().get('/invoices');

        expect(res.status()).toBe(401);
        await api.dispose()
    })

    test('a customer token cannot list all users @api @security', async () => {
        const api = await Api.create();
        await api.auth.registerAndLogin(buildUser());

        const res = await api.http.raw().get('/users', { headers: api.http.authHeaders() });

        expect([401, 403]).toContain(res.status());
        await api.dispose();
    })
})