import userPush from 'push/userPush';
// import dateFormat from 'kernel/js/dateFormat';

export function getGoodListByStatus(params, url = '/bingowin/goods') {
	return fetch(url, {
		body: params,
		method: 'GET',
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})
	.then(res => res.json())
	.then(res => {
		if (res.bizCode === 10000) {
			const data = res.data;
			const extra = data.extra || {};
			const list = data.entityList || [];
			// hasMore
			const hasMore = extra.hasNext;

			// 增加服务器校验时间
			for (const item of list) {
				if (extra.serverTime) {
					item._serverTime = extra.serverTime;
				}
			}
			return {
				list,
				hasMore,
				lastId: extra.lastId,
			};
		}
		return Promise.reject(res);
	});
}
export function getMineGoodListByStatus(params) {
	return getGoodListByStatus(params, '/bingowin/goods/mine');
}

function makeTopic(goodsId = '~', roundId = '~') {
	let topic = 'bingoWin^boughtAmount';
	// 商品、期次
	topic = `${topic}^${goodsId}^${roundId}`;
	return topic;
}
export function subBingoPush({ listener, goodsId, roundId }) {
	userPush.sub({
		topic: makeTopic(goodsId, roundId),
		pushType: 'GROUP',
		listener
	});
}
export function unsubBingoPush({
	listener,
	goodsId,
	roundId
}) {
	userPush.unsub({
		topic: makeTopic(goodsId, roundId),
		pushType: 'GROUP',
		listener
	});
}

export function getGoodsTime(item) {
	let time = item.startTime;
	let label = 'Start Time: ';
	// 开奖
	if ([3, 4].includes(item.status)) {
		time = item.publishedTime;
		label = 'Announcement Time: ';
	}
	// closed
	if (item.status === 10) {
		time = item.endTime;
		label = 'Closing Time: ';
	}

	if (time) {
		time = UTCToServer(time);
		//  dateFormat.format(time, 'DD/MM/YYYY HH:mm:ss');
		return `${label}${time}`;
	}

	return '';
}

export function getGoodsByRoundId(roundId, status = 1) {
	return fetch('/bingowin/goods/round', {
		method: 'GET',
		body: {
			roundId,
			status,  // 后台方便缓存，要求加上status
		},
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	})
	.then(res => res.json())
	.then(res => {
		if (res.bizCode === 10000) {
			const data = res.data;
			return data;
		}
	});
}

/**
 * 获取最新期次
 * @param  {String} goodsId 商品id
 * @return {String} roundId 期次id
 */
export async function getLatestPeriod(goodsId) {
	try {
		const res = await fetch(`/bingowin/goods/latestRound?goodsId=${goodsId}`, {
			methods: 'GET'
		}).then(response => response.json());

		const { bizCode, data } = res;

		if (bizCode === 10000 && data) {
			return data.roundId;
		}
		return Promise.reject();
	} catch (err) {
		console.log('err: ', err); // eslint-disable-line
		return Promise.reject(err);
	}
}
export function UTCToServer(ts, showMs) {
	const delta = window.country === 'ke' ? 3 : 1; // ke: UTC+3:00  ng: UTC+1:00 后面需要增加对应国家
	try {
		const date = new Date(ts);
		date.setTime(date.getTime() + (delta * 60 * 60 * 1000)); // UTC+3:00
		if (showMs) {
			return `${pad(date.getUTCDate(), 2)}/${pad(date.getUTCMonth() + 1, 2)}/${pad(date.getUTCFullYear(), 4)} ${pad(date.getUTCHours(), 2)}:${pad(date.getUTCMinutes(), 2)}:${pad(date.getUTCSeconds(), 2)}.${pad(date.getUTCMilliseconds(), 3)}`;
		}
		return `${pad(date.getUTCDate(), 2)}/${pad(date.getUTCMonth() + 1, 2)}/${pad(date.getUTCFullYear(), 4)} ${pad(date.getUTCHours(), 2)}:${pad(date.getUTCMinutes(), 2)}:${pad(date.getUTCSeconds(), 2)}`;
	} catch (e) {
		console.log(e);
	}
}
function pad(str, len) {
	let tmp = '' + str;
	while (tmp.length < len) {
		tmp = '0' + tmp;
	}
	return tmp;
}
export default {
	getGoodListByStatus,
	subBingoPush,
	unsubBingoPush,
	getGoodsByRoundId,
	getGoodsTime,
	getLatestPeriod
};

