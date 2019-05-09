<template>
	<div class="m-coin-history" v-loading="isLoading">
		<navbar/>
		<ul class="history-list" v-loadMore:hasMore="loadMoreConfig" v-if="list && list.length > 0">
			<li class="list-item" v-for="(item, index) in list" :key="index" @click="goTransaction(item)">
				<div class="history-head">
					<img class="banner-img" :src="item.banner.bgUrl"/>
					<label class="title-label">{{item.banner.title}}</label>
					<label class="promotion-label">{{currency}} {{item.banner.promotation}}</label>
					<label class="sportycoins-label">SportyCoins</label>
				</div>
				<div class="history-title">{{item.showStatus}}</div>
				<div class="history-detail">
					<div class="label-wrap">
						<div class="left">SportyCoins({{currency}})</div>
						<div>Balance({{currency}})</div>
					</div>
					<div class="value-wrap">
						<div class="value left">{{item.showCurrentAmount}}</div>
						<div class="arrow-wrap">
							<div class="auto-transfer" v-if="item.status === 4">auto transfer</div>
							<img class="arrow-img" src="../image/arrow.png"/>
						</div>
						<div :class="['value', {
							'grey': item.finalAmount === 0
							}]">{{item.showFinalAmount}}</div>
					</div>
				</div>
				<div class="transaction-wrap">
					<p class="transaction-desc">{{item.showDesc}}</p>
					<span class="go-transaction">Transactions</span>
					<i class="icon-right"/>
				</div>
			</li>
			<li class="no-more-text" v-if="!hasMore && hasMultiPage">No more info...</li>
			<li class="loading-wrap" v-else-if="showLoading"><i class="icon-loading"/></li>
		</ul>
		<div class="no-item" v-if="list && list.length === 0 && !isLoading">
			<div class="icon-wrap">
				<img class="icon-none" src="../image/icon-none.svg">
			</div>
			<p class="no-history-text">No histories available</p>
		</div>
	</div>
</template>

<script>
import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';
import 'components/loadMore';
import 'components/loading';
import navbar from '../../../../common-wap/components/navbar';

const statusMap = {
	1: 'Cancelled',
	2: 'Cancelled',
	3: 'Expired',
	4: 'Succeeded!',
	5: 'Used up'
};
export default {
	components: {
		navbar
	},
	data() {
		return {
			list: [],
			loadMoreConfig: {
				className: '.m-main-mid',
				onLoadMore: this.fetchData
			},
			lastId: '',
			pageSize: 10,
			isLoading: false,
			showLoading: false,
			totalNum: -1,
			currency: window.currency
		};
	},
	computed: {
		hasMore() {
			return this.totalNum === -1 || this.list.length < this.totalNum;
		},
		hasMultiPage() {
			return this.totalNum > this.pageSize;
		}
	},
	created() {
		this.isLoading = true;
		this.fetchData().then(() => {
			this.isLoading = false;
		}).catch(() => {
			this.isLoading = false;
		});
	},
	mounted() {
		const loadingDom = document.querySelector('#pageLoading');
		loadingDom && loadingDom.remove();
	},
	methods: {
		fetchData() {
			this.showLoading = true;
			return fetch(`/pocket/v1/activity/sportycoins/history?pageSize=${this.pageSize}&lastId=${this.lastId}`).then(res => res.json()).then(res => {
				this.showLoading = false;
				if (res.bizCode === 10000) {
					if (this.totalNum === -1) {
						this.totalNum = res.data.totalNum;
					}
					const data = res.data.entityList || [];
					if (this.list.length === 0) {
						this.list = this.format(data);
					} else {
						this.list = this.list.concat(this.format(data));
					}
					this.lastId = this.list[this.list.length - 1].activityId || '';
				}
			}).catch(e => {
				console.log(e);
				this.showLoading = false;
			});
		},
		format(list) {
			list && list.forEach(item => {
				item.showStatus = statusMap[item.status];
				item.showCurrentAmount = formatNumber(item.currentCoins / 10000, 2);
				item.showFinalAmount = formatNumber(item.finalAmount / 10000, 2);
				item.showExpireTime = dateFormat.format(item.predefinedExpireTime, 'DD/MM/YY HH:mm');
				switch (item.status) {
				case 1:
					item.showDesc = 'Cancelled by SportyBet according to the T&C of activities and SportyCoins.';
					break;
				case 2:
					item.showDesc = 'Cancelled due to another SportyCoins have been claimed.';
					break;
				case 3:
					item.showDesc = `Expired on ${item.showExpireTime}`;
					break;
				case 4:
					item.showDesc = 'Succeeded! SportyCoins have been transferred to your balance.';
					break;
				case 5:
					item.showDesc = 'Used up';
					break;
				default:
					item.showDesc = '';
				}
			});
			return list;
		},
		goTransaction(item) {
			if (item && item.activityId) {
				this.$router.push({
					name: 'transaction',
					params: {
						id: item.activityId
					},
					query: {
						tab: 'coin'
					}
				});
			}
		}
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

@keyframes circles {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
.m-coin-history {
	min-height: 100%;
	background-color: @darker;
	.history-list {
		padding: 10/@rem 20/@rem;
		list-style: none;
		.list-item {
			margin-bottom: 15/@rem;
			background-color: @dark;
			border-radius: 4/@rem;
			.history-head {
				position: relative;
				.banner-img {
					width: 100%;
					height: 83/@rem;
				}
				.title-label {
					position: absolute;
					top: 14/@rem;
					left: 15/@rem;
					font-size: 12/@rem;
					line-height: 14/@rem;
					font-weight: bold;
					color: #453714;
				}
				.promotion-label {
					position: absolute;
					top: 28/@rem;
					left: 15/@rem;
					font-size: 18/@rem;
					line-height: 22/@rem;
					font-weight: bold;
					color: @white;
					text-shadow: 0 2/@rem 4/@rem rgba(0, 0, 0, 0.5);
				}
				.sportycoins-label {
					position: absolute;
					top: 50/@rem;
					left: 15/@rem;
					font-size: 12/@rem;
					line-height: 12/@rem;
					color: @white;
				}
			}
			.history-title {
				margin-top: 8/@rem;
				margin-bottom: 8/@rem;
				font-size: 14/@rem;
				line-height: 16/@rem;
				color: @white;
				text-align: center;
			}
			.history-detail {
				margin-left: 18/@rem;
				margin-right: 12/@rem;
				padding-top: 7/@rem;
				padding-bottom: 10/@rem;
				border-top: 2px solid @blackGray;
				border-bottom: 2px solid @blackGray;
				.label-wrap {
					margin-top: 6/@rem;
					display: flex;
					align-items: center;
					justify-content: center;
					div {
						flex: 0 0 auto;
						font-size: 12/@rem;
						line-height: 12/@rem;
						color: @darkGray;
					}
					.left {
						flex: 1 1 auto;
					}
				}
				.value-wrap {
					margin-top: 3/@rem;
					display: flex;
					align-items: center;
					justify-content: center;
					.value {
						flex: 1 1 auto;
						font-size: 20/@rem;
						line-height: 24/@rem;
						text-align: right;
						color: @midGreen;
						&.left {
							text-align: left;
							color: #f2af00;
						}
						&.grey {
							color: @darkGray;
						}
					}
					.arrow-wrap {
						position: relative;
						flex: 0 0 auto;
						width: 90/@rem;
						.arrow-img {
							width: 100%;
						}
						.auto-transfer {
							position: absolute;
							left: 0;
							top: -3/@rem;
							width: 90/@rem;
							font-size: 12/@rem;
							line-height: 12/@rem;
							height: 12/@rem;
							text-align: center;
							color: @darkGray;
							transform: translate(-4/@rem);
						}
					}
				}
			}
			.transaction-wrap {
				padding-top: 10/@rem;
				padding-bottom: 12/@rem;
				margin-left: 18/@rem;
				margin-right: 12/@rem;
				min-height: 24/@rem;
				display: flex;
				align-items: center;
				justify-content: center;
				.transaction-desc {
					flex: 1 1 auto;
					line-height: 12/@rem;
					font-size: 12/@rem;
					color: @darkGray;
				}
				.go-transaction {
					margin-left: 40/@rem;
					font-size: 12/@rem;
					line-height: 12/@rem;
					color: @white;
				}
				.icon-right {
					margin-left: 8/@rem;
					.m-icon-arrow--right();
					&::before {
						font-size: 16/@rem;
						color: @white;
					}
				}
			}
		}
		.loading-wrap {
			text-align: center;
			.icon-loading {
				display: inline-block;
				.m-icon-loading-circle();
				animation: circles 1s infinite;
				animation-timing-function: linear;
				&::before {
					color: @white;
				}
			}
		}
		.no-more-text {
			text-align: center;
			color: @white;
		}
	}
	.no-item {
		padding-top: 60/@rem;
		.icon-wrap {
			text-align: center;
			.icon-none {
				width: 36/@rem;
				height: 36/@rem;
			}
		}
		.no-history-text {
			margin-top: 14/@rem;
			font-size: 14/@rem;
			line-height: 16/@rem;
			color: @darkGray;
			text-align: center;
		}
	}
}
</style>
