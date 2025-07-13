import {
	resetPasswordVerificationActions,
	resetPasswordVerificationLoadHandler
} from 'sveltekit-kleo';

export const load = resetPasswordVerificationLoadHandler;

export const actions = resetPasswordVerificationActions;
