import { jwtLoginHandler, jwtRefreshHandler } from '$lib';

export const POST = jwtLoginHandler;

export const PUT = jwtRefreshHandler;
