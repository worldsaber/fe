import { isEmptyObject } from 'utils';

/*
比赛时间转成分钟
 */
export function getSeconds(time = '', secondReq = true) {
	if (!time) {
		return '';
	}

	const timeArr = time.split(':') || [];
	let ret = secondReq ? 1 : 0;

	timeArr.length = timeArr.length ? timeArr.length - 1 : 0;

	if (!timeArr.length) {
		return ret;
	}

	ret = 0;
	timeArr.reverse();
	timeArr.forEach((item, index) => {
		ret += (index === 0 ? +item : item * index * 60);
	});

	return ret || 1;
}

/*
（hover 浮层）根据不同球类，显示不同的时间信息
 */
export function getScheduleDesc(event = {}, sportId = 1, secondReq = true, rugbyStatus = false) {
	let ret = '';

	if (isEmptyObject(event) || !sportId) {
		return ret;
	}

	switch (+sportId) {
	case 6: // Handball
	case 4: // Ice Hockey
	case 1: { // football
		const playedSeconds = getSeconds(event.playedSeconds, secondReq);
		const matchStatus = event.matchStatus || '';
		ret = `${playedSeconds ? playedSeconds + '\'' : ''} ${matchStatus}`;
		break;
	}
	// rugby
	case 12: {
		const playedSeconds = getSeconds(event.playedSeconds, secondReq);
		if (rugbyStatus) {
			const matchStatus = event.matchStatus || '';
			ret = `${playedSeconds ? playedSeconds + '\'' : ''} ${matchStatus}`;
		} else {
			ret = playedSeconds ? `${playedSeconds}'` : '';
		}

		break;
	}
	// basketball
	case 2: {
		const playedSeconds = getSeconds(event.remainingTimeInPeriod, secondReq);
		const matchStatus = event.matchStatus || '';
			// period = event.period || '';

		// matchStatus = period || matchStatus.replace(/\D/g, '');
		// matchStatus = matchStatus && `Q${matchStatus}` || '';
		ret = `${playedSeconds ? playedSeconds + '\'' : ''} ${matchStatus}`;
		break;
	}
	default:
		// 5:tennis, 21:cricket, 及其他运动
		ret = event.matchStatus || '';
	}

	return ret;
}

/*
获取显示的score
 */
export function getShowScore(eventItem = {}, sportId = 1, showPoint = false) {
	return getShowScoreArr(eventItem, sportId, showPoint).join(' ');
}

export function getShowScoreArr(eventItem = {}, sportId = 1, showPoint = false) {
	const ret = [];

	if (isEmptyObject(eventItem) || !sportId) {
		return ret;
	}

	let temp;

	// Tennis
	if (+sportId === 5) {
		(temp = eventItem.setScore) && ret.push(temp);
		(temp = eventItem.gameScore) && temp.length && (temp = temp[temp.length - 1]) && ret.push(temp);
		showPoint && (temp = eventItem.pointScore) && ret.push(temp);

		return ret;
	}
	// Volleyball, Beach Volley, Dart
	if ([22, 23, 34].includes(+sportId)) {
		(temp = eventItem.setScore) && ret.push(temp);
		(temp = eventItem.gameScore) && temp.length && (temp = temp[temp.length - 1]) && ret.push(temp);

		return ret;
	}

	(temp = eventItem.setScore) && ret.push(temp);

	return ret;
}

// +254 手机号码前缀fix
export function fixPhone(phone = '') {
	const countryCode = window.countryCode;

	if (phone && !/^0/.test(phone) && countryCode === '254') {
		const temp = `0${phone}`;
		return temp.length > 18 ? temp.slice(0, 18) : temp;
	}

	return phone;
}

export const numberMap = {
	ke: '0207640825',
	ng: '07008888888',
	gh: '0242426200'
};

// 不同国家 不同联系号码
export function getContactsNumber() {
	const country = window.country;
	return numberMap[country];
}
