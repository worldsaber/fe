import { sportListUpperCase } from 'config/sportsType';
import { liveMarketIds } from 'config/sportsMarket.js';
// state取默认值
export default {
	// sport 模块整个loading -- 暂时无用
	sportLoading: true,
	// 切换赛事loading
	// 赛事数据
	sport: {},
	// 当前每个运动支持的market
	marketIds: liveMarketIds,
	// 所有的运动类型写死
	sportList: sportListUpperCase.map(cur => ({
		...cur,
		id: 'sr:sport:' + cur.id
	})),
	currentSportId: 'sr:sport:1',
	// 标记整个比赛是否可以投注
	productStatus: 0
};
