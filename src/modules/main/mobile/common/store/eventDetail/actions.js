import { pushTopic } from 'components/eventUtil/util';
import { loginPromise } from 'components/login/tools';

import { FETCH_MARKET_GROUP,
		FETCH_EVENT,
		FETCH_THUMBNAIL_MATCH,
		UPDATE_EVENT,
		UPDATE_OUTCOME,
		UPDATE_MARKET,
		SET_SPORT,
		FETCH_LIVE_CHANNEL,
	UPDATE_FAVORMARKETIDS,
	SPLICE_FAVORMARKETID,
	UNSHIFT_FAVORMARKETID,
	// UPDATE_FAVORLOADING,
} from './mutationTypes';
import '../../../mockData/eventDetail?debug';

const mt = [
	function eventListener (commit, data) {
		window.__debug__ && console.log('event', new Date(), data);
		data = JSON.parse(data);
		commit(UPDATE_EVENT, data);
	},
	function marketListener (commit, data) {
		window.__debug__ && console.info('market', new Date(), data);
		data = JSON.parse(data);
		commit(UPDATE_MARKET, data);
	},
	function oddsListener (commit, data) {
		window.__debug__ && console.info('odds', new Date(), data);
		data = JSON.parse(data);
		commit(UPDATE_OUTCOME, data);
	}
];
const getFavorMarketIds = function (sportId, productId) {
	return fetch('/patron/favoriteMarkets/marketIds',
		{
			body: {
				sportId,
				productId, // 或者从event.markets 中获取product
			}
		})
		.then(res => res.json())
		.then(res => {
			let favorMarkets = [];
			if (res.bizCode === 10000) {
				favorMarkets = (res.data || []).reverse();
			}
			return favorMarkets;
		}).catch(() => Promise.resolve());
};

export default {
	setSport ({ state, commit }, data) {
		commit(SET_SPORT, data);
	},
	// 获取比赛的event数据
	/**
	 * 获取全部的market，直接给 eventId即可
	 * params: {
	 *  eventId		    string	否
	 *	marketGroupId	多个用逗号隔开，如1，18	string	否
	 *	marketId		int	否
	 *	specifier		string	否
	 *	outcomeId
	 * }
	 */
	fetchEvent ({ state, commit }, params) {
		return fetch('/factsCenter/event', {
			body: params
		})
		.then(res => res.json())
		.then(data => {
			if (data.bizCode === 10000) {
				const d = data.data || [];
				commit(FETCH_EVENT, d);
				return d;
			}
			return Promise.reject(data.message);
		});
	},
	// 获取market分组
	fetchMarketGroup ({ state, commit }, sportId) {
		return fetch('/factsCenter/marketGroups', {
			body: {
				sportId
			}
		})
		.then(res => res.json())
		.then(data => {
			if (data.bizCode === 10000) {
				const d = data.data || [];
				commit(FETCH_MARKET_GROUP, d);
				return d;
			}
			return Promise.reject(data.message);
		});
	},
	/**
	 * 获取favorite marketIds
	 *  loginCallback 判断登录态，是否唤起登录组件
	 * */
	fetchFavorMarketIds({ commit }, { sportId, productId, hasLogin, }) {
		let pom = Promise.resolve();  // 不需要检查登录态，适合刚进入页面初始请求
		// 需要检验登录态；适合点击tab
		if (hasLogin) {
			pom = loginPromise();
		}
		return pom.then(() => {
			const p = getFavorMarketIds(sportId, productId)
				.then(marketIds => {
					commit(UPDATE_FAVORMARKETIDS, marketIds);
				});
			return p;
		});
	},
	toggleMarketFavor({ state, commit }, { status, sportId, productId, marketId, }) {
		return fetch('/patron/favoriteMarkets/sportMarketId', {
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			method: status ? 'DELETE' : 'POST', // status是现在的状态
			body: JSON.stringify({
				sportId,
				productId,
				marketId,
			})
		}).then(res => res.json())
		.then(res => {
			// 登录凭证过期
			if (res.login === false) {
				return Promise.reject({
					login: false
				});
			}
			// 更新 favorMarkets
			if (res.bizCode === 10000) {
				const index = state.favorMarketIds.findIndex(id => id === marketId);

				if (index > -1) {
					commit(SPLICE_FAVORMARKETID, index);
					// this.favorMarkets.splice(index, 1);
					return 'Cancellation Successful';
				}
				if (!status) {
					// this.favorMarkets.unshift(marketId);
					commit(UNSHIFT_FAVORMARKETID, marketId);
					return 'Added Successfully';
				}
			}
		});
	},
	/**
	 * 获取比赛的缩略图
	 * 目前只在live比赛中使用
	 * 只有直播类型的比赛的页面才会用
	 * @param params
	 *  {
	 *  	timeline (非必填)
	 * 		tournamentId (非必填)
	 * 		sportId (必填)
	 * 		categoryId
	 * 		productId 1 3(赛前)
	 *  }
	 */
	fetchThumbnailMatch ({ state, commit }, params) {
		return fetch('/factsCenter/commonThumbnailEvents', {
			body: params
		})
		.then(res => res.json())
		.then(data => {
			if (data.bizCode === 10000) {
				const d = data.data || [];
				commit(FETCH_THUMBNAIL_MATCH, d);
				return d;
			}
			return Promise.reject(data.message);
		});
	},
	// 订阅
	sub ({ state, commit }, params = {}) {
		const { productId, eventId, sportId, tournamentId, categoryId } = params;
		// 订阅事件 1表示event 2表示market status 3表示market odds
		mt.forEach((current, index) => {
			pushTopic({
				sportId,
				productId,
				eventId,
				tournamentId,
				categoryId
			}, index + 1, data => current(commit, data));
		});
	},
	// 取消订阅
	unsub({ state, commit }, params = {}) {
		const { productId, eventId, sportId, tournamentId, categoryId } = params;
		// 订阅事件 1表示event 2表示market status 3表示market odds
		mt.forEach((current, index) => {
			pushTopic({
				sportId,
				productId,
				eventId,
				tournamentId,
				categoryId
			}, index + 1, undefined, false);
		});
	},
	// 获取直播流地址
	fetchLiveChannel({ commit }, { eventId }) {
		return fetch(`/factsCenter/liveChannel/getUrl?eventId=${eventId}`)
		.then(res => res.json())
		.then(data => {
			if (data.bizCode === 10000 && data.data) {
				commit(FETCH_LIVE_CHANNEL, data.data);
				return data;
			}
			return Promise.reject('No live stream data.');
		})
		.catch();
	}
};
