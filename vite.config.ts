import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['date-fns', 'lucide-svelte']
	},
	server: {
		fs: {
			strict: false
		}
	}
});
