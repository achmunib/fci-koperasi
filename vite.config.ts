import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['date-fns', 'lucide-svelte']
	},
	build: {
		// Improve code splitting for better caching
		rollupOptions: {
			output: {
				manualChunks: {
					// Separate vendor chunks for better caching
					'vendor-icons': ['lucide-svelte'],
					'vendor-date': ['date-fns']
				}
			}
		},
		// Reduce chunk size warnings threshold
		chunkSizeWarningLimit: 600
	},
	server: {
		fs: {
			strict: false
		}
	}
});
