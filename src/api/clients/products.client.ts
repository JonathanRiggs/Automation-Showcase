import { HttpClient } from "../http-client";
import { Brand, Category, Paginated, Product } from '../types'

export class ProductsClient {
    constructor(private readonly http: HttpClient) { }

    async list(params: Record<string, string | number | boolean> = {}): Promise<Paginated<Product>> {
        return this.http.get<Paginated<Product>>('/products', { params });
    }

    async search(term: string): Promise<Paginated<Product>> {
        return this.http.get<Paginated<Product>>('/products/search', { params: { q: term } });
    }

    async byId(id: string): Promise<Product> {
        return this.http.get<Product>(`/products/${id}`)
    }

    // Any product a test can safely add to a cart

    async anyInStock(): Promise<Product> {
        const { data } = await this.list({ 'page[size]': 50 });
        const product = data.find((p) => p.in_stock && !p.is_rental);
        if (!product) throw new Error('No in-stock, non-rental product found in the catalog')
        return product;
    }

    async someInStock(count: number): Promise<Product[]> {
        const { data } = await this.list({ 'page[size]': 50 })
        const products = data.filter((p) => p.in_stock && !p.is_rental).slice(0, count)
        if (products.length < count) {
            throw new Error(`Needed ${count} in-stock products, found ${products.length}`)
        }
        return products;
    }

    async brands(): Promise<Brand[]> {
        return this.http.get<Brand[]>('/brands');
    }

    async categories(): Promise<Category[]> {
        return this.http.get<Category[]>('/categories')
    }
}