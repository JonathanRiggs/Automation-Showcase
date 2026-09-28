import { HttpClient } from "../http-client";
import { Cart, CartItem } from '../types'

export class CartsClient {
    constructor(private readonly http: HttpClient) { }

    async create(): Promise<string> {
        const { id } = await this.http.post<{ id: string }>('/carts');
        return id;
    }

    async addItem(cartId: string, item: CartItem): Promise<void> {
        await this.http.post(`/carts/${cartId}`, item)
    }

    async createWith(items: CartItem[]): Promise<string> {
        const cartId = await this.create();
        for (const item of items) {
            await this.addItem(cartId, item)
        }
        return cartId;
    }

    async updateQuantity(cartId: string, item: CartItem): Promise<void> {
        await this.http.put(`/carts/${cartId}/product/quantity`, item)
    }

    async removeProduct(cartId: string, productId: string): Promise<void> {
        await this.http.delete(`/carts/${cartId}/product/${productId}`)
    }

    async get(cartId: string): Promise<Cart> {
        return this.http.get<Cart>(`/carts/${cartId}`)
    }

    async deleteCart(cartId: string): Promise<void> {
        await this.http.delete(`/carts/${cartId}`)
    }
}