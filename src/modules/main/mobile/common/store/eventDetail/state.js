import { LS } from 'storage';

const priorityMarketMap = (() => {
	const priorityKeys = LS.get('priorityMarketKeys');
	return priorityKeys ? JSON.parse(priorityKeys) : {};
})();
// productId在market信息中有
export default {
	// market分类
	marketGroup: [],
	// 整个比赛的数据
	event: {},
	// 当前选中的markeGroup {name: val, id: val}
	currentMarketGroup: null,
	// 当前的eventId
	currentEventId: null,
	// 当前的sportId
	currentSportId: null,
	// 置顶比赛列表用sportId作为键，值是置顶的marketId
	priorityMarketMap,
	// 比赛缩略图
	liveThumbnailMatch: [],
	// Live Stream 显示/隐藏
	liveChannel: false,
	// 直播流地址
	liveChannelUrl: null,
	// favor tab 包含的marketIds
	favorMarketIds: [],
};
