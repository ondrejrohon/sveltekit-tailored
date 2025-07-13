import type { RequestHandler } from './$types';
import { signoutHandler } from 'sveltekit-kleo';

export const GET: RequestHandler = signoutHandler;
