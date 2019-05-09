<template>
	<div class="m-ticket-detail" id="capture">
		<header class="m-header">
			<div class="m-logo">
				<i class="m-icon-logo"></i>
			</div>

			<div class="m-flex-right">
				<div class="m-desc">Betslip</div>
				<div class="m-date">{{showDate}}</div>
			</div>
		</header>

		<div v-loading:fetchTicketDetail="loading">
			<section class="m-top-section">
				<dl class="m-user-info">
					<dt class="m-avatar">
						<img v-if="avatarUrl" :src="avatarUrl" alt="">
					</dt>

					<dd class="m-info">
						<div class="m-nickname">{{nickname}}</div>

						<div class="m-text">{{words}}</div>
					</dd>
				</dl>

				<div class="m-booking-code" v-if="!isSetteld">
					<div class="m-label">Booking Code</div>
					<div class="m-value">{{ticketDetail.shareCode}}</div>
				</div>

				<div class="m-winnnings" v-if="isWon">
					<span class="m-label">{{currency}}</span>
					<span class="m-value">{{ticketDetail.totalWinnings}}</span>
				</div>
			</section>

			<section class="m-main-section">
				<div class="m-bet-summary">
					<div class="m-bet-type">{{ticketDetail.orderType}}</div>
					<div class="m-bet-total">Total Odds {{ticketDetail.totalOdds}}</div>
				</div>

				<!-- settled -->
				<ul class="m-bet-list">
					<template v-for="(item, index) in ticketDetail.selections">
						<!-- settled -->
						<SettledItem v-if="isSetteld" :key="index" :selection="item" />
						<!-- unsettled -->
						<UnsettledItem v-else class="m-list-item" :key="index" :selection="item" />
					</template>
				</ul>
			</section>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { ADD_IMG_DATA_LIST, UPDATE_BOOKING_CODE } from 'store/shareBet/mutationTypes';
import dateFormat from 'kernel/js/dateFormat';
import html2canvas from 'html2canvas';
import SettledItem from './SettledItem';
import UnsettledItem from './UnsettledItem';

export default {
	name: 'TicketDetail',
	components: {
		SettledItem,
		UnsettledItem
	},
	props: {
		orderId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			currency: window.currency,
			loading: true
		};
	},
	computed: {
		...mapState('order', [
			'ticketDetail',
		]),
		...mapState('me', ['nickname', 'avatar']),
		avatarUrl() {
			const avatar = this.avatar;
			// 加时间戳不走缓存（fetch 走 chrome service worker会有问题，不能正确响应资源）
			return avatar && `${__cdnOrigin__}/${avatar}`;
		},
		showDate() {
			const date = this.ticketDetail.createTime;
			if (date) {
				return dateFormat.format(date, 'YYYY-MM-DD HH:mm:ss');
			}
		},
		isSetteld() {
			return this.ticketDetail.isAllSettled;
		},
		// 返奖是否大于0
		isWon() {
			const { totalWinnings } = this.ticketDetail;
			return totalWinnings && +totalWinnings > 0;
		},
		words() {
			// unsettled
			if (!this.isSetteld) {
				return 'Simply following my betslip by inputing this code!';
			}

			// Settled订单-返奖大于0
			if (this.isWon) {
				return 'I Won!';
			}

			// Settled订单-返奖为0
			return 'Better luck next time.';
		}
	},
	methods: {
		...mapActions('order', [
			'fetchTicketDetail',
		]),
		...mapMutations('shareBet', {
			addImgDataList: ADD_IMG_DATA_LIST,
			updateBookingCode: UPDATE_BOOKING_CODE
		}),
		async fetchData() {
			try {
				await this.fetchTicketDetail(this.orderId);
				this.loading = false;
			} catch (err) {
				console.log(err); // eslint-disable-line
				this.loading = -1;
			}
		},
		capture() {
			html2canvas(this.$el, {
				scale: 1,
				useCORS: true
			}).then(canvas => {
				const imgData = canvas.toDataURL('image/jpeg', 0.8);
				this.addImgDataList(imgData);
				if (!this.isSetteld) {
					this.updateBookingCode(this.ticketDetail.shareCode);
				}
				canvas = null;
				this.$emit('ready');
			});
		}
	},
	async mounted() {
		await this.fetchData();

		this.capture();
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

.m-ticket-detail {
	position: fixed;
	top: 0;
	left: 9999px;
	z-index: 1000;
	width: 100%;
	background: #1b1e25;
	overflow: hidden;

	.m-header {
		height: 56px;
		padding: 0 16/@rem;
		background: #e41827;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.m-icon-logo {
			.m-icon-sportbet();

			&:before{
				font-size: 20/@rem
			}
		}

		.m-flex-right {
			text-align: right;

			.m-desc {
				font-size: 16/@rem;
				line-height: 1;
			}

			.m-date {
				font-size: 10/@rem;
				line-height: 12/@rem;
				height: 12/@rem;
				min-width: 1px;
			}
		}
	}
}

.m-top-section {
	color: #fff;
	padding: 24/@rem 16/@rem 12/@rem;

	.m-user-info {
		position: relative;
		padding-left: 50/@rem;

		.m-avatar {
			position: absolute;
			left: 0;
			top: 0;
			border-radius: 50%;
			overflow: hidden;
			width: 36/@rem;
			height: 36/@rem;
			background: #9CA0AB;

			img {
				vertical-align: top;
				width: 100%;
			}
		}

		.m-info {
			.m-nickname {
				font-size: 12/@rem;
				line-height: 1;
			}

			.m-text {
				margin-top: 6/@rem;
				font-size: 14/@rem;
				line-height: 18/@rem;
				word-wrap: break-word;
			}
		}
	}

	.m-booking-code {
		margin-top: 14/@rem;
		text-align: center;
		line-height: 1;

		.m-label {
			font-size: 12/@rem;
			color: #eaecef;
		}

		.m-value {
			margin-top: 6/@rem;
			font-size: 32/@rem;
			font-weight: 500;
			color: #33ea6a;
		}
	}

	.m-winnnings {
		margin-top: 18/@rem;
		text-align: center;
		overflow: hidden;
		line-height: 32/@rem;
		font-weight: 500;
		color: #33ea6a;

		& > span {
			vertical-align: middle;
		}

		.m-label {
			font-size: 20/@rem;
		}

		.m-value {
			font-size: 32/@rem;
		}
	}
}

.m-main-section {
	margin: 6/@rem;
	background: #fff;

	.m-bet-summary {
		height: 40/@rem;
		padding: 0 12/@rem;
		border-bottom: 1px solid #eaecef;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.m-bet-type {
			font-size: 12/@rem;
			font-weight: 500;
			color: #353a45
		}

		.m-bet-total {
			font-size: 12/@rem;
			font-weight: 500;
			color: #0d9737
		}
	}

	.m-list-item {
		border-bottom: 1px solid #eaecef;

		&:last-child {
			border-bottom: 0;
		}
	}
}
</style>
