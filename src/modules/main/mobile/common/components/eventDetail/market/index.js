// 适配器
import Market from './market';
import ComboSpecifierMarket from './comboSpecifierMarket';
import { getMarketType } from '../js/commonFun';
import { comboSpecifierMarketType, defautlMarketType } from '../js/marketConst';

const marketConfig = defautlMarketType.reduce((res, cur) => {
	res[cur] = {
		...Market,
		name: cur
	};
	return res;
}, {});

const comboSpecifierMarketConfig = comboSpecifierMarketType.reduce((res, cur) => {
	res[cur] = {
		...ComboSpecifierMarket,
		name: cur
	};
	return res;
}, {});

export default {
	functional: true,
	render (h, context) {
		const { props: { market, sportId, speciefierIndex }} = context;
		// console.log(context);
		if (market) {
			// 带specifier的market去分解成多个market并且初始化
			if (market.length) {
				// 一组specifier的market，id都一样
				const showType = getMarketType(sportId, market[0].id);
				// console.log(showType, market[0].id);
				// 带specifier的复合式market和正常的market都是需要一个一个显示的
				if ((showType === 'comboMarket' || showType === 'normalMarket') && speciefierIndex && speciefierIndex.length) {
					const res = speciefierIndex.map(index => h(marketConfig[showType], {
						...context.data,
						attrs: {
							...context.data.attrs,
							market: market[index]
						},
						key: context.data.key + '?' + market[index].specifier
					}, context.children));
					return h('div', {
						attrs: {
							'class': 'specifier-market-group'
						}
					}, res);
				} else if (comboSpecifierMarketType.includes(showType)) {
					return h(comboSpecifierMarketConfig[showType], context.data, context.children);
				}
				return '';
			}
			// marekt = [];
			if (Array.isArray(market) && market.length === 0) {
				return '';
			}
			// 普通的market
			return h(marketConfig.normalMarket, context.data, context.children);
		}
		return '';
	}
};
