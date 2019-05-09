<template lang="html">
	<div>
		<template v-if="showError">
			<BetTips
				:showTips="getTips"
				:betId="betInfo.id"
				:shouldDeleteBet="shouldDeleteBet"
				@close-tips="closeTips"
			/>
		</template>

		<template v-else>
			<div class="m-border"></div>
			<div
				v-for="item in cashoutDetail"
				:key="item.id"
				class="m-bet-detail"
			>
				<div class="m-text-main m-outcome-desc">
					<span>{{item.outcomeDesc}} {{item.odds ? '@' + item.odds : ''}}<i v-if="item.banker" class="m-icon-banker"></i></span>
					<span v-if="item.showResult">{{item.showResult}}</span>
				</div>

				<div class="m-outcome-odds" v-if="item.isLiveEvent && !item.showResult">
					<template v-if="item.isOutComeBettable">
						<span class="m-icon-live">Live Odds</span>
    					<span class="m-odds">{{item.currentOdds}}</span>
    					<i
    						:class="[{'m-odds--up': item.statusDesc === 'up', 'm-odds--down': item.statusDesc === 'down'}]"
    						v-if="item.statusDesc === 'up' || item.statusDesc === 'down'"
    					></i>
					</template>
					<template v-else>
					  <div class="m-odds-desc">Live Odds Suspended</div>
					</template>
				</div>

				<div class="m-text-min">
					<span>{{item.marketDesc}}</span>
				</div>

				<div class="m-text-min">
					<span>{{getAgainst(item)}}</span>
				</div>

				<div class="m-score">
					<span>{{item.showScore}}</span>
				</div>
			</div>

			<div class="m-bet-money">
				<div>
					<div class="m-col">
						<div class="m-col-title">{{betInfo.hasCashouted ? 'Remain Stake' : 'Bet Stake'}}</div>
						<div class="m-col-text">{{betInfo.showStake}}</div>
					</div>

					<div
						class="m-col"
						v-if="betInfo.bonus"
					>
						<div class="m-col-title">Bet Bonus</div>
						<div class="m-col-text">{{betInfo.bonus}}</div>
					</div>

					<div class="m-col">
						<div class="m-col-title">Pot. Win</div>
						<div class="m-col-text">{{betInfo.showPotWinnings}}</div>
					</div>
				</div>
			</div>

			<!-- 确认窗 -->
			<template v-if="showConfirm">
				<div class="m-comfirm-wrapper">
					<div
						class="m-text-wrapper m-text-wrapper-fix"
						v-if="isPartial"
					>
						<p>
							<span class="m-label"> Partial Cashout Amount:</span>
							<span class="m-value">{{showCashoutVal}}</span>
						</p>
						<p>
							<span class="m-label">Remain Stake Amount:</span>
							<span
								:class="[
									'm-value',
									{
										'm-value-highlight': highlight
									}
								]"
							>{{remainStakeShowVal}}</span>
						</p>
					</div>

					<div
						class="m-text-wrapper"
						v-else
					>
						<p>
							<span class="m-label">Latest Cashout Amount:</span>
							<span
								:class="[
									'm-value',
									{
										'm-value-highlight': highlight
									}
								]"
							>{{showCashoutVal}}</span>
						</p>
					</div>

					<template v-if="cashoutLoading">
						<af-Button
							extraType='text'
							:loading="true"
							class="m-btn--submit"
						>Submitting...</af-Button>
					</template>

					<template v-else>
						<div class="m-btn-wrapper">
							<af-Button
								extraType='text'
								@click="cancelCashout"
							>Cancel</af-Button>
							<af-Button
								extraType='primary'
								@click="commitCashout"
							>Confirm</af-Button>
						</div>
					</template>

				</div>

			</template>

			<!-- 按钮条 -->
			<template v-else>

				<div
					class="m-slider-wrapper"
					v-if="showPopOver"
				>
					<div class="m-slider-pop">
						<p class="m-slide-title">
							Choose Partial Cashout Amount
						</p>
						<AfSlider
							v-model="cashoutVal"
							:height="4"
							:dotSize="14"
							:max="maxCashout"
							:min="minCashoutAmount"
							:lazy="true"
						/>
						<div class="m-slide-range-label">
							<span>{{minCashoutAmount}}</span>
							<span>{{maxCashout}}</span>
						</div>
						<div
							class="m-text-mini"
							v-if="showRemainStake"
						>Remain Stake {{remainStakeShowVal}}</div>
					</div>
					<div class="m-pop-arrow"></div>
				</div>

				<div :class="[
					'm-btn-wrapper',
					{
						'm-btn-wrapper-fix': !done && cashoutInfo.isSupportPartial
					}
				]">

					<!-- 成功态 -->
					<template v-if="done">
						<af-Button
							extraType='success'
							:loading="false"
							class="m-btn--success"
						>Cashout {{showCashoutVal}}</af-Button>
					</template>

					<template v-else>
						<div
							class="m-btn-item"
							@click="refreshDetail"
							>
							<i :class="
								{
									'm-icon-refresh': !loading4refresh,
									'm-icon-loading': loading4refresh
								}
							"></i>
						</div>

						<!-- partial cashout -->
						<div
							v-if="cashoutInfo.isSupportPartial"
							:class="[
								'm-btn-item',
								{
									'm-partial-on': showPopOver
								}
							]"
						>
							<i
								class="m-icon-partial"
								@click.self="selectCashout"
							></i>
						</div>

						<af-Button
							extraType='primary'
							@click="handleCashout"
							:class="[
								'af-button--opt',
								{
									'af-button-fix': !cashoutInfo.isSupportPartial
								}
							]"
						>
							<template v-if="cashoutInfo.isSupportPartial">
								<span>Cashout<br /><span class="m-text-big">{{showCashoutVal}}</span></span>
							</template>
							<template v-else>
								<span>Cashout <span class="m-text-big">{{showCashoutVal}}</span></span>
							</template>

						</af-Button>
					</template>
				</div>

				<!-- cashout 错误提示 -->
				<p
					:class="getErrorStyle"
					v-show="showErrorTips"
				>{{getErrorTips || localErrorTips}}</p>

			</template>
		</template>
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

import { formatNumber, isEmptyObject } from 'utils';

import 'packages/button';
import 'packages/slider';

import * as mutationTypes from 'store/cashout/mutationTypes';

import BetTips from './betTips.vue';

export default {
	name: 'CashoutDetail',

	props: {
		betInfo: {
			type: Object,
			default() {
				return {};
			}
		}
	},

	components: {
		BetTips
	},

	data() {
		return {
			// 显示确认窗
			showConfirm: false,

			cashoutVal: 0,
			showCashoutVal: 0,

			usedStake: 0,
			remainStake: (0).toFixed(2),
			maxCashout: 0,

			// 完成cashout
			done: false,

			// 显示slider
			showPopOver: false,

			// 显示错误信息
			showErrorTips: false,

			// highlight cashout值
			highlight: false,

			// 是否要删除bet
			shouldDeleteBet: true,

			// fefresh loading
			loading4refresh: false,

			// cashout值变化提示
			localErrorTips: ''
		};
	},
	computed: {
		...mapState('cashout', [
			'cashoutDetail',
			'cashoutInfo',
			'currentBetId',
			'minCashoutAmount',
			'maxCashOutAmount',
			'errorInfo',
			'refreshLoading',
			'cashoutLoading'
		]),

		showError() {
			const errorInfo = this.errorInfo || {};

			return errorInfo.type && errorInfo.type === 'replace' || this.betInfo.showTips;
		},

		getTips() {
			const errorInfo = this.errorInfo || {},
				betInfo = this.betInfo;

			let { showTips } = betInfo;

			if (!showTips) {
				showTips = errorInfo.msg;
			}

			return showTips;
		},

		getErrorTips() {
			const errorInfo = this.errorInfo || {};

			if (errorInfo.type === 'inline' || errorInfo.type === 'inline-always') {
				return errorInfo.msg;
			}
		},

		// remain stake只有在滑块显示时才显示
		showRemainStake() {
			return this.showPopOver && this.cashoutInfo.isSupportPartial;
		},

		/*
		格式化显示数据
		 */
		remainStakeShowVal() {
			return this.remainStake && formatNumber(this.remainStake, 2);
		},

		isPartial() {
			const cashoutInfo = this.cashoutInfo || {};
			return cashoutInfo.isSupportPartial ? +this.cashoutVal !== +cashoutInfo.maxCashOutAmount : false;
		},

		getErrorStyle() {
			const errorInfo = this.errorInfo || {},
				colorKey = errorInfo.color ? `m-text--${errorInfo.color}` : '';

			if (colorKey) {
				return [
					'm-text-error',
					colorKey
				];
			}

			return 'm-text-error';
		}
	},
	methods: {
		...mapActions('cashout', {
			requestCashout: 'cashout',
			getBetDetail: 'fetchCashoutDetail'
		}),
		...mapMutations('cashout', {
			updateBetTips: mutationTypes.UPDATEBETTIPS,
			refreshErrorInfo: mutationTypes.REFRESHERRORINFO
		}),

		getAgainst(item) {
			let ret = [];

			item.home && (ret.push(item.home));
			item.away && (ret.push(item.away));

			ret = ret.join(' vs ');

			return item.showPeriod ? `${ret}(${item.showPeriod})` : ret;
		},

		refreshDetail() {
			if (this.loading4refresh) {
				return;
			}

			this.showErrorTips = false;
			this.localErrorTips = '';

			const cashoutInfo = Object.assign(this.cashoutInfo) || {},
				isSupportPartial = cashoutInfo.isSupportPartial || false;

			this.getBetDetail(true).then(res => {
				const cashoutInfo = this.cashoutInfo || {},
					cashoutAvailable = cashoutInfo.cashoutAvailable || true,
					cashoutVal = +cashoutInfo.maxCashOutAmount || 0,
					currentPartal = cashoutInfo.isSupportPartial;

				if (cashoutInfo.errorMsg && !this.showError) {
					this.showErrorTips = true;
					this.showPopOver = false;
				}

				// cashout、部分cashout没有展开slider，均显示最新值
				if (!isSupportPartial || !this.showPopOver) {
					// 重置cashout值与显示值
					this.showCashoutVal = cashoutInfo.showCashoutVal;
					this.cashoutVal = cashoutVal;

					// 更新remainstake
					this.remainStake = (0).toFixed(2);
					this.maxCashout = cashoutVal;
					return;
				}

				// partial( <=100或者---): 收起slider, 提示
				if (this.showPopOver &&
					(!cashoutAvailable || cashoutVal <= this.minCashoutAmount || cashoutVal > this.maxCashOutAmount || !currentPartal)) {
					// 重置cashout值与显示值
					this.showCashoutVal = cashoutInfo.showCashoutVal;
					this.cashoutVal = cashoutVal;

					// 更新remainstake
					this.remainStake = (0).toFixed(2);
					this.maxCashout = cashoutVal;

					this.showPopOver = false;
					this.showErrorTips = true;

					return;
				}

				// partial( >100 ): 保持slider，按比例重算amount和remain
				if (this.showPopOver && cashoutVal > this.minCashoutAmount) {
					// TODO: 重算amount和remain
					this.calStake();
				}
			});
		},

		handleCashout() {
			if (this.loading4refresh) {
				return;
			}

			this.showErrorTips = false;
			this.localErrorTips = '';

			const cashoutVal = this.cashoutVal;

			// partial(slider展开)：收起slider，显示确认窗
			if (this.showPopOver) {
				this.showPopOver = false;
				this.showConfirm = true;
				return;
			}

			// cashout 或 partial(slider收起)
			if (cashoutVal >= this.minCashoutAmount && cashoutVal <= this.maxCashOutAmount) {
				// >=100: 显示确认窗
				this.showConfirm = true;
			} else {
				// <100或者无金额: 提示
				this.showErrorTips = true;
			}
		},

		cancelCashout() {
			/*
			关闭确认窗，显示新值
			 */
			this.showConfirm = false;
		},

		/*
		toggle滑块状态
		 */
		selectCashout() {
			if (this.loading4refresh) {
				return;
			}

			this.showErrorTips = false;
			this.localErrorTips = '';

			// 不可以cashout，提示，不展开slider
			const cashoutInfo = this.cashoutInfo || {},
				cashoutAvailable = cashoutInfo.cashoutAvailable || true,
				maxCashOutAmount = cashoutInfo.maxCashOutAmount || 0;

			if (!cashoutAvailable ||
				maxCashOutAmount <= this.minCashoutAmount ||
				maxCashOutAmount > this.maxCashOutAmount) {
				this.showErrorTips = true;
				return;
			}

			this.showPopOver = !this.showPopOver;
		},

		commitCashout() {
			const cashoutInfo = Object.assign(this.cashoutInfo) || {},
				isSupportPartial = cashoutInfo.isSupportPartial || false,
				cashoutVal = this.cashoutVal,
				isPartial = this.isPartial;

			// fetch cashout
			const params = isSupportPartial ?
			{
				usedStake: this.usedStake + '',
				amount: this.cashoutVal + ''
			} :
				null;

			this.showErrorTips = false;
			this.localErrorTips = '';

			this.highlight = false;

			this.requestCashout(params)
			.then(res => {
				// 网络错误，收起confirm
				if (res.netError) {
					this.showConfirm = false;
					this.showErrorTips = true;
					return;
				}

				if (cashoutInfo.errorMsg && !this.showError) {
					this.showErrorTips = true;
					this.showConfirm = false;
				}

				const maxCashOutAmount = +res.maxCashOutAmount || 0,
					remainCount = +res.remainCount || 0;

				const newCashoutInfo = this.cashoutInfo || {},
					cashoutAvailable = newCashoutInfo.cashoutAvailable || true;

				if (isEmptyObject(res)) {
					this.showConfirm = false;
					if (this.errorInfo.msg) {
						this.showErrorTips = true;
						// 更新cashout及showCashoutVal
						this.showCashoutVal = newCashoutInfo.showCashoutVal;
						this.cashoutVal = maxCashOutAmount;
					}
					return;
				}

				// cashout或者partial的全部cashout： 成功
				if (newCashoutInfo.done) {
					this.done = true;
					this.showConfirm = false;
					return;
				}

				if (isPartial) {
					if (!newCashoutInfo.cashoutFaild) {
						// 更新cashout及showCashoutVal
						this.showCashoutVal = newCashoutInfo.showCashoutVal;
						this.cashoutVal = maxCashOutAmount;

						// partail(剩余次数为0)： ok不删除bet
						if (!remainCount) {
							this.shouldDeleteBet = false;
							this.showConfirm = false;
							return;
						}

						this.maxCashout = maxCashOutAmount;
						this.remainStake = (0).toFixed(2);
						this.showConfirm = false;
						this.showErrorTips = true;
						return;
					}

					// partail( >本地值：partail值不变，矫正remain stake )
					if (maxCashOutAmount >= cashoutVal && cashoutAvailable && maxCashOutAmount <= this.maxCashOutAmount) {
						// TODO: 矫正remain stake
						this.maxCashout = maxCashOutAmount;
						this.calStake(cashoutVal);
						this.highlight = true;
						return;
					}

					// partail( <本地值，但是>100 | <=100 | cashout不可用 ): 关闭确认窗，提示
					if (!cashoutAvailable ||
						maxCashOutAmount <= this.minCashoutAmount ||
						(maxCashOutAmount > this.minCashoutAmount && maxCashOutAmount < cashoutVal) ||
						maxCashOutAmount > this.maxCashOutAmount) {
						// 更新cashout及showCashoutVal
						this.showCashoutVal = newCashoutInfo.showCashoutVal;
						this.cashoutVal = maxCashOutAmount;
						this.maxCashout = maxCashOutAmount;
						this.remainStake = (0).toFixed(2);

						this.showConfirm = false;
						this.localErrorTips = 'Partial Cashout amount unavailable, please choose again';
						this.showErrorTips = true;

						return;
					}
				}

				// 更新cashout及showCashoutVal
				this.showCashoutVal = newCashoutInfo.showCashoutVal;
				this.cashoutVal = maxCashOutAmount;

				// 支持部分cashout情况下的cashout
				this.maxCashout = maxCashOutAmount;
				this.remainStake = (0).toFixed(2);

				// cashout( >=100且不等 ): 确认窗显示新值
				if (maxCashOutAmount >= this.minCashoutAmount && maxCashOutAmount !== cashoutVal) {
					this.highlight = true;
					return;
				}

				// cashout( <100或者--- ): 不显示确认框，且提示
				if (!cashoutAvailable ||
					maxCashOutAmount < this.minCashoutAmount ||
					maxCashOutAmount > this.maxCashOutAmount) {
					this.showConfirm = false;
					this.showErrorTips = true;
				}
			});
		},

		/*
		更新remainStake和usedStake
		 */
		calStake(oldCashoutVal) {
			const cashoutInfo = this.cashoutInfo || {},
				coefficient = +cashoutInfo.coefficient || 0,
				maxCashOutAmount = +cashoutInfo.maxCashOutAmount || 0,
				isSupportPartial = cashoutInfo.isSupportPartial || false,
				cashoutAvailable = cashoutInfo.cashoutAvailable || true,
				maxCashout = this.maxCashout;

			if (!isSupportPartial) {
				return;
			}

			if (!cashoutAvailable) {
				this.usedStake = 0;
				this.remainStake = (0).toFixed(2);

				return;
			}

			if (maxCashout !== maxCashOutAmount) {
				this.remainSliderPos(maxCashOutAmount, maxCashout);
				this.maxCashout = maxCashOutAmount;
			}

			const cashoutVal = oldCashoutVal || this.cashoutVal;
			if (cashoutVal !== maxCashOutAmount) {
				let stake = cashoutVal / coefficient;

				stake = stake.toFixed(2);

				// 超过最大值，还原为最大值
				stake = Math.min(cashoutInfo.availableStake, stake);
				this.usedStake = stake;
			} else {
				this.usedStake = cashoutInfo.availableStake;
			}

			this.remainStake = (this.betInfo.stake - this.usedStake).toFixed(2);
		},

		remainSliderPos(newMax, oldMax) {
			// 按比例重置cashoutVal的值
			if (oldMax && this.cashoutVal) {
				const ratio = this.cashoutVal / oldMax;

				this.cashoutVal = (newMax * ratio).toFixed(2);

				// 修正显示的cashout值
				this.showCashoutVal = formatNumber(this.cashoutVal, 2);
			}
		},
		closeTips() {
			this.updateBetTips('');
			this.shouldDeleteBet = true;
		}
	},
	watch: {
		/*
		slider显示的情况下，cashoutVal值变化时，更新usedStake和remainStake
		 */
		cashoutVal(val, oldVal) {
			if (this.showPopOver) {
				// 重新计算remainStake和usedStake
				this.calStake();

				// 设置显示值
				this.showCashoutVal = formatNumber(val, 2);
			}
		},

		/*
		错误信息显示5s消息
		 */
		showErrorTips(val, oldVal) {
			if (val) {
				const errorInfo = this.errorInfo || {};
				if (errorInfo.type === 'inline-always') {
					return;
				}

				this.$nextTick(() => {
					setTimeout(() => {
						this.showErrorTips = false;

						if (this.localErrorTips) {
							this.localErrorTips = '';
						}

						// 如果是部分cashout，cashout成功，错误提示重新计算
						this.refreshErrorInfo();
					}, 5000);
				});
			}
		},

		/*
		cashout值高亮5s消息
		 */
		highlight(val, oldVal) {
			if (val) {
				this.$nextTick(() => {
					setTimeout(() => {
						this.highlight = false;
					}, 5000);
				});
			}
		},

		/*
		refresh loading
		 */
		refreshLoading(val, oldVal) {
			if (!val && oldVal) {
				setTimeout(() => {
					this.loading4refresh = this.refreshLoading;
				}, 500);
			} else {
				this.loading4refresh = this.refreshLoading;
			}
		}
	},
	mounted() {
		const cashoutInfo = this.cashoutInfo || {},
			maxCashOutAmount = +cashoutInfo.maxCashOutAmount || 0;

		this.cashoutVal = maxCashOutAmount;
		this.showCashoutVal = cashoutInfo.showCashoutVal;
		this.maxCashout = maxCashOutAmount;
		this.usedStake = cashoutInfo.availableStake;
		this.showErrorTips = !!cashoutInfo.errorMsg && !this.showError;
	}
};
</script>
