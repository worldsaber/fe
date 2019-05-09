<template>
	<div class="m-pending-holding">
		<div class="m-holding-message">Waiting for bank response . Please do not close the page within {{duration}}s.</div>
		<div class="m-holding-wrap">
			<span class="m-holding-icon"></span>
		</div>
		<div class="m-holding-footer">
			<span class="m-cancel-btn" @click="handleCancel">CANCEL</span>
		</div>
	</div>
</template>

<script>
import { userCenterUrl } from 'config/mycenter/dataConfig.js';
import verifyMixins from '../js/verifyMixins';

export default {
	name: 'Holding',
	mixins: [
		verifyMixins
	],
	props: {
		tradeId: {
			type: [Number, String],
			'default': ''
		},
		verifyType: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			duration: 59,
			timer: null
		};
	},
	methods: {
		countDown () {
			this.timer = setInterval(() => {
				this.duration--;
				if (this.duration === 0) {
					clearInterval(this.timer);
					this.timer = null;
					this.handleCancel();
					return;
				}

				if (this.duration % 10 === 0) {
					this.checkResult();
				}
			}, 1000);
		},
		handleCancel () {
			this.$dialog();
			this.timer && clearInterval(this.timer);

			// 弹出Pending Request弹窗
			this.$dialog({
				title: 'Something Wrong',
				content: 'Your recharge request has encountered a problem. Please check the deposit record for final result.',
				button: ['OK']
			}).onClose(btnType => {
				if (btnType === 1) {
					location.href = userCenterUrl.transaction;
				}
			});
		},
		checkResult () {
			this.getTradeAdditional({
				params: {
					tradeId: this.tradeId,
					type: this.verifyType
				},
				currentStatus: this.verifyType,
				lockKey: '!holding'
			});
		},
		clearTimer () {
			this.timer && clearInterval(this.timer);
			this.timer = null;
		}
	},
	mounted () {
		// 倒计时
		this.countDown();
	},
	destroyed () {
		this.timer && clearInterval(this.timer);
	}
};
</script>

<style lang="less">
@import "base/styles/variable.less";
@import 'base/styles/icon.less';

@keyframes loading-rotate {
	0%{
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.m-pending-holding {
	text-align: center;

	.m-holding-message {
		margin: 6/@rem 25/@rem 0;
		font-size: 14/@rem;
		line-height: 1.5;
		color: @dark;
	}

	.m-holding-wrap {
		margin-top: 38/@rem;

		.m-holding-icon {
			display: inline-block;
			animation: loading-rotate 1.2s linear infinite;
			.m-icon-loading-circle();

			&:before {
				color: @green;
				font-size: 30/@rem;
				line-height: 1;
				vertical-align: top;
			}
		}
	}

	.m-holding-footer {
		margin: 58/@rem auto 17/@rem;

		.m-cancel-btn {
			font-size: 14/@rem;
			color: @green;
		}
	}
}
</style>
