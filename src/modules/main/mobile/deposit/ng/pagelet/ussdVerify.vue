<style lang="less">
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";
.m-ussd-pop {
	text-align: center;
	color: @dark;
	font-family: Roboto;

	.m-t1 {
		line-height: 14/@rem;
		font-size: 12/@rem;
	}

	.m-t2 {
		height: 24/@rem;
		font-size: 20/@rem;
	}

	.m-t3 {
		height: 20/@rem;
		font-size: 10/@rem;
	}

	.m-t-bold {
		font-weight: bold;
	}

	.m-t-blue {
		color: @linkBlue;
	}

	.m-t-gray {
		color: @darkGray;
	}

	.m-col {
		> * {
			display: inline-block;
			vertical-align: top;
		}
	}

	.m-t-btn {
		display: inline-block;
		vertical-align: middle;
		border: 1px solid @fogGrayBorder;
		border-radius: 2/@rem;
		padding: 5px 15px;
		box-sizing: border-box;
		margin-left: 10/@rem;
		line-height: 1;
	}

	.m-sec4 {
		margin-top: 40/@rem;

		.m-image-wrapper {
			width: 30/@rem;
			height: 20/@rem;
			margin-right: 15/@rem;

			>img {
				width: 100%;
				height: 100%;
			}
		}

		.m-t3:first-of-type {
			margin-right: 8/@rem;
		}
	}

	.m-sec1 {
		.m-t-bold {
			margin-top: 6/@rem;
		}
	}

	.m-sec2 {
		margin-top: 6/@rem;
	}

	.m-sec3 {
		margin-top: 48/@rem;

		.m-t2 {
			margin-top: 3/@rem;
		}
	}

	.m-icon-close {
		position: absolute;
		right: 16/@rem;
		top: 10/@rem;
		// .m-icon-close();
		z-index: 222;
		font-size: 12/@rem;
		color: @linkBlue;
		cursor: pointer;

		// &:before {
		// 	font-size: 12/@rem;
		// }
	}
}

.es-dialog.m-pop--ussd {
	padding: 30/@rem 0 20/@rem;
	box-sizing: border-box;

	.es-dialog-main {
		padding: 0 15/@rem;
	}
}

.es-dialog.m-ussd-confirm {
	.es-dialog-main {
		padding: 0 15/@rem;
		box-sizing: border-box;
	}

	.es-dialog-btn {
		font-weight: 14/@rem;
		width: auto;

		&:first-of-type {
			font-weight: normal;
			margin-right: 16/@rem;
		}
	}
}
</style>

<template lang="html">

<div class="m-ussd-pop">
	<div class="m-header-bar">
		<i class="m-icon-close" @click.stop.self="closePop">Later</i>
	</div>
    <div class="m-sec1">
        <div class="m-t1">To complete this Transaction</div>
        <div class="m-t1 m-t-bold">PLEASE DIAL</div>
    </div>
    <div class="m-sec2 m-col">
        <span class="m-t2 m-t-bold">{{extraData.dialNumber}}<span class="m-t3 m-t-blue m-t-btn" @click="copyNumber" id="j_copyNumber">copy</span></span>
    </div>
    <div class="m-sec3">
        <div class="m-t1">Then Send Your Transaction Reference</div>
        <div class="m-t2">{{extraData.transactionRef}}</div>
    </div>
    <div class="m-sec4">
		<div class="m-t3">Deposit: {{showCurrency}}{{showAmount}}</div>
		<div class="m-col">
			<div class="m-image-wrapper" v-if="extraData.bankIconUrl">
				<img :src="extraData.bankIconUrl" alt="" />
			</div>
			<div class="m-t3 m-t-gray" v-if="extraData.counterPart">Account {{extraData.counterPart}}</div>
			<div class="m-t3 m-t-gray" v-if="extraData.phoneNo">Phone {{extraData.phoneNo}}</div>
		</div>
    </div>
</div>

</template>

<script>
import { showCurrency } from 'config/currencyConfig';
import { formatNumber } from 'utils';
import { userCenterUrl } from 'config/mycenter/dataConfig.js';
import ClipboardJS from 'clipboard';
import verifyMixins from '../js/verifyMixins';

export default {
	props: {
		tradeId: {
			type: [Number, String],
			'default': ''
		},
		verifyType: {
			type: [Number, String],
			'default': 12
		},
		extraData: {
			type: Object,
			required: true
		}
	},
	mixins: [
		verifyMixins
	],
	data () {
		return {
			showCurrency,
			duration: 69,
			timer: null,
			needTips: false,
			clipboard: null
		};
	},
	computed: {
		showAmount() {
			const extraData = this.extraData || {},
				amount = extraData.amount || 0;

			return formatNumber(+amount, 2);
		}
	},
	methods: {
		copyNumber() {
			const extraData = this.extraData || {},
				dialNumber = extraData.dialNumber;

			this.clipboard = new ClipboardJS('#j_copyNumber', {
			    text() {
			        return dialNumber;
			    }
			});
			this.clipboard.on('success', e => {
				this.$toast('Successfully copied');
				e.clearSelection();
			});
		},
		countDown () {
			this.timer = setInterval(() => {
				--this.duration;
				if (this.duration === 0) {
					this.clearTimer();
					this.$dialog();
					return;
				}

				if (this.duration % 10 === 0 && this.duration >= 10) {
					!this.needTips && (this.needTips = true);
					this.checkResult();

					if (this.duration === 10) {
						this.isLast = true;
					}
				}
			}, 1000);
		},
		checkResult () {
			this.getTradeAdditional({
				params: {
					tradeId: this.tradeId,
					type: this.verifyType
				},
				currentStatus: this.verifyType,
				lockKey: '!ussd'
			});
		},
		clearTimer () {
			this.timer && clearInterval(this.timer);
			this.timer = null;
		},
		closePop() {
			if (this.needTips) {
				this.$dialog();
				this.$dialog({
					title: null,
					'class': 'm-ussd-confirm',
					content: ' If you have finished dialling, you can either go to Transactions to check details, or wait a bit longer for the results.',
					button: ['Keep Waiting', 'Go to Transactions']
				}).onBtnClick(btnType => {
					if (btnType === 1) {
						location.href = userCenterUrl.transaction;
					}

					if (btnType === 0) {
						this.$dialog();
					}
				});
			} else {
				this.$dialog();
			}
		}
	},
	mounted () {
		this.isPolling = true;
		this.countDown();
	},
	destroyed () {
		this.clearTimer();
		if (this.clipboard) {
			this.clipboard.destroy();
		}
	}
};

</script>
