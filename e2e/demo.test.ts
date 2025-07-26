import { expect, test } from '@playwright/test';
import { testDb } from '../src/lib/server/db/test-db.js';
import * as tables from '../src/lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

test.describe('auth', () => {
	test('home page has expected h1', async ({ page }) => {
		console.log(
			'test db setup - env:',
			process.env.NODE_ENV,
			'dbUrl:',
			process.env.DATABASE_TEST_URL
		);

		const email = `testuser${Date.now()}@example.com`;

		await page.goto('/');
		await expect(page.locator('nav a')).toHaveCount(3);

		await page.getByRole('link', { name: 'Signup' }).click();
		await page.getByRole('textbox', { name: 'Email' }).click();
		await page.getByRole('textbox', { name: 'Email' }).fill(email);
		await page.getByRole('textbox', { name: 'Email' }).press('Tab');
		await page.getByRole('textbox', { name: 'Password' }).fill('Nbusr123!@');
		await page.getByRole('button', { name: 'Create account' }).click();

		await page.getByRole('textbox', { name: 'Verification Code' }).click();

		// get user from db
		const [user] = await testDb.select().from(tables.user).where(eq(tables.user.email, email));
		// update verification code in db to 111111
		await testDb
			.update(tables.emailVerificationRequest)
			.set({ code: '111111' })
			.where(eq(tables.emailVerificationRequest.userId, user.id));

		await page.getByRole('textbox', { name: 'Verification Code' }).fill('111111');
		await Promise.all([
			page.getByRole('button', { name: 'Verify Email' }).click(),
			page.waitForURL('/')
		]);

		// verify that user is verified
		const [user2] = await testDb.select().from(tables.user).where(eq(tables.user.email, email));

		expect(user2.emailVerified).toBe(true);
	});
});
