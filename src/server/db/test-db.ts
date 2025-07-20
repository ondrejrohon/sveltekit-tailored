import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!process.env.DATABASE_TEST_URL) throw new Error('DATABASE_TEST_URL is not set');

const testClient = postgres(process.env.DATABASE_TEST_URL);
export const testDb = drizzle(testClient);
