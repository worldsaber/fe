import { objType } from 'utils';

export default {
	// 避免给event.markets 排序时，导致的数据变更，让groupOrder陷入循环
	orderEventMarkets(state) {
		const event = state.event;
		const markets = event.markets || {};
		const keys = Object.keys(markets);
		const result = {};
		// 表示一个market的正常的状态的status
		const rightMarketStatus = [0, 1];
		// 表示一个market的正常的状态
		const rightEventStatus = [0, 1, 2];

		if (!rightEventStatus.includes(event.status)) {
			return {};
		}

		keys.forEach(key => {
			let market = markets[key];

			if (Array.isArray(market)) {
				market = market.filter(mkt => rightMarketStatus.includes(mkt.status)); // 备份一下，不改变以前，产生新顺序的数组, 过滤有效market
				market.sort((a, b) => a.specifier.localeCompare(b.specifier));
				result[key] = market;
			}
			if (rightMarketStatus.includes(market.status)) {
				result[key] = market;
			}
		});
		return result;
	},
	// 获取所有分组的order
	groupOrder(state, getters) {
		const event = state.event;
		const markets = getters.orderEventMarkets;
		const marketGroupOrder = {};
		// 表示一个market的正常的状态的status
		const rightMarketStatus = [0, 1];
		// 表示一个market的正常的状态
		const rightEventStatus = [0, 1, 2];
		if (!rightEventStatus.includes(event.status)) {
			return marketGroupOrder;
		}
		if (markets) {
			const ids = Object.keys(markets);
			ids.sort((a, b) => +a - +b);
			for (const id of ids) {
				const market = markets[id];
				// 如果是speciefier的数组market- 同一组speciefier的market一定是在一个group内，否则会有问题
				if (objType(market) === 'array' && market.length) {
					// 导致event.market数据变化, 触发更新, groupOrder死循环，需要移动到外边
					// market.sort((a, b) => a.specifier.localeCompare(b.specifier));
					// 因为一个组的market都所以同一个group取第一个添加即可
					const mkt = market[0];
					// 有些market 没有分组，此时跳过; 没有分组，可能是后台配置没有跟上
					const group = mkt.group ? mkt.group.toLowerCase() : '_others';
					let groupOrder = marketGroupOrder[group];
					if (!groupOrder) {
						marketGroupOrder[group] = {};
						groupOrder = marketGroupOrder[group];
					}
					if (!groupOrder.speciefierOrder) {
						groupOrder.speciefierOrder = {};
					}
					if (!groupOrder.speciefierIndex) {
						groupOrder.speciefierIndex = {};
					}
					if (!groupOrder.order) {
						groupOrder.order = [];
					}
					// 此处没有判断状态，有展示 不能显示market的风险
					groupOrder.order.push(id);
					// 替换循环创建
					const marketFn = (current, index) => {
						if (current.id && current.outcomeOrder &&
							rightMarketStatus.includes(current.status)) {
							const speciefierOrder = groupOrder.speciefierOrder;
							const speciefierIndex = groupOrder.speciefierIndex;
							if (!speciefierOrder[id]) {
								speciefierOrder[id] = {};
							}
							if (!speciefierIndex[id]) {
								speciefierIndex[id] = [];
							}
							// 必须保证id+speciefier是唯一的否则这里后面的会覆盖前面的
							speciefierOrder[id][current.specifier] = index;
							// 保存过滤后的index
							speciefierIndex[id].push(index);
							// order
							// const d = id + '?' + current.specifier;
							// const order = groupOrder.order || [];
							// order.push(d);
							// groupOrder.order = order;
						}
					};
					market.forEach(marketFn);
				} else if (market.id && market.group && market.outcomeOrder &&
					rightMarketStatus.includes(market.status)) {
					// 这里加入market status的判断    market status 0: active, 1: suspened, 2: deactivated, 3: setted
					const group = market.group.toLowerCase();
					let groupOrder = marketGroupOrder[group];
					if (!groupOrder) {
						marketGroupOrder[group] = {};
						groupOrder = marketGroupOrder[group];
					}
					const order = groupOrder.order || [];
					order.push(market.id);
					groupOrder.order = order;
				}
			}
			// all
			marketGroupOrder.all = {
				order: ids,
			};
		}

		return marketGroupOrder;
	},
	// 获取market的排序, 指定分类下的
	marketOrder(state, getters) {
		// 更加currentGroup 判断
		const current = state.currentMarketGroup;
		const defaultOrder = {
			order: [],
			speciefierOrder: {},
			speciefierIndex: {}
		};

		if (!current) {
			return defaultOrder;
		}
		// my favorite tab
		if (current.id === 'myFavorite') {
			return getters.favorMarketOrder;
		}
		if (current.id === 'all') {
			return getters.allMarketOrder;
		}
		// market group
		const name = (current.name || '').toLowerCase();
		const mktOrder = getters.groupOrder[name];

		if (!mktOrder) {
			return defaultOrder;
		}
		return mktOrder;
	},
	// 单独拿出来，结构清晰一些，方便后面 对all 中的某些market 进行特殊排序
	allMarketOrder(state, getters) {
		const groupOrder = getters.groupOrder;
		const allOrder = groupOrder.all;
		if (!allOrder) {
			return {
				order: [],
				speciefierOrder: {},
				speciefierIndex: {},
			};
		}
		// 补足speciefier
		const keys = Object.keys(groupOrder);
		let speciefierOrder = {};
		let speciefierIndex = {};
		for (const key of keys) {
			if (key !== 'all') {
				const group = groupOrder[key];
				if (group.speciefierOrder) {
					speciefierOrder = { ...speciefierOrder, ...group.speciefierOrder };
				}
				if (group.speciefierIndex) {
					speciefierIndex = { ...speciefierIndex, ...group.speciefierIndex };
				}
			}
		}
		return {
			order: allOrder.order || [],
			speciefierOrder,
			speciefierIndex,
		};
	},
	favorMarketOrder(state, getters) {
		// 根据favor 的 markets 数组 过滤
		const event = state.event;
		const markets = getters.orderEventMarkets;
		const result = [];
		// 表示一个market的正常的状态的status
		const rightMarketStatus = [0, 1];
		// 表示一个market的正常的状态
		const rightEventStatus = [0, 1, 2];
		// 置顶的market
		// 用来标记要显示的makret
		const speciefierOrder = {};
		const speciefierIndex = {};
		if (!markets || !rightEventStatus.includes(event.status)) {
			return {
				order: [],
				speciefierOrder: {},
				speciefierIndex: {}
			};
		}
		const favorMarketIds = state.favorMarketIds;
		for (const marketId of favorMarketIds) {
			const market = markets[marketId];
			// 存在market
			if (market) {
				if (Array.isArray(market)) {
					// market.sort((a, b) => a.specifier.localeCompare(b.specifier));
					market.forEach((current, index) => {
						if (current.id && current.outcomeOrder && rightMarketStatus.includes(current.status)) {
							const id = current.id;
							if (!speciefierOrder[id]) {
								speciefierOrder[id] = {};
							}
							if (!speciefierIndex[id]) {
								speciefierIndex[id] = [];
							}
							// 必须保证id+speciefier是唯一的否则这里后面的会覆盖前面的
							speciefierOrder[id][current.specifier] = index;
							// 将所有可展示的index push到数组
							speciefierIndex[id].push(index);
							// const d = id + '?' + current.specifier;
							// result.push(d);
						}
					});
					result.push(marketId);
				} else if (market.id && market.outcomeOrder && rightMarketStatus.includes(market.status)) {
					result.push(market.id);
				}
			}
		}
		return {
			order: result,
			speciefierOrder,
			speciefierIndex
		};
	},
	// 从后台取到MarketGroup后，先去掉1 Min. Markets，然后判断event里的markets有没有1 Min. Markets，有就把它加到数组的第二个位置，没有就返回
	fixedMarketGroup(state, getters) {
		const marketGroup = [...state.marketGroup];
		const minKey = '1 Min. Markets';
		const index = marketGroup.findIndex(group => group.name === minKey);
		// 判断 marketGroup 存在 min. 并且 包含有market
		if (index > -1) {
			const minGroup = marketGroup.splice(index, 1);
			if (getters.groupOrder[minKey.toLowerCase()]) {
				marketGroup.splice(1, 0, minGroup[0]);
			}
		}
		marketGroup.unshift({
			id: 'all',
			name: 'All',
		});
		return marketGroup;
	}
};
