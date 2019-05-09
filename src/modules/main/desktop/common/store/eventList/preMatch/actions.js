import { pushTopic } from 'components/eventList/util';
import detailPush from 'push/betPush';
import { FETCH_SPORTS_LIST,
		FETCH_IMPORT_MATCH,
		UPDATE_TOURNAMENT,
		UPDATE_EVENT,
		UPDATE_OUTCOME,
		UPDATE_MARKET,
		DEL_TOURNAMENT,
		SPORT_LOADING,
		RESET_SPORT_LIST,
		TOGGLE_SHOW_PAGE,
		TOGGLE_H2H_STATUS,
		UPDATE_PRODUCT_STATUS
	} from './mutationTypes';
import '../../../../mockData/eventList/eventList?debug';

const mt = [
	function eventListener (commit, data) {
		data = JSON.parse(data);
		commit(UPDATE_EVENT, data);
	},
	function marketListener (commit, data) {
		// console.log('datamarket', data);
		data = JSON.parse(data);
		commit(UPDATE_MARKET, data);
	},
	function oddsListener (commit, data) {
		// console.log('data odds', data);
		data = JSON.parse(data);
		commit(UPDATE_OUTCOME, data);
	}];

const fetchEvt = function (params, commit) {
	return fetch('/factsCenter/pcEvents', {
		body: params,
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		method: 'POST'
	})
	.then(res => res.json())
	.then(data => {
		if (data.bizCode === 10000) {
			if (data.message) {
				let productStatus = data.message.split('#');
				if (productStatus.length === 2) {
					productStatus = +productStatus[0];
					// 1表示不能投注 0表示可以投注
					if (productStatus === 1 || productStatus === 0) {
						commit(UPDATE_PRODUCT_STATUS, productStatus);
					}
				}
			}
			const d = data.data || [];
			return d;
		}
		return Promise.reject(data.message);
	});
};

// 取消所有
const unsubs = function (tournamentMap, dispatch) {
	for (const tournamentId in tournamentMap) { // eslint-disable-line
		const tournament = tournamentMap[tournamentId] || {};
		const events = tournament.events;
		dispatch('unsub', events);
	}
};

// 绑定所有
const subs = function (tournamentMap, dispatch) {
	for (const tournamentId in tournamentMap) { // eslint-disable-line
		const tournament = tournamentMap[tournamentId] || {};
		const events = tournament.events;
		dispatch('sub', events);
	}
};

export default {
	/** 获取比赛列表
	 主要是根据是选择的联赛去获取比赛
		[{
			"sportId":"sr:sport:2",
			"marketId":"1",
			"categoryId":["cate1","cate2"],
			"tournamentId":[["a","b"],["c"]]
		},{
			"sportId":"sr:sport:2",
			"marketId":"1",
			"categoryId":["cate1","cate2"],
			"tournamentId":[["a","b"],["c"]],
		}
		]
	*/
	fetchSports ({ commit, state, dispatch }, params) {
		// 不显示分页
		commit(TOGGLE_SHOW_PAGE, false);
		commit(SPORT_LOADING, true);
		return fetchEvt(params, commit)
		.then(data => commit(FETCH_SPORTS_LIST, data))
		.then(data => {
			if (state.sport && state.sport.map) {
				subs(state.sport.map, dispatch);
			}
			commit(SPORT_LOADING, false);
			return data;
		})
		.catch(e => commit(SPORT_LOADING, -1));
	},
	// 更新某个联赛下的数据，每次选择联赛调用这个接口
	fetchTournament ({ commit, state, dispatch }, params) {
		return fetchEvt(params, commit)
		.then(data => {
			// 一次更新一个tournament，这里的长度应该是1，通常应该不存在多个的情况
			if (data.length) {
				data.forEach(d => {
					commit(UPDATE_TOURNAMENT, d);
					if (d.events) {
						const events = d.events;
						dispatch('sub', events);
					}
				});
			}
			return data;
		});
	},
	delTournament ({ commit, state, dispatch }, tournamentId) {
		const sport = state.sport;
		if (sport.map && sport.map[tournamentId]) {
			// 取消订阅
			dispatch('unsub', sport.map[tournamentId].events);
			commit(DEL_TOURNAMENT, tournamentId);
		}
	},
	/**
	 *  sportId		int	是
	 *	marketId	默认玩法，可有多个，用逗号隔开	string	是
	 *	timeline	结束时间，double，多少小时候结束	int	是
	 *	pageSize	int	是
	 *	pageNum		int	是
	 *	startTimeline	开始时间，double，多少小时候后开始		否
	 *	option  1表示 每个联赛只返回10场比赛并且有view all
	 * 获取比赛 按时间维度分析，主要是 upcomingEvent和today games 和defaultGame都走这个接口，这个时候数据是有分页的
	 */
	fetchImportMatch({ commit, state, dispatch }, params) {
		commit(SPORT_LOADING, true);
		return fetch('/factsCenter/pcUpcomingEvents', { body: params })
		.then(res => res.json())
		.then(data => {
			if (data.bizCode === 10000) {
				const d = data.data || [];
				if (data.message) {
					let productStatus = data.message.split('#');
					if (productStatus.length === 2) {
						productStatus = +productStatus[0];
						// 1表示不能投注 0表示可以投注
						if (productStatus === 1 || productStatus === 0) {
							commit(UPDATE_PRODUCT_STATUS, productStatus);
						}
					}
				}
				return d;
			}
			return Promise.reject(data.message);
		})
		.then(data => commit(FETCH_IMPORT_MATCH, data))
		.then(data => {
			// 如果页数大于1页就显示分页
			commit(TOGGLE_SHOW_PAGE, state.totalNum > state.pageSize);
			if (state.sport && state.sport.map) {
				subs(state.sport.map, dispatch);
			}
			commit(SPORT_LOADING, false);
			return data;
		})
		.catch(e => commit(SPORT_LOADING, -1));
	},
	resetSportList ({ commit, state, dispatch }) {
		// 每次获取取消订阅
		if (state.sport && state.sport.map) {
			unsubs(state.sport.map, dispatch);
		}
		commit(RESET_SPORT_LIST);
	},
	sub ({ commit, state }, events) {
		if (events) {
			for (const key in events) { // eslint-disable-line
				const event = events[key];
				// 订阅事件 1表示event 2表示market status 3表示market odds
				mt.forEach((current, index) => {
					pushTopic({
						sportId: event.sportId,
						productId: 3,
						categoryId: event.categoryId,
						tournamentId: event.tournamentId,
						eventId: event.eventId
					}, index + 1, data => current(commit, data));
				});
			}
		}
	},
	unsub ({ commit, state }, events) {
		if (events) {
			for (const key in events) { // eslint-disable-line
				const event = events[key];
				// 订阅事件 1表示event 2表示market status 3表示market odds
				mt.forEach((current, index) => {
					pushTopic({
						sportId: event.sportId,
						productId: 3,
						categoryId: event.categoryId,
						tournamentId: event.tournamentId,
						eventId: event.eventId
					}, index + 1, undefined, false);
				});
			}
		}
	},
	toggleH2hStatus ({ commit }, eventId) {
		commit(TOGGLE_H2H_STATUS, eventId);
	},
	subProductStatus({ commit, state }) {
		detailPush.sub({
			topic: 'product^3^status',
			pushType: 'GROUP',
			listener: data => {
				if (typeof data === 'string') {
					data = JSON.parse(data);
					if (data && data.length) {
						const code = +data[0];
						if (code === 0 || code === 1) {
							commit(UPDATE_PRODUCT_STATUS, code);
						}
					}
				}
			}
		});
	},
	unSubProductStatus ({ commit, state }) {
		detailPush.unsub({
			topic: 'product^3^status',
			pushType: 'GROUP'
		});
	},
};
