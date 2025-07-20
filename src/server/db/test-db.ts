import { DATABASE_TEST_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const testClient = postgres(DATABASE_TEST_URL);
export const testDb = drizzle(testClient);
