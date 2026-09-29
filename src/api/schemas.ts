import { z } from 'zod';

/**
 * Contract schemas. These are deliberately strict about types and loose about
 * optional relations: a type change (price becoming a string) is a real
 * regression, an absent embedded brand usually is not.
 *
 * Run these against the with-bugs build to see which contracts it breaks.
 */

export const brandSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    slug: z.string().min(1),
});

export const categorySchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    slug: z.string().min(1),
    parent_id: z.string().nullable().optional(),
});

export const productSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string(),
    price: z.number().positive(),
    is_location_offer: z.boolean(),
    is_rental: z.boolean(),
    in_stock: z.boolean(),
    is_eco_friendly: z.boolean().optional(),
    co2_rating: z.number().nullable().optional(),
    brand: brandSchema.optional(),
    category: categorySchema.optional(),
});

/** Laravel's paginator envelope, parameterised over the row type. */
export const paginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
    z.object({
        current_page: z.number().int().positive(),
        data: z.array(item),
        from: z.number().int().nullable(),
        last_page: z.number().int().positive(),
        per_page: z.union([z.number().int(), z.string()]),
        to: z.number().int().nullable(),
        total: z.number().int().nonnegative(),
    });

export const loginResponseSchema = z.object({
    access_token: z.string().min(10),
    token_type: z.string().optional(),
    expires_in: z.number().optional(),
});

export const invoiceSchema = z.object({
    id: z.string(),
    invoice_number: z.string().min(1),
    invoice_date: z.string(),
    total: z.number().nonnegative(),
    payment_method: z.enum([
        'bank-transfer',
        'cash-on-delivery',
        'credit-card',
        'buy-now-pay-later',
        'gift-card',
    ]),
    billing_street: z.string(),
    billing_city: z.string(),
    billing_country: z.string(),
});

export const cartSchema = z.object({
    id: z.string(),
    additional_discount_percentage: z.number().nullable().optional(),
});