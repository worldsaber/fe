export const splitFileName = str => {
	const arr = str ? str.split('.') : [];
	if (arr.length < 2) {
		return {
			name: arr[0],
			type: ''
		};
	}
	const type = arr.pop();
	return {
		name: arr.join('.'),
		type
	};
};

export default {
	splitFileName
};
