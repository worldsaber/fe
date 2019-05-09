<template lang="html">
	<div class="m-dialog-wrapper m-dialog-suc">
		<div class="m-pop-header m-pop-header-fix">
			<i class="m-icon-suc"></i>
			<span>Submission Successful!</span>
			<i
				class="m-icon-close"
				data-action="close"
				data-ret="close"
			></i>
		</div>
		<div class="m-pop-main">
			<ul class="m-order">
				<!-- <li class="m-order-info">
					<div class="m-label">Ticket ID</div>
					<div class="m-value">{{contentData.shortId}}</div>
				</li> -->
				<li class="m-order-info">
					<!--去掉单位暂时不显示 ({{showCurrencyOrigin}}) -->
					<div class="m-label">Total Stake</div>
					<div
						class="m-value"
						v-if="contentData.totalStake"
					>{{contentData.showTotalStake}}</div>
				</li>
				<li class="m-order-info" v-if="contentData.showFavorAmount">
					<!-- 直减红包 -->
					<div class="m-label" v-if="contentData.favorType === 1">Cash Gifts</div>
					<div class="m-label" v-else>Discount Gifts</div>
					<div
						class="m-value"
						v-if="contentData.showFavorAmount"
					>{{contentData.showFavorAmount}}</div>
				</li>
				<li class="m-order-info">
					<div class="m-label">Potential Win</div>
					<div
						class="m-value"
						v-if="contentData.potentialWinnings"
					>{{contentData.potentialWinnings}}</div>
				</li>
				<li v-if="contentData.shareCode" class="m-order-info share-code">
					<div class="m-label">Booking Code
						<!-- 先不要弹窗提示@click="showTips" -->
						<em></em>
						<PopOver
							position="bottom"
							:isCenter="false"
							:arrowCenter="false"
							width="320px">
							<p>Input this code in betslip to restore selections.</p>
						</PopOver>
					</div>
					<div class="m-value">{{contentData.shareCode}}<i v-if="isHaveCopy" ref="copyShareCode" :data-clipboard-text="contentData.shareCode">Copy</i></div>
				</li>
			</ul>
			<p class="cashout-top" v-if="contentData.showFavorAmount">Note: Cashout unavailable as Gifts have been used.</p>
			<div class="m-btn-wrapper m-ok-wrap">
				<af-button
					data-action="close"
					data-ret="close"
				>OK</af-Button>
			</div>
			<div class="m-btn-wrapper m-share-wrap" v-if="contentData.shareCode">
				<af-button @click="goToShare" class="rebet">Rebet</af-Button>
			</div>
			<div class="m-btn-text">
				<a @click="handleClick" data-action="close" data-ret="close">Check Bet History<i class="m-icon-more"></i></a>
			</div>
		</div>
	</div>
</template>

<script>
import 'packages/button';
import { userCenterConfig } from 'config/order/userCenterConfig';
import { showCurrencyOrigin } from 'config/currencyConfig';
import 'components/popOver';
import { pagePath } from 'config/pageConfig';
import ClipboardJS from 'clipboard';
import { EventBus } from 'kernel/js/eventBus';
import cashoutEvent from 'config/cashout/eventCfg';

export default {
	data() {
		return {
			showCurrencyOrigin,
			isHaveCopy: document.execCommand
		};
	},
	mounted () {
		if (this.$refs.copyShareCode) {
			this.clipboard = new ClipboardJS(this.$refs.copyShareCode);
			this.clipboard.on('success', e => {
				this.$toast('Successfully copied');
				e.clearSelection();
			});
		}

		EventBus.$emit(cashoutEvent.UPDATE_CASHOUT_COUNT);
	},
	beforeDestroy () {
		if (this.clipboard) {
			this.clipboard.destroy();
		}
	},
	computed: {
		detailUrl() {
			return userCenterConfig['Bet History'] + '?isSettled=10';
		}
	},
	methods: {
		handleClick() {
			setTimeout(() => {
				location.href = this.detailUrl;
			}, 2);
		},
		showTips () {
			this.$dialog({
				content: 'Input this code in betslip to restore selections.',
				title: '',
				button: ['ok'],
				width: '300'
			});
		},
		goToShare () {
			location.href = URL.addPara(pagePath.home, {
				shareCode: this.contentData.shareCode
			});
		}
	}
};
</script>
