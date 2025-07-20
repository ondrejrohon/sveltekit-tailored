import { jwtLoginHandler, jwtRefreshHandler } from 'sveltekit-kleo';

export const POST = jwtLoginHandler;

export const PUT = jwtRefreshHandler;
