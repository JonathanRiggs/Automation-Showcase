import { HttpClient } from "../http-client";
import { LoginResponse, NewUser } from "../types";

export class AuthClient {
    constructor(private readonly http: HttpClient) { }

    async register(user: NewUser): Promise<{ id: string }> {
        return this.http.post<{ id: string }>('/users/register', user)
    }

    async login(email: string, password: string): Promise<string> {
        const { access_token } = await this.http.post<LoginResponse>('/users/login', {
            email,
            password,
        });
        if (!access_token) {
            throw new Error(`Login succeeded but returned no access_token for ${email}`)
        }
        return access_token;
    }

    async registerAndLogin(user: NewUser): Promise<{ id: string; token: string }> {
        const { id } = await this.register(user);
        const token = await this.login(user.email, user.password);
        this.http.withToken(token);
        return { id, token };
    }

    async me<T = Record<string, unknown>>(): Promise<T> {
        return this.http.get<T>('/users/me')
    }

    async logout(): Promise<void> {
        await this.http.get('/users/logout')
        this.http.clearToken()
    }
}