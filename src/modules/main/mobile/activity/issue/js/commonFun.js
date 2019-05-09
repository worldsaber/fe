export function formatTime(sec) {
	const date = {
		minute: 0,
		second: 0,
	};
	if (sec <= 0) {
		return date;
	}

	date.minute = Math.floor(sec / 1000 / 60);
	date.second = Math.floor(sec % 60000 / 1000);

	return date;
}
export function getAdvertInArray(advert) {
	if (!advert || !advert.ads) {
		return [];
	}
	if (advert.isCarousel === 0) {
		return [advert.ads];
	}
	return advert.ads;
}
export function getAdvertInObject(advert) {
	if (!advert || !advert.ads) {
		return null;
	}
	if (advert.isCarousel === 1) {
		return advert.ads[0];
	}
	return advert.ads;
}

export default formatTime;
