<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { hasPermission, type Permission } from '$lib/utils/permissions';

	interface Props {
		permission: Permission;
		children?: any;
		fallback?: any;
	}

	let { permission, children, fallback }: Props = $props();

	// Use $derived to reactively compute access
	const userRole = $derived($authStore.user?.role || 'viewer');
	const hasAccess = $derived(hasPermission(userRole, permission));
</script>

{#if hasAccess}
	{@render children?.()}
{:else if fallback}
	{@render fallback?.()}
{/if}
