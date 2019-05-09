import Vue from 'vue';
import {
	convertEventsToMap,
	updateMarketStatus
} from 'components/eventUtil/util';
import dateFormat from 'kernel/js/dateFormat';

/**
 *  按照eventsMap的格式更新数据
 * @param {*} events 一个object按照id存储数据
 * @param {*} eventOrder eventOrder
 * 		(1) 一个map按照日期存储下面的比赛，每个日期下面的比赛是数组
 * 		(2) 一个由 eventId 组成的纯数组
 * @param {*} eventInfo clearPushData解析的eventInfo
 * @param {*} topicInfo clearPushTopic解析的topic
 * @param {*} productId 产品id
 * @param {*} isInsert 是否新增
 * @param {*} isDel  是否删除
 */
function updateEventByEvt (events, eventOrder, eventInfo, topicInfo, productId, isInsert = true, isDel = true) {
	if (!eventInfo) {
		return;
	}
	// 只有新增的时候更新 totalMarketSize
	const bmLcooCount = eventInfo.bmLcooCount;
	const bmLiveCount = eventInfo.bmLiveCount;
	const eventId = topicInfo.eventId;
	const categoryId = `sr:category:${topicInfo.categoryId}`;
	delete eventInfo.bmLcooCount;
	delete eventInfo.bmLiveCount;
	let event;
	if (events && eventOrder) {
		let status;
		// 直播
		// 0:NotStarted; 1:Live; 2. suspended; 3:Ended; 4:Finished("closed");
		// 5:Cancelled; 6:Abandoned; 7 Delayed; 8:Unknown
		if (productId === 1) {
			status = eventInfo.status === 1 || eventInfo.status === 2 || eventInfo.status === 8;
		} else {
			status = eventInfo.status !== 1 && eventInfo.status !== 3 && eventInfo.status !== 4;
		}
		event = events[eventId];
		if (event) {
			// pushTime直接合并上去，不受监控
			if ((event.pushTime && event.pushTime < eventInfo.pushTime) || !event.pushTime) {
				// 比赛不可以投注删除
				if (!status && isDel) {
					Vue.delete(events, eventId);
					// 如果 eventOrder 是 eventId 组成的数组，则直接处理
					if (Array.isArray(eventOrder)) {
						const index = eventOrder.findIndex(cur => cur === eventId);
						if (index > -1) {
							eventOrder.splice(index, 1);
						}
					} else {
						for (const key in eventOrder) { // eslint-disable-line
							const one = eventOrder[key];
							const index = one.findIndex(cur => cur === eventId);
							if (index > -1) {
								one.splice(index, 1);
								if (one.length === 0) {
									Vue.delete(eventOrder, key);
								}
								break;
							}
						}
					}
				} else {
					// 更新比赛信息
					Object.assign(event, eventInfo);
					const betStatus = event.betStatus;
					if (betStatus && (betStatus === 1 || betStatus === 2)) {
						updateMarketStatus(event.markets, betStatus);
					}
				}
			}
			// 只有在eventInfo是 1， 2，8的情况下才能新增比赛
		} else if (eventInfo.estimateStartTime && status && isInsert) {
			if (productId === 1) {
				eventInfo.totalMarketSize = bmLiveCount;
			} else {
				eventInfo.totalMarketSize = bmLcooCount;
			}
			// 如果marketsize不是大于0的也不显示
			if (!(eventInfo.totalMarketSize > 0)) {
				return;
			}
			Object.assign(eventInfo, {
				categoryId,
				tournamentId: topicInfo.tournamentId,
				eventId
			});
			Vue.set(events, eventId, eventInfo);
			const time = dateFormat.format(eventInfo.estimateStartTime, 'DD/MM dddd') || '';
			if (time && !Array.isArray(eventOrder)) {
				if (!eventOrder[time]) {
					Vue.set(eventOrder, time, []);
				}
				eventOrder[time].push(eventId);
			}
		}
	}
}

/**
 * 从 message 解析 product status
 * @param  {String} message 一般为接口返回的message，格式为 '0#0'。
 *                          '#' 号前代表 preMatch, 后者代表 live。
 *                          若值为空，则 productStatus 设为1，不可投注。
 * @param  {String} type    获取类型, 有3个值：live, preMatch, all(表示两个值都要判断)
 * @return {Number}         product status: 1表示不能投注 0表示可以投注
 */
function getProductStatus(message = '', type = '') {
	// 1表示不能投注 0表示可以投注，默认不能投注
	let productStatus = 1;

	if (message && typeof message === 'string') {
		const statusArr = message.split('#');

		if (statusArr.length === 2) {
			switch (type) {
			case 'live':
				productStatus = +statusArr[1];
				break;
			case 'preMatch':
				productStatus = +statusArr[0];
				break;
			// 只要有 1 就为 product down, 不能投注
			case 'all':
				productStatus = +statusArr[0] || +statusArr[1];
				break;
			default:
				// no default
			}
		}
	}

	return productStatus;
}

/**
 * 更新目标 leagues，适用于动态加载某个联赛下面的数据
 * @param  {Object} leagues 目标leagues(map类型)，结构为 { map, tournamentOrder }
 * @param  {Array}  list    待更新 leagues 列表数据
 * @return {[type]}         null, 直接改变 leagues 的值
 */
function updateLeagues(leagues = {}, list = []) {
	let map = leagues.map;
	let tournamentOrder = leagues.tournamentOrder;
	// 如果数据是空就设置数据
	if (!map) {
		map = {};
		tournamentOrder = [];
		Vue.set(leagues, 'map', map);
		Vue.set(leagues, 'tournamentOrder', tournamentOrder);
	}

	list.forEach(data => {
		// 转换下面的events数据
		if (data.events) {
			const res = convertEventsToMap(data.events);
			data.events = res.map;
			data.eventOrder = res.order;
		}
		if (data.id) {
			if (!map[data.id]) {
				// 数据更新
				Vue.set(map, data.id, data);
				// order更新
				tournamentOrder.push(data.id);
			} else {
				// 已经存在这个数据，只需要更新数据即可
				Object.assign(map[data.id], data);
			}
		}
	});
}

// 删除目标联赛下的某一个 tournament
function deleteLeague(target, tournamentId) {
	delete target.map[tournamentId];
	const { tournamentOrder } = target;
	const index = tournamentOrder.findIndex(x => x === tournamentId);
	if (index > -1) {
		tournamentOrder.splice(index, 1);
	}
}

export {
	updateEventByEvt,
	getProductStatus,
	updateLeagues,
	deleteLeague
};
