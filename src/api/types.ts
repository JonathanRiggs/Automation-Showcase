// Req / Res for the TOOLSHOP API

export interface NewAddress {
    street: string;
    house_number?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
}

export interface NewUser {
    first_name: string;
    last_name: string;
    dob: string;
    phone: string;
    email: string;
    password: string;
    address: NewAddress;
}

export interface RegisteredUser extends NewUser {
    id: string;
    token: string;
}

export interface LoginResponse {
    access_token: string;
    token_type?: string;
    expires_in?: number;
    message?: string;
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id?: string | null;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    is_location_offer: boolean;
    is_rental: boolean;
    in_stock: boolean;
    is_eco_friendly?: boolean;
    co2_rating?: number | null;
    brand?: Brand;
    category?: Category;
}

// Laravels paginator envelope
export interface Paginated<T> {
    current_page: number;
    data: T[];
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface CartItem {
    product_id: string;
    quantity: number;
}

export interface Cart {
    id: string;
    additional_discount_percentage?: number | null;
    cart_item?: unknown[];
}

export type PaymentMethod =
    | 'bank-transfer'
    | 'cash-on-delivery'
    | 'credit-card'
    | 'buy-now-pay-later'
    | 'gift-card';


export type PaymentDetails =
    | { bank_name: string; account_name: string; account_number: string }
    | Record<string, never> // cash-on-delivery takes no details
    | {
        credit_card_number: string;
        expiration_date: string;
        cvv: string;
        card_holder_name: string;
    }
    | { monthly_installments: number }
    | { gift_card_number: string; validation_code: string };

export interface NewInvoice {
    payment_method: PaymentMethod;
    payment_details: PaymentDetails;
    invoice_date?: string;
    billing_street: string;
    billing_city: string;
    billing_state?: string;
    billing_country: string;
    billing_postal_code?: string;
    cart_id: string;
}

export interface Invoice {
    id: string;
    invoice_number: string;
    invoice_date: string;
    total: number;
    status?: string;
    payment_method: PaymentMethod;
    billing_street: string;
    billing_city: string;
    billing_country: string;
}

export interface Favorite {
    id: string;
    product_id: string;
    product?: Product;
}

export interface ContactMessagePayload {
    name?: string;
    email?: string;
    subject: string;
    message: string;
}

