export const actions = {
	createType: async ({ cookies, request }) => {
		const data = await request.formData();

		console.log(data);
	}
};
