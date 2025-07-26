import { layoutLoadHandler } from '$lib';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = layoutLoadHandler;
