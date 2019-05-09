import dateFormat from 'kernel/js/dateFormat';

import { getScheduleDesc } from 'base/js/utils';

export function clearData(events = []) {
	const ret = [];

	for (const item of events) {
		if (item.eventId) {
			const isPrematch = +item.status === 0,
				sport = item.sport || {},
				category = sport.category || {},
				tournament = category.tournament || {};

			delete item.sport;

			let id = sport.id;

			if (id) {
				if (isPrematch) {
					item.showDate = dateFormat.format(item.estimateStartTime, 'DD/MM HH:mm');
				} else {
					item.isLive = true;
					id = id.replace(/\D/g, '');
					item.showDate = getScheduleDesc(item, id, true, true);
				}

				item.tourName = tournament.name || '';
				item.tourId = tournament.id || '';
				item.catyName = category.name || '';
				item.catyId = category.id || '';
				item.sportName = sport.name || '';
				item.sportId = sport.id;

				ret.push(item);
			}
		}
	}

	return ret;
}

export default clearData;
