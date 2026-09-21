// playwright.config.ts
import process from "node:process";
import { defineConfig, devices } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "https://practicesoftwaretesting.com";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	retries: process.env.CI ? 2 : 0,
	reporter: [["html"], ["list"]],
	use: {
		baseURL: BASE,
		testIdAttribute: "data-test",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	projects: [
		{ name: "setup", testMatch: /auth\.setup\.ts/ },
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				storageState: ".auth/customer.json",
			},
			dependencies: ["setup"],
		},
		{ name: "mobile", use: { ...devices["Pixel 7"] }, grep: /@smoke/ },
		{
			name: "api",
			testDir: "./tests/api",
			use: { baseURL: process.env.API_URL },
		},
	],
});
