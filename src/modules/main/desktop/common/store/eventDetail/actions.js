import detailPush from 'push/betPush';
import * as mutationTypes from './mutationTypes';

import '../../../mockData/eventDetail/event?debug';

let eventTopic,
	marketTopic,
	oddsTopic,
	productTopic;

export default {
	/*
	get market group
	params: 为sportId（int型）
	 */
	fetchMarketGroup({
		commit,
		state
	}, params) {
		const sportId = state.currentSport ? state.currentSport : params ? `sr:sport:${params}` : '';

		// 取不到sportId直接返回，通过后续详情数据补全
		if (!sportId) {
			return;
		}

		return new Promise((resolve, reject) => {
			fetch('/factsCenter/marketGroups', {
				method: 'GET',
				body: {
					sportId
				}
			})
			.then(res => res.json())
			.then(res => {
				const code = res.bizCode;

				if (code === 10000) {
					const data = res.data;
					data.unshift({
						id: 'All',
						name: 'All'
					});
					commit(mutationTypes.UPDATE_MARKETGROUP_LIST, data);
					resolve(res || {});
				} else {
					reject(res);
				}
			})
			.catch(err => { // eslint-disable-line
				// reject(err);
			});
		});
	},
	/*
	update event detail
	params： eventID
	 */
	fetchEventDetail({
		commit,
		state,
		dispatch
	}) {
		const isDefault = !state.currentEvent,
			fetchOptions = state.currentEvent ? {
				type: 'GET',
				body: {
					eventId: state.currentEvent,
					productId: state.isLive ? 1 : 3
				}
			} : {
				type: 'GET'
			};

		// 设置loading状态
		commit(mutationTypes.UPDATEDETAILLOADING, true);

		// 重置错误标识
		commit(mutationTypes.UPDATELOADERROR, false);

		return new Promise((resolve, reject) => {
			fetch('/factsCenter/event', fetchOptions)
			.then(res => {
				// 重置loading
				setTimeout(() => {
					commit(mutationTypes.UPDATEDETAILLOADING, false);
				}, 600);

				return res.json();
			})
			.then(data => {
				const code = data.bizCode;

				if (code === 10000) {
					const orignData = Object.assign({}, data.data);

					const sport = orignData.sport || {},
						eventId = orignData.eventId || '',
						category = sport.category || {},
						tournament = category.tournament || {},
						tournamentId = tournament.id || '',
						productId = +orignData.status === 0 ? 3 : 1;

					commit(mutationTypes.GET_EVENT_DETAIL, orignData);

					let sportId = sport.id || '',
						categoryId = category.id || '';

					sportId = sportId && sportId.replace(/\D/g, '') || '';
					categoryId = categoryId && categoryId.replace(/\D/g, '') || '';

					// liveBetting中，默认赛事详情不知sportType，需要根据event的数据刷新marketGroup数据
					if (isDefault) {
						dispatch('fetchMarketGroup');
					}

					if (eventId !== '' && sportId !== '' && categoryId !== '' && tournamentId !== '') {
						const baseKey = `${sportId}^${categoryId}^${tournamentId}^${eventId}`;

						const tempEventTopic = `${baseKey}^status`;
						const tempMarketTopic = `${baseKey}^${productId}^~^~^status`;
						const tempOddsTopic = `${baseKey}^${productId}^~^~^odds`;
						const tempProductTopic = `product^${productId}^status`;

						if (tempOddsTopic !== oddsTopic) {
							// odds
							// #{sportId}^#{categoryId}^#{tournamentId}^#{eventId}^#{productId}^#{marketId}^#{marketSpecifiers}^odds
							oddsTopic = tempOddsTopic;
							detailPush.sub({
								topic: oddsTopic,
								pushType: 'GROUP',
								listener: pushData => {
									if (window.__pushDebugger__) {
										console.log(`${Date.now()}   ${eventId}---market odds----${pushData}`);
									}
									if (!window.__stopMarketStatus__) {
										commit(mutationTypes.UPDATE_OUTCOMEINFO, pushData);
									}
								}
							});
						}

						if (tempEventTopic !== eventTopic) {
							// event
							// #{sportId}^#{categoryId}^#{tournamentId}^#{eventId}^status
							eventTopic = tempEventTopic;
							detailPush.sub({
								topic: eventTopic,
								pushType: 'GROUP',
								listener: pushData => {
									if (window.__pushDebugger__) {
										console.log(`${Date.now()}   ${eventId}---event status----${pushData}`);
									}
									commit(mutationTypes.UPDATE_EVENTINFO, pushData);
								}
							});
						}

						if (tempMarketTopic !== marketTopic) {
							// market
							// #{sportId}^#{categoryId}^#{tournamentId}^#{eventId}^#{productId}^#{marketId}^#{marketSpecifiers}^status
							marketTopic = tempMarketTopic;
							detailPush.sub({
								topic: marketTopic,
								pushType: 'GROUP',
								listener: pushData => {
									if (window.__pushDebugger__) {
										console.log(`${Date.now()}   ${eventId}---market status----${pushData}`);
									}
									if (!window.__stopMarketStatus__) {
										commit(mutationTypes.UPDATE_MARKETINFO, pushData);
									}
								}
							});
						}

						if (tempProductTopic !== productTopic) {
							// product
							productTopic = tempProductTopic;
							detailPush.sub({
								topic: productTopic,
								pushType: 'GROUP',
								listener: pushData => {
									if (window.__pushDebugger__) {
										console.log(`${Date.now()}   ${eventId}---product status----${pushData}`);
									}

									commit(mutationTypes.UPDATEPRODUCTOFF, {
										status: pushData,
										isPush: true
									});
								}
							});
						}
					}

					const message = (data.message || '').split('#');
					if (message.length === 2 && (
						productId === 1 && +message[1] ||
						productId === 3 && +message[0]
					)) {
						commit(mutationTypes.UPDATEPRODUCTOFF, {
							status: true,
							isPush: false
						});
					} else {
						commit(mutationTypes.UPDATEPRODUCTOFF, {
							status: false,
							isPush: false
						});
					}

					resolve(orignData || {});
				} else {
					reject();
				}
			})
			.catch(() => {
				// 重置loading
				if (state.loading) {
					setTimeout(() => {
						commit(mutationTypes.UPDATEDETAILLOADING, false);
					}, 600);
				}

				// 设置错误标识
				!state.loadError && commit(mutationTypes.UPDATELOADERROR, true);
			});
		});
	},

	/*
	切换事件时取消之前的推送消息
	 */
	resetEventData({
		commit,
		state
	}, params) {
		if (marketTopic) {
			detailPush.unsub({
				topic: marketTopic,
				pushType: 'GROUP'
			});
			marketTopic = '';
		}

		if (eventTopic) {
			detailPush.unsub({
				topic: eventTopic,
				pushType: 'GROUP'
			});
			eventTopic = '';
		}

		if (oddsTopic) {
			detailPush.unsub({
				topic: oddsTopic,
				pushType: 'GROUP'
			});
			oddsTopic = '';
		}

		if (productTopic) {
			detailPush.unsub({
				topic: productTopic,
				pushType: 'GROUP'
			});
			productTopic = '';
		}

		// 重置数据
		commit(mutationTypes.RESET_DATA, params);
	},

	/*
	获取比赛数量（liveBetting中）
	params: sportId, product, timeLine, option(1)
	  */
	getEventCount({
		commit,
		state
	}, params) {
		return new Promise((resolve, reject) => {
			fetch('/factsCenter/sportList', {
				type: 'GET',
				body: params
			})
			.then(res => res.json())
			.then(data => {
				const code = data.bizCode,
					originData = data.data || [];
				if (code === 10000) {
					commit(mutationTypes.UPDATEEVENTCOUNT, originData);
					resolve(originData);
				}
			});
		});
	},

	// 获取直播流地址
	fetchLiveChannel({ commit }, { eventId }) {
		return fetch(`/factsCenter/liveChannel/getUrl?eventId=${eventId}`)
		.then(res => res.json())
		.then(data => {
			if (data.bizCode === 10000) {
				commit(mutationTypes.FETCH_LIVE_CHANNEL, data.data);
				return data.data;
			}
			return Promise.reject(data.message);
		})
		.catch();
	}
};
