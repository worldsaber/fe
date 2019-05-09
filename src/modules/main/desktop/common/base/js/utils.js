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
export function getScheduleDesc(event = {}, sportId = 1, secondReq = true) {
	let ret = '';

	if (isEmptyObject(event) || !sportId) {
		return ret;
	}

	// return event.matchStatus;
	switch (+sportId) {
	// football
	// 12/21 昊天强烈要求加matchstatus
	case 1:
	case 4:
	case 6: {
		const playedSeconds = getSeconds(event.playedSeconds, secondReq);
		const matchStatus = event.matchStatus || '';
		ret = `${playedSeconds ? playedSeconds + '\'' : ''} ${matchStatus}`;
		break;
	}
	// rugby
	case 12: {
		const playedSeconds = getSeconds(event.playedSeconds, secondReq);
		ret = playedSeconds ? `${playedSeconds}'` : '';
		break;
	}
	// basketball
	case 2: {
		const playedSeconds = getSeconds(event.remainingTimeInPeriod, secondReq);
		// let period = event.period || '',
		const matchStatus = event.matchStatus || '';

		// matchStatus = period || matchStatus.replace(/\D/g, '');
		// matchStatus = matchStatus && `Q${matchStatus}` || '';
		ret = `${playedSeconds ? playedSeconds + '\'' : ''} ${matchStatus}`;
		break;
	}
	// tennis
	case 5: {
		const matchStatus = event.matchStatus || '';
			// period = event.period || '';

		// matchStatus = period || matchStatus.replace(/\D/g, '');
		ret = matchStatus && `${matchStatus}` || '';
		break;
	}
	// cricket
	case 21:
	case 22:
	case 23:
	case 34: {
		const matchStatus = event.matchStatus || '';
			// period = event.period || '';

		// matchStatus = period || matchStatus.replace(/\D/g, '');
		ret = matchStatus && `${matchStatus}` || '';
		break;
	}
	default:
	}

	return ret;
}

/*
获取显示的score
 */
export function getShowScore(eventItem = {}, sportId = 1, showPoint = false) {
	if (isEmptyObject(eventItem) || !sportId) {
		return '';
	}

	// Tennis
	if (+sportId === 5) {
		return `${eventItem.setScore || ''} ${eventItem.gameScore && eventItem.gameScore.length && eventItem.gameScore[eventItem.gameScore.length - 1] || ''} ${showPoint && eventItem.pointScore || ''}`;
	}
	// Volleyball Beach Volley
	if ([23, 34].includes(+sportId)) {
		const gameScore = eventItem.gameScore && eventItem.gameScore.length ? eventItem.gameScore[eventItem.gameScore.length - 1] : '';
		return `${eventItem.setScore || ''} ${gameScore}`;
	}
	// footBall Basketball Rugby
	if ([1, 2, 12].includes(+sportId)) {
		return eventItem.setScore || '';
	}

	return eventItem.setScore || '';
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
// 不同国家 不同联系号码
export function getContactsNumber() {
	const country = window.country;
	const numberMap = {
		ke: '0207640825',
		ng: '07008888888',
		gh: '0242426200'
	};
	return numberMap[country];
}
