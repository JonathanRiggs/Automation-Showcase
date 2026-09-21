import { faker } from "@faker-js/faker";
import { test as base } from "@playwright/test";

type User = { email: string; password: string };

export const test = base.extend<{ newUser: User }>({
	newUser: async ({ request }, use) => {
		const user = {
			first_name: faker.person.firstName(),
			last_name: faker.person.lastName(),
			email: faker.internet.email({ provider: "example.test" }),
			password: faker.internet.password({ length: 12, memorable: true }),
			dob: faker.date
				.birthdate({ min: 18, max: 65, mode: "age" })
				.toISOString()
				.split("T")[0],
			// Check Swagger for the current address shape (it differs across sprints)
		};
		const res = await request.post(`${process.env.API_URL}/users/register`, {
			data: user,
		});
		if (!res.ok())
			throw new Error(`register failed: ${res.status()} ${await res.text()}`);
		await use({ email: user.email, password: user.password });
	},
});
