export type BookingTypePublic = {
	name: string;
	online: boolean;
	in_person: boolean;
	durations: number[];
	description: string | null;
	id: number;
};
