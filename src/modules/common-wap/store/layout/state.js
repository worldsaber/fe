import { LS } from 'storage';

export default {
	// 显示左边
	showLeft: false,
	// 显示右边，isOpenBetslip用于从betslip进入充值成功后，点击done按钮跳转时打开betslip弹窗，在点击done时种下，打开弹窗后删除。
	showRight: LS.get('isOpenBetslip') === 'true',
	// 显示底部
	showBottom: true,
	// 加载状态
	isLoading: true,
	// 滚动信息
	scrollPayload: {},
	//  重置 scrollTop = 0
	resetScroll: { top: 0 },
	// 显示Share浮窗
	showShare: false,
	// 分享配置
	shareCfg: {
		shareUrl: `${location.origin}/${window.country}/m`
	},
	// 显示底部footer
	showFooter: true
};
