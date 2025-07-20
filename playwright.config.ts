import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},

	testDir: 'e2e',

	use: {
		baseURL: 'http://localhost:4173'
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	]
});
