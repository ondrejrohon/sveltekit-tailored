import { layoutLoadHandler } from 'sveltekit-kleo';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = layoutLoadHandler;
