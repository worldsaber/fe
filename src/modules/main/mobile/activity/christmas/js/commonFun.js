export function formatTime(sec) {
	const date = {
		hour: 0,
		minute: 0,
		second: 0,
	};

	if (sec <= 0) {
		return date;
	}

	const minutes = sec / 1000 / 60;

	date.hour = Math.floor(minutes / 60);
	date.minute = Math.floor(minutes % 60);
	date.second = Math.floor(sec % 60000 / 1000);

	return date;
}

export default formatTime;
