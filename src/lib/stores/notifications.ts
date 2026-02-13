import { writable } from 'svelte/store';
import type { Notification } from '$lib/types';

interface NotificationStore {
	notifications: Notification[];
}

function createNotificationStore() {
	const { subscribe, update } = writable<NotificationStore>({
		notifications: []
	});

	let notificationId = 0;

	return {
		subscribe,
		add: (
			type: Notification['type'],
			message: string,
			duration: number = 5000
		): string => {
			const id = `notification-${++notificationId}`;
			const notification: Notification = {
				id,
				type,
				message,
				duration
			};

			update((state) => ({
				notifications: [...state.notifications, notification]
			}));

			// Auto-dismiss after duration
			if (duration > 0) {
				setTimeout(() => {
					notificationStore.remove(id);
				}, duration);
			}

			return id;
		},
		remove: (id: string) => {
			update((state) => ({
				notifications: state.notifications.filter((n) => n.id !== id)
			}));
		},
		clear: () => {
			update(() => ({
				notifications: []
			}));
		},
		success: (message: string, duration?: number) => {
			return notificationStore.add('success', message, duration);
		},
		error: (message: string, duration?: number) => {
			return notificationStore.add('error', message, duration);
		},
		warning: (message: string, duration?: number) => {
			return notificationStore.add('warning', message, duration);
		},
		info: (message: string, duration?: number) => {
			return notificationStore.add('info', message, duration);
		}
	};
}

export const notificationStore = createNotificationStore();
