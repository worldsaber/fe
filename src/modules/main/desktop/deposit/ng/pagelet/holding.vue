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
import { mapState, mapActions } from 'vuex';
import CommonPop from 'components/popDialog/commonPop';
import { userCenterConfig } from 'config/order/userCenterConfig';

export default {
	name: 'Holding',
	data() {
		return {
			duration: 59,
			timer: null
		};
	},
	computed: {
		...mapState('deposit', [
			'displayMsg'
		])
	},
	methods: {
		...mapActions('deposit', [
			'tradeAddtional'
		]),
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
				title: null,
				contentData: {
					title: 'Something Wrong',
					msg: 'Your recharge request has encountered a problem. Please check the deposit record for final result.',
					cssList: 'm-dialog--tips'
				},
				content: CommonPop,
				button: ['OK']
			}).onBtnClick(btnType => {
				if (btnType === 'ok') {
					location.href = userCenterConfig.Transactions;
				}
			});
		},
		checkResult () {
			this.tradeAddtional({
				lockKey: '!holding'
			});
		}
	},
	mounted () {
		this.countDown();
	},
	destroyed () {
		this.timer && clearInterval(this.timer);
	}
};
</script>

<style lang="less">
@import "base/style/variable.less";
@import 'base/style/icon.less';

@keyframes loading-rotate {
	0%{
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.m-pending-holding {
	padding-top: 15px;
	text-align: center;

	.m-holding-message {
		margin: 6px 25px 0;
		font-size: 14px;
		line-height: 1.5;
		color: @dark;
	}

	.m-holding-wrap {
		margin-top: 38px;

		.m-holding-icon {
			display: inline-block;
			animation: loading-rotate 1.2s linear infinite;
			.m-icon-loading-circle();

			&:before {
				color: @green;
				font-size: 30px;
				line-height: 1;
				vertical-align: top;
			}
		}
	}

	.m-holding-footer {
		margin: 58px auto 17px;

		.m-cancel-btn {
			font-size: 14px;
			color: @green;
		}
	}
}
</style>
