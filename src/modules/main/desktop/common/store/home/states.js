import {
	sportMarketIds,
	liveMarketIds,
} from 'config/sportsMarket.js';
import { clearBdInfo } from './commonFun';

const state = {

	/* 获取首页配置 */
	// Popular List
	popularList: [],

	// // Main banner
	// mainBanner: [],

	// // Second banner
	// secondBanner: {},

	/* 获取 important match 列表 */
	sport: {},
	/* 获取 live match 列表 */
	live: {},
	// 当前支持的market
	sportMarketIds,
	liveMarketIds,
	// product status
	liveProductStatus: 0,
	sportProductStatus: 0,
	adIds: ['bottomBanner', 'mainBanner', 'secondBanner', 'popularList', 'alertBanner'],
	loginAdIds: ['mainDepositPop'],
	promotionAd: {},
	adLoading: false,
	promotions: clearBdInfo(),
};

export default state;
