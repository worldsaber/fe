<template>
	<div class="m-cashout-pop" id="j_pop_cashout">
		<transition name="fade">
			<div class="m-mask" v-if="isShow" @click="close"></div>
		</transition>
		<transition name="slide">
			<div :class="['m-container', {'m-container-fix': cashoutInfo.isSupportPartial && !cashoutInfo.errorMsg}]" v-if="isShow">
				<div class="m-close" @click="close"></div>

				<div class="m-main">
					<div class="m-head f-alg-side">
						<div class="f-alg-side-item">
							<div class="m-t-12 m-t-l16 m-t-gray" v-if="curBetInfo.hasCashouted">Remaining Stake</div>
							<div class="m-t-12 m-t-l16 m-t-gray" v-else>Stake</div>
							<div class="m-t-14 m-t-l16 m-t-dark">{{showTotalStake}}</div>
						</div>
						<div class="f-alg-side-item">
							<div class="m-t-12 m-t-l16 m-t-gray">Pot. Win</div>
							<div class="m-t-14 m-t-l16 m-t-dark">{{curBetInfo.showPotWinnings}}</div>
						</div>
					</div>

					<div class="m-body">
						<div class="m-t-center m-l-top">
							<div class="m-t-20 m-t-dark m-t-bold">
								<span>{{getCashoutLable}}</span>
								<NumberChg
									v-if="cashoutInfo.cashoutAvailable"
									:origin="oldCashoutVal"
									:value="showCashoutVal"
									:showChg="showChg === 2"
									:interval="20"
									@chgNumDone="clearChgStatus"
								/>
							</div>
							<div class="m-t-12 m-t-l14 m-t-center m-t-gray" v-if="cashoutInfo.errorMsg">{{cashoutInfo.errorMsg}}</div>
							<div class="m-t-12 m-t-l14 m-t-center m-t-red" v-else-if="showErrTips">{{showErrTips}}</div>
							<div class="m-t-12 m-t-dark m-t-mt10" v-else-if="+remainStake && !isFullCashout">Remaining Stake {{remainStake}}</div>
						</div>

						<div class="m-l-mid m-slider-bar" v-if="cashoutInfo.isSupportPartial && !cashoutInfo.errorMsg">
							<AfSlider
								v-model="cashoutVal"
								:height="4"
								:dotSize="20"
								:max="max"
								:min="minCashoutAmount"
								:lazy="true"
								:disabled="isSlideDisable"
							/>

							<div class="m-slide-range-label">
								<span>Min {{showMin}}</span>
								<span>Max {{showMax}}</span>
							</div>
						</div>

						<div class="m-btn-wrapper f-flex">
							<div
								class="m-btn-item"
								>
								<i :class="{
									'm-icon-refresh': !refreshLoading,
									'm-icon-loading': refreshLoading
								}" @click="refreshDetail"></i>
							</div>

							<af-Button
								class="f-flex-item"
								extraType='primary'
								@click="commitCashout"
								:loading="confirmLoading"
								:disabled="isDisabled"
							>{{confirmLoading ? 'Loading...' : 'Confirm'}}</af-Button>
						</div>

						<div class="m-cashout-tips m-t-lblue" v-if="curBetInfo.combinationNum > 1">
							<i class="m-i-tips"></i><span class="m-t-12 m-t-l14" @click.stop="showCashoutRule">Why is Partial Cashout unavailable?</span>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import 'packages/slider';
import 'packages/button';
import { formatNumber, isEmptyObject } from 'utils';
import { showCurrency } from 'config/currencyConfig';
import { UPDATELOCKSTATUS } from 'store/openBet/mutationTypes';
import NumberChg from 'components/betslip/pagelet/numberChg.vue';
import { partialCashoutRule } from '../js/config';

export default {
	props: {
		showPop: {
			type: Boolean,
			required: true
		},
		curDetailId: {
			type: String,
			'default': ''
		}
	},
	components: {
		NumberChg
	},
	data() {
		return {
			isShow: false,
			usedStake: 0,
			remainStake: (0).toFixed(2),
			maxCashout: 0,
			cashoutVal: 0,
			showCashoutVal: 0,
			refreshLoading: false,
			confirmLoading: false,
			hasInit: false,
			cfg: Object.freeze({
				showCurrency,
				partialCashoutRule
			}),
			showChg: 0
		};
	},
	computed: {
		...mapState('openBet', [
			'minCashoutAmount',
			'maxCashOutAmount',
			'reqLoading',
			'cashoutInfo',
			'betKeys',
			'details',
			'errorInfo'
		]),
		isFullCashout() {
			return this.isSlideDisable || this.showCashoutVal === this.maxCashout;
		},
		getCashoutLable() {
			if (!this.cashoutInfo.cashoutAvailable) {
				return 'Cashout Unavailable';
			}

			if (this.isFullCashout) {
				return 'Full Cashout';
			}

			return 'Partial Cashout';
		},
		curBetInfo() {
			const betKeys = this.betKeys || [],
				details = this.details || [],
				betId = this.curDetailId || '',
				index = betId ? betKeys.indexOf(betId) : -1;

			if (index !== -1) {
				return details[index];
			}

			return {};
		},
		isSlideDisable() {
			const minCashoutAmount = this.minCashoutAmount;

			if (this.showErrTips || this.maxCashout === minCashoutAmount) {
				return true;
			}

			return false;
		},
		showErrTips() {
			const minCashoutAmount = this.minCashoutAmount,
				maxCashOutAmount = this.maxCashOutAmount,
				showCurrency = this.cfg.showCurrency,
				cashoutInfo = this.cashoutInfo || {},
				cashoutVal = +cashoutInfo.maxCashOutAmount || 0;

			if (cashoutVal < minCashoutAmount || cashoutVal > maxCashOutAmount) {
				return `Cashout only available between ${showCurrency}${minCashoutAmount} - ${showCurrency}${formatNumber(maxCashOutAmount, 0)}. Please refresh.`;
			}

			return '';
		},
		isDisabled() {
			return !!(this.showErrTips || this.cashoutInfo.errorMsg);
		},
		max() {
			return this.isSlideDisable ? this.maxCashOutAmount : this.maxCashout;
		},
		showMax() {
			return this.max.toFixed(2);
		},
		showMin() {
			return this.minCashoutAmount.toFixed(2);
		},
		showTotalStake() {
			const curBetInfo = this.curBetInfo || {};
			let stake = curBetInfo.stake;

			stake = +stake;
			return stake.toFixed(2);
		}
	},
	watch: {
		isShow(val) {
			if (val) {
				this.updateLockStatus(true);
			} else {
				this.updateLockStatus(false);
				this.resetData();
			}
		},
		showPop(val) {
			if (val) {
				window.addEventListener('scroll', this.disabledScroll);

				if (this.curDetailId) {
					// loading弹窗
					this.$dialog({
						title: null,
						css: 'es-dialog-toast',
						width: 0,
						content: '<i class="m-icon--loading"></i>Loading...',
						button: []
					});

					this.fetchBetDetail({ betId: this.curDetailId, from: 'pop_cashout' })
						.then(opt => {
							const { loaded = false } = opt || {};

							if (loaded) {
								this.$dialog();
								this.isShow = true;
							} else {
								this.close();
							}
						}).catch(err => { window.__debug__ && console.log(err); });
				}
			} else {
				window.removeEventListener('scroll', this.disabledScroll);
				this.isShow = false;
			}
		},
		reqLoading(val) {
			if (!val) {
				if (this.refreshLoading) {
					this.refreshLoading = false;
				}

				if (this.confirmLoading) {
					this.confirmLoading = false;
				}
			}
		},
		cashoutVal(val, oldVal) {
			if (val) {
				this.calStake();
			}
		},
		cashoutInfo(val, oldVal) {
			if (!isEmptyObject(val)) {
				this.updateCashoutInfo(oldVal);
			}
		},
		showCashoutVal(val, oldVal) {
			if (+oldVal) {
				this.oldCashoutVal = +oldVal;
				(this.showChg === 1) && (this.showChg = 2);
			}
		},
		errorInfo(val) {
			const { from = '' } = val || {};
			if (from === 'cashout' || from === 'pop_refresh' || from === 'detail_update') {
				this.close();
			}
		}
	},
	methods: {
		...mapMutations('openBet', {
			updateLockStatus: UPDATELOCKSTATUS
		}),
		...mapActions('openBet', [
			'fetchBetDetail',
			'cashout'
		]),
		close() {
			this.$emit('close');
		},
		disabledScroll(e) {
			e.preventDefault();
		},
		commitCashout() {
			if (this.confirmLoading) {
				return;
			}

			this.confirmLoading = true;
			this.showChg = 1;

			const params = this.isFullCashout ? {} : {
				usedStake: this.usedStake + '',
				amount: this.cashoutVal + ''
			};

			this.cashout(params).catch(err => window.__debug__ && console.log(err));
		},
		refreshDetail() {
			if (this.refreshLoading) {
				return;
			}

			this.refreshLoading = true;
			this.showChg = 1;

			this.fetchBetDetail({
				betId: this.curDetailId,
				from: 'pop_refresh'
			}).catch(err => { window.__debug__ && console.log(err); });
		},
		initData() {
			const cashoutInfo = this.cashoutInfo || {},
				cashoutVal = +cashoutInfo.maxCashOutAmount || 0;

			this.cashoutVal = cashoutVal;
			this.showCashoutVal = cashoutVal;
			this.remainStake = (0).toFixed(2);
			this.maxCashout = cashoutVal;
			this.usedStake = cashoutInfo.availableStake;

			if (!this.hasInit) {
				this.oldCashoutVal = cashoutVal;
				this.hasInit = true;
			}
		},
		updateCashoutInfo(oldCashoutInfo = {}) {
			const cashoutInfo = this.cashoutInfo || {};

			if (!cashoutInfo.cashoutAvailable) {
				this.showChg = 0;
				return;
			}

			if (this.showChg === 1 && this.maxCashout === +cashoutInfo.maxCashOutAmount) {
				this.showChg = 0;
			}

			const currentPartal = cashoutInfo.isSupportPartial || false;

			if (!currentPartal || !this.hasInit) {
				this.initData();
			} else {
				this.calStake(oldCashoutInfo);
			}
		},
		calStake(oldCashoutInfo = {}) {
			const cashoutInfo = this.cashoutInfo || {},
				coefficient = +cashoutInfo.coefficient || 0,
				maxCashOutAmount = +cashoutInfo.maxCashOutAmount || 0,
				cashoutAvailable = cashoutInfo.cashoutAvailable || true,
				availableStake = +cashoutInfo.availableStake || 0,
				maxCashout = this.maxCashout,
				maxThreshold = this.maxCashOutAmount,
				minThreshold = this.minCashoutAmount;

			if (!cashoutAvailable) {
				this.usedStake = 0;
				this.remainStake = (0).toFixed(2);

				return;
			}

			if (oldCashoutInfo.errorMsg) {
				this.showChg = 0;
			}

			if (maxCashOutAmount > maxThreshold) {
				this.cashoutVal = maxThreshold;
				this.maxCashout = maxThreshold;
				this.usedStake = 0;
				this.remainStake = (0).toFixed(2);
				this.showCashoutVal = maxCashOutAmount;

				return;
			}

			if (maxCashOutAmount <= minThreshold) {
				this.cashoutVal = minThreshold;
				this.maxCashout = minThreshold;
				this.usedStake = 0;
				this.remainStake = (0).toFixed(2);
				this.showCashoutVal = maxCashOutAmount;

				return;
			}

			if (maxCashout !== maxCashOutAmount) {
				this.remainSliderPos(maxCashOutAmount, maxCashout);
				this.maxCashout = maxCashOutAmount;
			}

			const cashoutVal = this.cashoutVal;
			if (cashoutVal !== maxCashOutAmount) {
				let stake = cashoutVal / coefficient;

				stake = stake.toFixed(2);
				stake = Math.min(availableStake, stake);
				this.usedStake = stake;
			} else {
				this.usedStake = availableStake;
			}

			this.showCashoutVal = +cashoutVal;

			this.remainStake = (this.curBetInfo.stake - this.usedStake).toFixed(2);
		},

		remainSliderPos(newMax, oldMax) {
			if (oldMax && this.cashoutVal) {
				if (+oldMax === +this.cashoutVal) {
					this.cashoutVal = newMax.toFixed(2);
				} else {
					const ratio = this.cashoutVal / oldMax;

					this.cashoutVal = (newMax * ratio).toFixed(2);
				}
			}
		},
		showCashoutRule() {
			this.isShow = false;
			this.$dialog();
			this.$dialog({
				title: null,
				content: this.cfg.partialCashoutRule,
				button: ['OK']
			}).onBtnClick(() => {
				this.isShow = true;
			});
		},
		resetData() {
			this.hasInit = false;
			this.refreshLoading = false;
			this.confirmLoading = false;
		},
		clearChgStatus() {
			this.showChg = 0;
		}
	},
	mounted() {
		const containerDom = document.querySelector('#j_pop_cashout');
		containerDom && containerDom.addEventListener('touchmove', e => {
			e.preventDefault();
		});
	},
	destroy() {
		const containerDom = document.querySelector('#j_pop_cashout');
		containerDom && containerDom.removeEventListener('touchmove');
	}
};
</script>

<style lang="less">
@import '../style/popCashout.less';
</style>
