import detailPush from 'push/betPush';
import dateFormat from 'kernel/js/dateFormat';
import Vue from 'vue';
import { noop, isEmptyObject } from 'utils';
/**
 * 将events转换成map，并且带order索引
 * @param {*} data  原始数据
 * 原始数据格式是 events数组 如
 * [{
 * 	eventId,
 * 	gameId
 *  score
 *  sport
 *  ...
 * 	markets: [
 * 		id
 * 		name,
 * 		outComes: []
 * 	]
 * }]
 * @param {*} result  转化后的数据
 * 转化后的数据变成map
 * {
 * 	event排序
 *  eventOrder会按照时间排序
 * 	eventOrder: {
 * 		date: [ids],
 * 		date1: [ids]
 * 	}
 * 	events: {
 *	 	eventId: {
 *	 		eventId: null,
 *	 		gameId: null,
 *	 		.....
 *			markets请自己排序
 *          带specifier的market会变成一个数组
 *	 		markets:  {
 *	 			marketId: {
 *	 				name: null,
 *	 				id: null,
 *	 				// outcome排序
 *	 				outcomeOrder: [...
 *	 				outcomes: {
 *	 				}
 *	 			}
 *	 		}
 *	 	}
 *    }
 * }
 */
function convertEventsToMap (data = [], result = {}) {
	result.order = result.order || {};
	result.map = result.map || {};
	const { order, map } = result;
	data.forEach((current, index) => {
		const sport = current.sport;
		delete current.sport;
		// 拍平sport字段
		current.sportId = sport.id;
		current.sportName = sport.name;
		current.categoryId = sport.category.id;
		current.categoryName = sport.category.name;
		current.tournamentName = sport.category.tournament.name;
		current.tournamentId = sport.category.tournament.id;
		let dateKey = ' ';
		if (current.estimateStartTime) {
			current.hourMinute = dateFormat.format(current.estimateStartTime, 'HH:mm') || '';
			// MM/DD dddd
			dateKey = dateFormat.format(current.estimateStartTime, 'DD/MM dddd') || ' ';
		}
		map[current.eventId] = current;
		if (!order[dateKey]) {
			order[dateKey] = [];
		}
		order[dateKey].push(current.eventId);
		if (current.markets) {
			const res = convertMarkets(current.markets);
			current.markets = res.markets;
		}
	});
	return result;
}

// 将一场比赛转换成map - 详情页面使用
/*
	*
	*
	*	eventId: {
	*	 		eventId: null,
	*	 		gameId: null,
	*			sportName: null,
	*			sportId: null,
	*			categoryId: null,
	*			categoryName:null,
	*			hourMinute: null,
	*			tournamentName: null,
	*			tournamentId:null,
	*			estimateStartTime:null,
	*			awayTeamName: null,
	*			gameId: null,
	*			homeTeamName: null
	*			markets请自己排序
	*			带specifier的market可能是一个组合的market
	*           组合market按照&拆解desc，其中第一个值表示行，第二个值表示列 比如 1x2 & both teams to score  both teams to score是列，一般是2列 多行
	* 			带specifier的market，则会变成数组
	*	 		markets:  {
	*	 			marketId: {
	*	 				name: null,
	*	 				id: null,
	*	 				// outcome排序
	*	 				outcomeOrder: [...
	*	 				outcomes: {
	*	 				}
	*	 			}
	*	 		}
	*	 	}
**/
function converEventToMap (data = {}, result = {}) {
	const sport = data.sport;
	delete data.sport;
	// 拍平sport字段
	data.sportId = sport.id;
	data.sportName = sport.name;
	data.categoryId = sport.category.id;
	data.categoryName = sport.category.name;
	data.tournamentName = sport.category.tournament.name;
	data.tournamentId = sport.category.tournament.id;
	if (data.estimateStartTime) {
		data.hourMinute = dateFormat.format(data.estimateStartTime, 'hh:mm') || '';
		data.monthDate = dateFormat.format(data.estimateStartTime, 'DD/MM dddd') || '';
	}
	if (data.markets) {
		const res = convertMarkets(data.markets);
		data.markets = res.markets;
	}
	return data;
}

// 转换market成map
function convertMarkets (data = []) {
	const result = { marketOrder: [], markets: {}};
	const { markets } = result;
	data.forEach((current, index) => {
		if (current.specifier) {
			if (markets[current.id]) {
				markets[current.id].push(current);
			} else {
				markets[current.id] = [current];
			}
		} else {
			markets[current.id] = current;
		}
		// marketorder没有用，因为market要么需要自己排序，要么只有一个market
		if (current.outcomes) {
			const res = convertOutcomes(current.outcomes);
			current.outcomes = res.outcomes;
			current.outcomeOrder = res.outcomeOrder;
		}
	});
	return result;
}
// 转换outcomes
function convertOutcomes (data = []) {
	const result = { outcomeOrder: [], outcomes: {}};
	const { outcomes, outcomeOrder } = result;
	data.forEach((current, index) => {
		outcomes[current.id] = current;
		outcomeOrder.push(current.id);
	});
	return result;
}

// 获取今天离12点有几个小时
function getTodayTime () {
	const current = new Date();
	const time = current.getTime();
	current.setDate(current.getDate() + 1);
	current.setHours(0);
	current.setMinutes(0);
	current.setMilliseconds(0);
	const t = current.getTime() - time;
	return (t / (1000 * 60 * 60)).toFixed(1);
}

/**
 * 根据当前获取的数据更新market 详情页面列表页面用
 * @param {*} event  convertEventsToMap, converEventToMap 转换后的event
 * @param {*} originMarket 原始market信息，是event上其中的一个market如果是specifier的market则是一个数组
 * @param {*} pushMarketInfo 推送过来的marketInfo
 * @param {*} topicInfo  推送解析后的topicInfo
 * @param {*} pushOutcomeInfos  推送的outComeInfo
 * @param {*} product 如果推送过来的消息中product和传递的不同则不更新
 * 推送解析后的参数可以看  clearPushData, clearTopicInfo的js
 */
function updateMarketOutCome (event, originMarket, pushMarketInfo, topicInfo, pushOutcomeInfos, product) {
	// console.log('---------');
	// console.log(event);
	// console.log(originMarket);
	// console.log(pushMarketInfo);
	// console.log(pushOutcomeInfos);
	// console.log(topicInfo);
	// console.log('---------');
	const marketId = topicInfo.marketId;
	if (!marketId) {
		return;
	}
	let specifier = topicInfo.marketSpecifiers;
	if (specifier) {
		// topic中不能出现 |所以specifier多个的情况用&连接，现在在改回去
		specifier = specifier.split('&');
		specifier = specifier.join('|');
	}
	// 新的market
	let market = { id: marketId };
	if (specifier) {
		market.specifier = specifier;
	}
	let orgin = originMarket;
	if (orgin && orgin.length && specifier) {
		orgin = orgin.find(cur => cur.id === marketId && cur.specifier === specifier);
	}
	const oldTime = orgin ? +orgin.pushTime || 0 : 0;
	// 原始market不存在
	if (!orgin) {
		market = {
			...market,
			...pushMarketInfo
		};
		if (!event.markets) {
			Vue.set(event, 'markets', {});
		}
		if (!event.markets[marketId]) {
			if (specifier) {
				Vue.set(event.markets, marketId, []);
			} else {
				Vue.set(event.markets, marketId, {});
			}
		}
		if (specifier) {
			const i = event.markets[marketId].findIndex(cur => cur.specifier === specifier);
			if (i > -1) {
				event.markets[marketId].splice(1, i, market);
			} else {
				event.markets[marketId].push(market);
			}
		} else {
			Vue.set(event.markets, marketId, market);
		}
	} else if (oldTime < +pushMarketInfo.pushTime) {
		Object.assign(orgin, pushMarketInfo);
	}
	// 将market变量更新到最新
	if (orgin) {
		market = orgin;
	}
	if (pushOutcomeInfos && (oldTime < +pushMarketInfo.pushTime)) {
		let outcomes = market.outcomes;
		let outcomeOrder = market.outcomeOrder;
		if (!outcomes) {
			Vue.set(market, 'outcomes', {});
			Vue.set(market, 'outcomeOrder', []);
			outcomes = market.outcomes;
			outcomeOrder = market.outcomeOrder;
		}
		for (const id in pushOutcomeInfos) { // eslint-disable-line
			pushOutcomeInfos[id].id = id;
			if (outcomes[id]) {
				Object.assign(outcomes[id], pushOutcomeInfos[id]);
			} else {
				Vue.set(outcomes, id, pushOutcomeInfos[id]);
				outcomeOrder.push(id);
			}
		}
	}
}

/**
 * 更像market status
 * @param {*} markets {
 * 	id: market,
 * 	id: [market] 带specifiers
 * }
 */
function updateMarketStatus (markets, status) {
	if (status !== 1 && status !== 2) {
		return;
	}
	if (!isEmptyObject(markets)) {
		for (const key in markets) {
			if (Object.prototype.hasOwnProperty.call(markets, key)) {
				const m = markets[key];
				if (Array.isArray(m)) {
					m.forEach(market => {
						market.status = status;
					});
				} else {
					m.status = status;
				}
			}
		}
	}
}

/**
 * 整个event信息-- 列表页面用
 * @param {Object} map
 * {
 * 	tournamentId: {
 * 		tournamentName
 * 		....
 * 		events: {
 * 		},
 * 		eventOrder:{
 * 			日期: [eventId]
 * 		}
 * 	}
 * }
 * @param {Array} tournamentOrder 一个数组标记tournamentId的顺序
 * @param {Object} eventInfo 通过clearPushData中的event得到的值
 * @param {Object} topicInfo 通过clearTopicInfo得到得到的值
 * @param {Number} productId 产品id 1(直播),3(赛前)
 * @param {Boolean} isInsert 是否则新比赛来了之后删除
 * @param {Boolean} isDel 是否删除一场比赛
 */
function updateEvent (map, tournamentOrder, eventInfo, topicInfo, productId, isInsert = true, isDel = true) {
	if (!eventInfo) {
		return;
	}
	// 只有新增的时候更新 totalMarketSize
	const bmLcooCount = eventInfo.bmLcooCount;
	const bmLiveCount = eventInfo.bmLiveCount;
	const tournamentId = topicInfo.tournamentId;
	const eventId = topicInfo.eventId;
	const categoryId = `sr:category:${topicInfo.categoryId}`;
	delete eventInfo.bmLcooCount;
	delete eventInfo.bmLiveCount;
	let event;
	if (map) {
		const tournament = map[tournamentId];
		if (tournament) {
			const events = map[tournamentId].events;
			if (events && events[eventId]) {
				event = events[eventId];
			}
		}
		let status;
		// 直播
		// 0:NotStarted; 1:Live; 2. suspended; 3:Ended; 4:Finished("closed");
		// 5:Cancelled; 6:Abandoned; 7 Delayed; 8:Unknown
		if (productId === 1) {
			status = eventInfo.status === 1 || eventInfo.status === 2 || eventInfo.status === 8;
		} else {
			status = eventInfo.status !== 1 && eventInfo.status !== 3 && eventInfo.status !== 4;
		}
		if (event) {
			// pushTime直接合并上去，不受监控
			if ((event.pushTime && +event.pushTime < +eventInfo.pushTime) || !event.pushTime) {
				// 比赛不可以投注删除
				if (!status && isDel) {
					Vue.delete(map[tournamentId].events, eventId);
					const order = map[tournamentId].eventOrder;
					for (const key in order) { // eslint-disable-line
						const one = order[key];
						const index = one.findIndex(cur => cur === eventId);
						if (index > -1) {
							one.splice(index, 1);
							if (one.length === 0) {
								Vue.delete(order, key);
							}
							// 如果这个联赛下没有比赛了
							if (isEmptyObject(map[tournamentId].events)) {
								Vue.delete(map, tournamentId);
								if (tournamentOrder && tournamentOrder.length) {
									const i = tournamentOrder.findIndex(cur => cur === tournamentId);
									if (i > -1) {
										tournamentOrder.splice(i, 1);
									}
								}
							}
							break;
						}
					}
				} else {
					// 更新比赛信息
					const e = Object.assign(event, eventInfo);
					const betStatus = e.betStatus;
					if (betStatus && (betStatus === 1 || betStatus === 2)) {
						updateMarketStatus(e.markets, betStatus);
					}
					Vue.set(map[tournamentId].events, eventId, e);
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
			// 只有需要插入的时候才有可能插入tournament和events
			let tournament = map[tournamentId];
			if (!tournament) {
				tournament = {
					categoryId,
					id: topicInfo.tournamentId,
					sportId: `sr:sport:${topicInfo.sportId}`,
					categoryName: eventInfo.categoryName,
					name: eventInfo.tournamentName,
					sportName: eventInfo.sportName
				};
				tournamentOrder.push(tournamentId);
				Vue.set(map, tournamentId, tournament);
			}
			let events = map[tournamentId].events;
			if (!events) {
				events = {};
				Vue.set(map[tournamentId], 'events', events);
				Vue.set(map[tournamentId], 'eventOrder', {});
			}
			Object.assign(eventInfo, {
				categoryId,
				tournamentId: topicInfo.tournamentId,
				eventId
			});
			Vue.set(map[tournamentId].events, eventId, eventInfo);
			// 更新order
			let order = map[tournamentId].eventOrder;
			if (!order) {
				order = {};
				Vue.set(map[tournamentId], 'eventOrder', order);
			}
			const time = dateFormat.format(eventInfo.estimateStartTime, 'DD/MM dddd') || '';
			if (time) {
				if (!order[time]) {
					Vue.set(order, time, []);
				}
				order[time].push(eventId);
			}
		}
	}
}

const numReg = /\D/g;
/**
 * @param {Object} topicObj 拼接topic的一个对象
 * {
 * 	sportId: null, ---必须给这个参数
 * 	categoryId: null,
 *  tournamentId: null,
 * 	eventId: null,
 *  productId: null, market消息和odds消息需要，也可以不传递
 * 	marketIds: null,  -- 订阅market消息的时候有，如果没有则是通配符
 * }
 * 该参数中的字段如果没有就是通配符
 * @param {Number} type
 *  type: 1, 2, 3
 *  1表示eventStatus
 *  2表示 marketStatus
 *  3表示 marketOdds
 * @param {function} callback
 * @param {Boolean} isSub true表示sub，false表示 unsub
 */
function pushTopic (topicObj, type, callback, isSub = true) {
	// 如果是unsublistener不传递表示订阅这几个主题的都取消
	let listener = callback;
	if (isSub) {
		listener = listener || noop;
	}
	const exec = detailPush[isSub ? 'sub' : 'unsub'].bind(detailPush);
	// #{sportId}^#{categoryId}^#{tournamentId}^#{eventId}^status
	// #{sportId}^#{categoryId}^#{tournamentId}^#{eventId}^#{marketId}^odds
	// #{sportId}^#{categoryId}^#{tournamentId}^#{eventId}^#{productId}^#{marketId}^#{marketSpecifiers}^odds
	// #{sportId}^#{categoryId}^#{tournamentId}^#{eventId}^#{marketId}^status
	// #{sportId}^#{categoryId}^#{tournamentId}^#{eventId}^#{productId}^#{marketId}^#{marketSpecifiers}^status
	if (!topicObj || !type) {
		return;
	}
	if (type !== 1 && type !== 2 && type !== 3) {
		return;
	}
	if (!topicObj.sportId) {
		return;
	}
	// 去掉sr:sport
	const sportId = topicObj.sportId.replace(numReg, '');
	let categoryId = topicObj.categoryId;
	if (categoryId) {
		categoryId = topicObj.categoryId.replace(numReg, '');
	}
	let topic = `${sportId}^${categoryId || '~'}^${topicObj.tournamentId || '~'}`;
	topic += `^${topicObj.eventId || '~'}`;
	if (type === 1) {
		topic += '^status';
		// console.log(topic, isSub);
		return exec({
			topic,
			pushType: 'GROUP',
			listener
		});
	}
	topic += `^${topicObj.productId || '~'}`;
	if (topicObj.marketIds && topicObj.marketIds.length) {
		// 多个market
		topicObj.marketIds.forEach(marketId => {
			let t = topic + `^${marketId}`;
			t += '^~';
			// marketSpecifiers 全定
			if (type === 2) {
				t += '^status';
			} else if (type === 3) {
				t += '^odds';
			}
			// console.log(t, isSub);
			return exec({
				topic: t,
				pushType: 'GROUP',
				listener
			});
		});
	} else {
		// market 和specifer都是通配
		topic += '^~^~';
		if (type === 2) {
			topic += '^status';
		} else if (type === 3) {
			topic += '^odds';
		}
		// console.log(topic, isSub);
		return exec({
			topic,
			pushType: 'GROUP',
			listener
		});
	}
}
export {
	convertEventsToMap,
	convertMarkets,
	convertOutcomes,
	converEventToMap,
	getTodayTime,
	updateMarketOutCome,
	updateEvent,
	pushTopic,
	updateMarketStatus
};
