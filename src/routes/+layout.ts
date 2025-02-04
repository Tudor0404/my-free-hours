import {
	createBrowserClient,
	createServerClient,
	isBrowser,
} from "@supabase/ssr";
import type { LayoutLoad } from "./$types";
import { PUBLIC_SUPABASE_ANON, PUBLIC_SUPABASE_URL } from "$env/static/public";
import type { Database } from "$types/database.types";

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
	/**
	 * Declare a dependency so the layout can be invalidated, for example, on
	 * session refresh.
	 */
	depends("supabase:auth");

	const supabase = isBrowser()
		? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON, {
			global: {
				fetch,
			},
		})
		: createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON, {
			global: {
				fetch,
			},
			cookies: {
				getAll() {
					return data.cookies;
				},
			},
		});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	supabase.auth.onAuthStateChange((event, session) => {
		let provider_token = null;
		let provider_refresh_token = null;

		if (session && session.provider_token) {
			provider_token = session.provider_token;
		}

		if (session && session.provider_refresh_token) {
			provider_refresh_token = session.provider_refresh_token;
		}

		setTimeout(async () => {
			if (provider_token && provider_refresh_token) {
				await supabase.from("user").update({
					ms_provider_token: provider_token,
					ms_provider_refresh_token: provider_refresh_token,
				}).eq("user_id", user?.id || "");
			} else if (provider_token) {
				await supabase.from("user").update({
					ms_provider_token: provider_token,
				}).eq("user_id", user?.id || "");
			} else if (provider_refresh_token) {
				await supabase.from("user").update({
					ms_provider_refresh_token: provider_refresh_token,
				}).eq("user_id", user?.id || "");
			}
		}, 0);
	});

	return { session, supabase, user };
};
