import type { Database } from '$types/database.types';
import { get, writable } from 'svelte/store';

type ScheduleRow = Database['public']['Tables']['schedule']['Row'];

function createCounterStore() {
	const store = writable<Record<number, ScheduleRow>>({});
	const { set, subscribe } = store;

	async function getNewData(): Promise<Record<number, ScheduleRow>> {
		try {
			const res = await fetch('/api/schedule/get', { method: 'GET' });
			if (!res.ok) {
				return {};
			}
			const newSchedules: ScheduleRow[] = await res.json();
			return Object.fromEntries(newSchedules.map((item) => [item.id, item])) as Record<
				number,
				ScheduleRow
			>;
		} catch (e) {
			return {};
		}
	}

	return {
		subscribe,
		getSchedule: (id: number): ScheduleRow | null => {
			if (id < 0) {
				return null;
			}

			let s: Record<number, ScheduleRow> = get(store);

			return s[id] || null;
		},
		get: () => get(store),
		getAsArray: () => {
			return Object.values(get(store));
		},
		refresh: async () => {
			const data = await getNewData();
			set(data);
		},
		setFromArray: (s: ScheduleRow[]) => {
			set(Object.fromEntries(s.map((item) => [item.id, item])));
		}
	};
}

export const schedulesStore = createCounterStore();
