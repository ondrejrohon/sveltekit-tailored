import type { Handle } from '@sveltejs/kit';
import { jwtVerify, errors } from 'jose';
import { JWT_SECRET } from '$env/static/private';
import { db } from '$lib/server/db/index.js';
import * as tables from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { sessionCookieName } from '$lib/server/constants.js';
import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	validateSessionToken
} from '$lib/server/lucia-auth/session.js';
import type { User } from '$lib/server/lucia-auth/user.js';

const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Creates an authentication handler with support for custom user types.
 *
 * @template TUser - The user type (defaults to the base User type)
 * @returns A SvelteKit handle function that validates sessions and sets event.locals
 *
 * @example
 * // Current project - uses default User type
 * export const authHandler = createAuthHandler();
 *
 * @example
 * // Project with extended user type (e.g., with role field)
 * interface ExtendedUser extends User {
 *   role: 'admin' | 'user';
 * }
 * export const authHandler = createAuthHandler<ExtendedUser>();
 */
export function createAuthHandler<TUser = User>(): Handle {
	return async ({ event, resolve }) => {
		const authHeader = event.request.headers.get('authorization');

		if (authHeader?.startsWith('Bearer ')) {
			// Token auth for mobile
			const token = authHeader.split(' ')[1];
			try {
				const { payload } = await jwtVerify(token, secret);
				const user = await db
					.select()
					.from(tables.user)
					.where(eq(tables.user.id, payload.userId as string));
				event.locals.user = user[0] as TUser;
			} catch (error) {
				// Token invalid/expired
				event.locals.user = null;

				const errorMessage = error instanceof errors.JWTExpired ? 'token_expired' : 'token_invalid';

				return new Response(JSON.stringify({ message: errorMessage }), {
					status: 401,
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		} else {
			// cookies auth for web
			const sessionToken = event.cookies.get(sessionCookieName);
			if (!sessionToken) {
				event.locals.user = null;
				event.locals.session = null;
				return resolve(event);
			}

			const { session, user } = await validateSessionToken<TUser>(sessionToken);
			if (session) {
				setSessionTokenCookie(event, sessionToken, session.expiresAt);
			} else {
				deleteSessionTokenCookie(event);
			}

			event.locals.user = user;
			event.locals.session = session;
		}

		return resolve(event);
	};
}

// Default export for current project (backward compatible)
export const authHandler = createAuthHandler();
