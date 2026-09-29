import { HttpClient } from "../http-client";
import {
    ContactMessagePayload,
    Favorite,
    Invoice,
    NewInvoice,
    Paginated,
} from '../types'

export class InvoicesClient {
    constructor(private readonly http: HttpClient) { }

    async create(invoice: NewInvoice): Promise<Invoice> {
        return this.http.post<Invoice>('/invoices', invoice)
    }

    async list(): Promise<Paginated<Invoice>> {
        return this.http.get<Paginated<Invoice>>('/invoices')
    }

    async byId(id: string): Promise<Invoice> {
        return this.http.get<Invoice>(`/invoices/${id}`)
    }

    async latest(): Promise<Invoice> {
        const { data } = await this.list();
        const invoice = data[0];
        if (!invoice) throw new Error('No invoices found for this user')
        return invoice;
    }
}

export class FavoritesClient {
    constructor(private readonly http: HttpClient) { }

    async add(productId: string): Promise<Favorite> {
        return this.http.post<Favorite>('/favorites', { product_id: productId })
    }

    async list(): Promise<Favorite[]> {
        return this.http.get<Favorite[]>('/favorites')
    }

    async remove(favoriteId: string): Promise<void> {
        await this.http.delete(`/favorites/${favoriteId}`)
    }
}

export class ContactClient {
    constructor(private readonly http: HttpClient) { }

    async send(payload: ContactMessagePayload): Promise<{ id: string }> {
        return this.http.post<{ id: string }>('/messages', payload)
    }
}