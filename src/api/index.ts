import { HttpClient } from "./http-client";
import { AuthClient } from "./clients/auth.client";
import { CartsClient } from "./clients/carts.client";
import { ProductsClient } from "./clients/products.client";
import { ContactClient, FavoritesClient, InvoicesClient } from "./clients";


// One object to hold every client resource

export class Api {
    readonly auth: AuthClient;
    readonly products: ProductsClient;
    readonly carts: CartsClient;
    readonly invoices: InvoicesClient;
    readonly favorites: FavoritesClient;
    readonly contact: ContactClient;

    private constructor(readonly http: HttpClient) {
        this.auth = new AuthClient(http);
        this.products = new ProductsClient(http);
        this.carts = new CartsClient(http);
        this.invoices = new InvoicesClient(http);
        this.favorites = new FavoritesClient(http);
        this.contact = new ContactClient(http);
    }

    static async create(baseURL?: string): Promise<Api> {
        return new Api(await HttpClient.create(baseURL))
    }

    get token(): string | undefined {
        return this.http.authToken;
    }

    async dispose(): Promise<void> {
        await this.http.dispose();
    }
}

export { HttpClient } from './http-client'
export * from './types'
export * as schemas from './schemas'