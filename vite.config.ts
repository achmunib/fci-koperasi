import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['date-fns', 'lucide-svelte']
	},
	build: {
		// Reduce chunk size warnings threshold
		chunkSizeWarningLimit: 600
	},
	server: {
		fs: {
			strict: false
		}
	}
});
