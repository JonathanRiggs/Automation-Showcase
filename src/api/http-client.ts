import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { API_URL } from "../../playwright.config";

interface RequestOptions {

    // When true, a non-2xx response immediately throws with the status and body. 

    expectOk?: boolean;
    params?: Record<string, string | number | boolean>;
    headers?: Record<string, string>;
}

export class HttpClient {
    private token?: string;

    private constructor(private readonly ctx: APIRequestContext) { }

    static async create(baseURL: string = API_URL): Promise<HttpClient> {
        return new HttpClient(await request.newContext({ baseURL }))
    }

    withToken(token: string): this {
        this.token = token;
        return this;
    }

    clearToken(): this {
        this.token = undefined;
        return this;
    }

    get authToken(): string | undefined {
        return this.token
    }

    async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
        const res = await this.ctx.get(url, {
            headers: this.headers(options.headers),
            params: options.params,
        })
        return this.unwrap<T>(res, 'GET', url, options.expectOk)
    }

    async post<T>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
        const res = await this.ctx.post(url, { data, headers: this.headers(options.headers) });
        return this.unwrap<T>(res, 'POST', url, options.expectOk);
    }

    async put<T>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
        const res = await this.ctx.put(url, { data, headers: this.headers(options.headers) });
        return this.unwrap<T>(res, 'PUT', url, options.expectOk);
    }

    async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
        const res = await this.ctx.delete(url, { headers: this.headers(options.headers) });
        return this.unwrap<T>(res, 'DELETE', url, options.expectOk);
    }

    raw(): APIRequestContext {
        return this.ctx
    }

    authHeaders(): Record<string, string> {
        return this.token ? { Authorization: `Bearer ${this.token}` } : {};
    }

    async dispose(): Promise<void> {
        await this.ctx.dispose()
    }

    private headers(extra?: Record<string, string>): Record<string, string> {
        return { Accept: 'application/json', ...this.authHeaders(), ...extra };
    }

    private async unwrap<T>(
        res: APIResponse,
        method: string,
        url: string,
        expectOk = true,
    ): Promise<T> {
        if (expectOk && !res.ok()) {
            throw new Error(
                `${method} ${url} returned ${res.status()} ${res.statusText()}\n${await res.text()}`,
            )
        }

        const body = await res.text();
        return (body ? JSON.parse(body) : undefined) as T;
    }


}