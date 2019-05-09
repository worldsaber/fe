import {
	TOGGLE_LEFT,
	TOGGLE_RIGHT,
	TOGGLE_BOTTOM,
	CHANGE_LOADING,
	UPDATE_SCROLL,
	RESET_SCROLL,
	TOGGLE_SHARE,
	UPDATE_SHARE_CONFIG,
	TOGGLE_FOOTER
} from './mutationTypes';

export default {
	// 左边切换
	[TOGGLE_LEFT] (state, status) {
		if (typeof status === 'boolean') {
			state.showLeft = status;
		} else {
			state.showLeft = !state.showLeft;
		}
	},
	// 右边切换
	[TOGGLE_RIGHT] (state, status) {
		if (typeof status === 'boolean') {
			state.showRight = status;
		} else {
			state.showRight = !state.showRight;
		}
	},
	// 底部切换
	[TOGGLE_BOTTOM] (state, status) {
		if (typeof status === 'boolean') {
			state.showBottom = status;
		} else {
			state.showBottom = !state.showBottom;
		}
	},
	// loaind状态 -1表示加载失败，0|false 表示加载成功 true|1表示加载中
	[CHANGE_LOADING] (state, status) {
		if (status !== -1 && status !== 0 && status !== 1 && typeof status !== 'boolean') {
			return;
		}
		state.isLoading = status;
	},
	[UPDATE_SCROLL] (state, status) {
		state.scrollPayload = status;
	},
	[RESET_SCROLL] (state, status) {
		state.resetScroll = status;
	},
	[TOGGLE_SHARE] (state, status) {
		if (typeof status === 'boolean') {
			state.showShare = status;
		} else {
			state.showShare = !state.showShare;
		}
	},
	[UPDATE_SHARE_CONFIG] (state, options = {}) {
		state.shareCfg = Object.assign({}, options);
	},
	// 底部切换
	[TOGGLE_FOOTER] (state, status) {
		if (typeof status === 'boolean') {
			state.showFooter = status;
		} else {
			state.showFooter = !state.showFooter;
		}
	}
};
