import type { RequestHandler } from './$types';
import { signoutHandler } from '$lib';

export const GET: RequestHandler = signoutHandler;
