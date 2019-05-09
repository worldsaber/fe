function UPDATE_DATA(state, payload) {
	const keys = Object.keys(state);
	for (const key of keys) {
		if (key in payload) {
			state[key] = payload[key];
		}
	}
}

export default {
	UPDATE_DATA
};
