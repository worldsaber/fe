
import { showType } from './marketConst';
/**
 * 根据marketId和sportId获取market的显示方式
 * type从../marketConst的js中能够看到
 * @param {*} sportyId 运动类型的id
 * @param {*} marketId  marketId，不包含speciefier
 */
export function getMarketType(sportyId, marketId) {
		// 如果在这个type里面
	const type = showType[sportyId];
		// &符号链接的speciefier的market
	if (type) {
		const keys = Object.keys(type);
		for (const key of keys) {
			if (type[key] && type[key].includes(+marketId)) {
				return key;
			}
		}
	}
	// 正常的market
	return 'normalMarket';
}
// 获取overunder组合的market的数据
function getOverUnderSpeciefierComboMarketContentData(market, speciefierIndex) {
	// 总共三列
	// title的显示
	const title = ['', 'Over', 'Under'];
	const content = speciefierIndex.reduce((all, index) => {
		const cur = market[index];
		if (cur && cur.outcomeOrder) {
			const specifier = cur.specifier || '';
					// 12, 13是overUnder的outcome的id
			const res = [specifier.split('=')[1] || '', cur.outcomes[12], cur.outcomes[13]];
					// 数组下挂当前的market是哪个
			res.market = cur;
			all.push(res);
		}
		return all;
	}, []);
	return {
		title,
		content
	};
}
function getPlayerSpeciefierComboMarketContentData(market) {
	const id = +market[0].id;
	const title = [];
	// 总共4列
	// title显示- title只能写死未了防止循环出现多的列
	if (id === 770) {
		title.push('1+', '2+');
	} else if (id === 775) {
		title.push('1+', '2+', '3+');
	}
	// 先将market数组切割成可以投注和不可以投注的部分
	const activeMarket = [];
	const disableMarket = [];
	let sortMarkt = [];
	market.forEach(cur => {
		const arrOutComes = Object.values(cur.outcomes);
		for (const one of arrOutComes) {
			if (!one.desc) {
				return;
			}
			// 后台已经有这个字段了
			if (!one.playerScore || !one.playerName) {
				const matches = one.desc.match(/(.+)(\d+\+)$/) || [];
				one.playerName = matches[1].trim();
				one.playerScore = matches[2].trim();
			}
			// 这2个关键字段计算失败-直接不显示了
			if (!one.playerScore || !one.playerName) {
				return;
			}
		}
		// 覆盖outcomes按照player做键去遍历
		const scoreOutcomes = arrOutComes.reduce((res, cur) => {
			res[cur.playerScore] = cur;
			return res;
		}, {});
		// 看第一列是否是可以投注，区分成2组数据
		const isActive = scoreOutcomes[title[0]].isActive;
		// outcome可以投注, 不修改原数组
		if (isActive === 1 && cur.status === 0) {
			activeMarket.push({
				...cur,
				scoreOutcomes
			});
		} else {
			disableMarket.push({
				...cur,
				scoreOutcomes,
			});
		}
	});
	// 可投注market按照赔率排序
	activeMarket.sort((a, b) => {
		const aS = +a.scoreOutcomes[title[0]].odds;
		const bS = +b.scoreOutcomes[title[0]].odds;
		const diff = aS - bS;
		if (diff === 0) {
			const playa = a.scoreOutcomes[title[0]].playerName;
			const playb = b.scoreOutcomes[title[0]].playerName;
			return playa && playb ? playa.localeCompare(playb) : 0;
		}
		return diff;
	});
	// 不可投注market按照自然排序排
	disableMarket.sort((a, b) => {
		const aS = a.scoreOutcomes[title[0]].playerName;
		const bS = b.scoreOutcomes[title[0]].playerName;
		return aS && bS ? aS.localeCompare(bS) : 0;
	});
	sortMarkt = activeMarket.concat(disableMarket);

	const content = sortMarkt.reduce((all, cur) => {
		if (cur && cur.outcomeOrder) {
			// cloum的title只能取第一列的名称吧
			const cloumTitle = cur.scoreOutcomes[title[0]].playerName;
			const res = [cloumTitle].concat(title.map(one => cur.scoreOutcomes[one] || null));
			// 数组下挂当前的market是哪个
			res.market = cur;
			all.push(res);
		}
		return all;
	}, []);
	title.unshift('');
	return {
		title,
		content
	};
}

/**
 * 处理多个market组合成一个market的数据关系
 */
export function getSpeciefierComboMarketContentData (market, speciefierIndex) {
	const id = +market[0].id;
	// over/under显示的title
	if (id === 18) {
		return getOverUnderSpeciefierComboMarketContentData(market, speciefierIndex);
	} else if (id === 775 || id === 770) {
		try {
			return getPlayerSpeciefierComboMarketContentData(market);
		} catch (e) {
			console.error(e);
			return {
				title: [],
				content: []
			};
		}
	}
}

export default getMarketType;
