<template lang="html">
	<div :class="[
		'm-balance-tips',
		{
			'on': showTips
		}
	]">
		<p>Check your bet history here</p>
	</div>
</template>

<script>
import { EventBus } from 'kernel/js/eventBus.js';

import commonEvent from 'config/eventConfig/commonEvent';

import { LS } from 'storage';

const betTipsStatus = LS.get('betTipsStatus') || 1;

let timer;

export default {
	data() {
		return {
			showTips: betTipsStatus
		};
	},
	watch: {
		showTips(val, oldVal) {
			if (val) {
				timer = setTimeout(() => {
					this.showTips = false;
				}, 4000);
			} else {
				timer && clearTimeout(timer);
				timer = null;

				+betTipsStatus && LS.set('betTipsStatus', 0);
			}
		}
	},
	mounted() {
		this.showTips = +betTipsStatus && !!window.loginStatus;

		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
			if (window.loginStatus) {
				this.showTips = true;
			}
		});

		EventBus.$on(commonEvent.UPDATE_BALANCE_STATUS, status => {
			if (!status) {
				this.showTips = false;
			} else {
				this.showTips = true;
			}
		});
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

.m-login-bar {
	.m-balance-tips {
		position: absolute;
		top: 34px;
		left: 0;
		background: @blue;
		width: 198px;
		padding: 10px;
		box-sizing: border-box;
		border-radius: 2px;
		line-height: 16px;
		font-size: 14px;
		font-weight: 500;
		color: @white;
		box-shadow: 0 2px 4px 0 fadeout(@black, 50%);

		&:before {
			content: '';
			display: block;
			width: 10px;
			height: 10px;
			position: absolute;
			background: @blue;
			box-shadow: 2px 2px 2px -1px fadeout(@black, 80%), 2px 2px 2px -1px fadeout(@black, 80%);
			border-top-color: transparent;
			border-left-color: transparent;
			left: 20px;
			top: -5px;
			transform: translate3d(-50%,0,0) rotate(-135deg);
		}

		&:not(.on) {
			display: none;
		}
	}
}
</style>
