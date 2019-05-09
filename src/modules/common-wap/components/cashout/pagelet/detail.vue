<template lang="html">
	<div>
		<template v-if="betInfo.showTips">
			<BetTips
				:showTips="betInfo.showTips"
				:betId="betInfo.id"
				:shouldDeleteBet="shouldDeleteBet"
				@close-tips="closeTips"
			/>
		</template>

		<template v-else>
			<div
				v-for="item in cashoutDetail"
				:key="item.id"
				class="m-bet-detail">
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
					<span>
						<em>{{item.home}}</em><em class="m-vs"> vs </em><em>{{item.away}}</em>
						<em v-if="item.showPeriod">({{item.showPeriod}})</em>
					</span>
				</div>

				<div class="m-score">
					<span>{{item.showScore}}</span>
				</div>

				<div class="m-comment" v-if="item.isLiveEvent && item.haveLive === true" @click.stop="seeEventDetail(item)">
					<span>Go to Live Betting{{ commentsInfo[item.eventId] ? '(Chat ' + commentsInfo[item.eventId] + ' )' : '' }}</span>
					<i class="m-icon-more"></i>
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
			<!-- 按钮条 -->
			<template >
				<div :class="['m-btn-wrapper']">
					<!-- 成功态 -->
					<template v-if="done">
						<af-Button
							key="succBtn"
							extraType='success'
							class="m-btn--success"
						><em class="m-succ-icon"></em>Cashout {{showCashoutVal}}</af-Button>
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
									'm-btn-item--open': showPopOver
								}
							]"
						>
							<i
								class="m-icon-partial"
								@click.self="selectCashout"
							></i>
						</div>

						<af-Button
							key="optBtn"
							extraType='primary'
							@click="handleCashout"
							:class="[
								'af-button--opt',
							]"
						>
							<template v-if="cashoutInfo.isSupportPartial">
								<span class="m-text-big">Cashout {{showCashoutVal}}</span><br>
								<span class="m-text-small" v-if ="isShowPartialRemainStake">Remaining Stake {{remainStakeShowVal}}</span>
							</template>
							<template v-else>
								<span class="m-text-big">Cashout {{showCashoutVal}}</span>
							</template>

						</af-Button>
					</template>
				</div>
				<div
					class="m-pop-slider-wrapper"
					v-if="showPopOver">
					<div class="m-pop-arrow"></div>
					<div class="m-pop-wrapper">
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
					</div>
				</div>
			</template>
		</template>
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { formatNumber, isEmptyObject } from 'utils';
import 'packages/button';
import 'packages/slider';
import { baseUrl } from 'config/pageConfig';
import * as mutationTypes from 'store/cashout/mutationTypes';
import { showCurrency } from 'config/currencyConfig';
import { sportsConfigById } from 'config/sports';

import ConfirmPop from './confirmPop';
import BetTips from './betTips.vue';

export default {
	name: 'CashoutDetail',

	props: {
		betInfo: {
			type: Object,
			default () {
				return {};
			}
		}
	},

	components: {
		BetTips
	},

	data () {
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

			// 是否要删除bet
			shouldDeleteBet: true,

			// fefresh loading
			loading4refresh: false,

			// cashout值变化提示
			localErrorTips: '',
			// 如果确认弹窗金额发生变化，强制高亮
			highlight: false,
			// 是否显示remainStake，在partialCashout的情况下
			isShowPartialRemainStake: false,
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
			'cashoutLoading',
			'commentsInfo'
		]),

		// 直接显示一个不能cashout的界面，点击后会删除当前的条目
		// showError () {
		// 	return this.betInfo.showTips;
		// },
		// toast提示错误 通过showErrorTips控制
		getErrorTips () {
			const cashoutInfo = this.cashoutInfo || {};
			if (cashoutInfo.errorMsg) {
				return cashoutInfo.errorMsg;
			}

			if (this.localErrorTips) {
				return this.localErrorTips;
			}
			const errorInfo = this.errorInfo || {};
			if (errorInfo.type === 'dialog') {
				return errorInfo.msg;
			}
		},

		// remain stake只有在滑块显示时才显示
		showRemainStake () {
			return this.showPopOver && this.cashoutInfo.isSupportPartial;
		},

		/*
		 格式化显示数据
		 */
		remainStakeShowVal () {
			return this.remainStake && formatNumber(this.remainStake, 2);
		}
	},
	methods: {
		...mapActions('cashout', {
			requestCashout: 'cashout',
			getBetDetail: 'fetchCashoutDetail'
		}),
		...mapMutations('cashout', {
			updateBetTips: mutationTypes.UPDATEBETTIPS
		}),
		refreshDetail () {
			if (this.loading4refresh) {
				return;
			}
			// 点击刷新按钮恢复默认状态
			this.getBetDetail(true).then(res => {
				const cashoutInfo = this.cashoutInfo || {},
					cashoutVal = +cashoutInfo.maxCashOutAmount || 0;

				this.showCashoutVal = cashoutInfo.showCashoutVal;
				this.cashoutVal = cashoutVal;
				this.maxCashout = cashoutVal;
				this.usedStake = cashoutInfo.availableStake;
				this.remainStake = (0).toFixed(2);
				this.isShowPartialRemainStake = false;

				if (cashoutInfo.errorMsg) {
					this.showErrorTips = true;
				}

				// 隐藏滑条
				if (this.showPopOver) {
					this.showPopOver = false;
				}
			});
		},
		handleCashout () {
			if (this.loading4refresh) {
				return;
			}
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
		cancelCashout () {
			/*
			关闭确认窗，显示新值
			 */
			this.showConfirm = false;
		},

		/*
		toggle滑块状态
		 */
		selectCashout () {
			if (this.loading4refresh) {
				return;
			}
			// 不可以cashout，提示，不展开slider
			const cashoutInfo = this.cashoutInfo || {},
				cashoutAvailable = cashoutInfo.cashoutAvailable || true,
				maxCashOutAmount = cashoutInfo.maxCashOutAmount || 0;

			if (!cashoutAvailable ||
				maxCashOutAmount <= this.minCashoutAmount ||
				maxCashOutAmount > this.maxCashOutAmount) {
				// 强制错误提示是 partial 错误，在点击打开滑动条按钮的时候
				this.localErrorTips = this.getLocalErrorInfo(true);
				this.showErrorTips = true;
				return;
			}
			if (!this.showPopOver && !this.isShowPartialRemainStake) {
				this.isShowPartialRemainStake = true;
			}
			this.showPopOver = !this.showPopOver;
		},

		commitCashout () {
			const cashoutInfo = Object.assign(this.cashoutInfo) || {},
				isSupportPartial = cashoutInfo.isSupportPartial || false,
				cashoutVal = this.cashoutVal;

			// fetch cashout
			const params = isSupportPartial ?
			{
				usedStake: this.usedStake + '',
				amount: this.cashoutVal + ''
			} :
				null;
			this.requestCashout(params)
				.then(res => {
					// 网络错误，收起confirm
					if (res.netError) {
						this.showErrorTips = true;
						return;
					}
					const maxCashOutAmount = +res.maxCashOutAmount || 0,
						remainCount = +res.remainCount || 0;

					const newCashoutInfo = this.cashoutInfo || {},
						cashoutAvailable = newCashoutInfo.cashoutAvailable || true;

					if (cashoutInfo.errorMsg) {
						this.showErrorTips = true;
						this.showConfirm = false;
					}

					if (isEmptyObject(res)) {
						if (this.errorInfo.msg) {
							this.showErrorTips = true;
							// 更新cashout及showCashoutVal
							this.showCashoutVal = newCashoutInfo.showCashoutVal;
							this.cashoutVal = maxCashOutAmount;
							this.maxCashout = maxCashOutAmount;
						}
						return;
					}
					// cashout或者partial的全部cashout： 成功
					if (newCashoutInfo.done) {
						this.done = true;
						return;
					}
					// 如果用户所选金额就是最大，当成是全部cashout，不走这部分逻辑
					if (isSupportPartial && cashoutVal !== this.maxCashout) {
						if (!newCashoutInfo.cashoutFaild) {
							// 更新cashout及showCashoutVal
							this.showCashoutVal = newCashoutInfo.showCashoutVal;
							this.cashoutVal = maxCashOutAmount;
							this.maxCashout = maxCashOutAmount;
							// partail(剩余次数为0)： ok不删除bet
							if (!remainCount) {
								this.shouldDeleteBet = false;
								return;
							}
							this.remainStake = (0).toFixed(2);
							this.showErrorTips = true;
							return;
						}

						// partail( >本地值：partail值不变，矫正remain stake )
						// 重新尝试cashout
						if (maxCashOutAmount >= cashoutVal && cashoutAvailable && maxCashOutAmount <= this.maxCashOutAmount) {
							// TODO: 矫正remain stake
							this.maxCashout = maxCashOutAmount;
							this.calStake(cashoutVal);
							this.highlight = true;
							this.showConfirm = true;
							return;
						}

						// partail( <本地值，但是>100 | <=100 | cashout不可用 )
						// 当前最大cashout值<可以的cashout值,当前cashout值大于最大可以cashout的值，或者当前cashout值小于等于系统最小cashout值
						if (!cashoutAvailable ||
							maxCashOutAmount <= this.minCashoutAmount ||
							maxCashOutAmount > this.maxCashOutAmount ||
							(maxCashOutAmount > this.minCashoutAmount && maxCashOutAmount < cashoutVal)) {
							// 更新cashout及showCashoutVal
							// 恢复成cashout
							this.showCashoutVal = newCashoutInfo.showCashoutVal;
							this.cashoutVal = maxCashOutAmount;
							this.maxCashout = maxCashOutAmount;
							this.remainStake = (0).toFixed(2);
							if (maxCashOutAmount <= this.minCashoutAmount ||
							maxCashOutAmount > this.maxCashOutAmount) {
								this.localErrorTips = this.getLocalErrorInfo(true);
							} else {
								this.localErrorTips = 'Partial Cashout amount unavailable, please choose again';
							}
							this.isShowPartialRemainStake = false;
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

					// 不可以cashout或者cashout下于最小值，或者大于最大值
					if (!cashoutAvailable ||
						maxCashOutAmount < this.minCashoutAmount ||
						maxCashOutAmount > this.maxCashOutAmount) {
						this.showErrorTips = true;
						return;
					}
					// cashout( >=100且不等 ): 确认窗显示新值---重新显示弹窗
					if (maxCashOutAmount >= this.minCashoutAmount && maxCashOutAmount !== cashoutVal) {
						this.showConfirm = true;
						this.highlight = true;
					}
				});
		},

		/*
		更新remainStake和usedStake
		 */
		calStake (oldCashoutVal) {
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

				// 超过最大值，还原为最大值
				stake = Math.min(cashoutInfo.availableStake, stake);
				this.usedStake = stake.toFixed(2);
			} else {
				this.usedStake = cashoutInfo.availableStake;
			}

			this.remainStake = (this.betInfo.stake - this.usedStake).toFixed(2);
		},

		remainSliderPos (newMax, oldMax) {
			// 按比例重置cashoutVal的值
			if (oldMax && this.cashoutVal) {
				const ratio = this.cashoutVal / oldMax;

				this.cashoutVal = (newMax * ratio).toFixed(2);

				// 修正显示的cashout值
				this.showCashoutVal = formatNumber(this.cashoutVal, 2);
			}
		},
		closeTips () {
			this.updateBetTips('');
			this.shouldDeleteBet = true;
		},
		// 根据当前用户选择的cashout类型确定当前是否有错误提示
		getLocalErrorInfo (isForceParital) {
			// 到底是不是partial
			let isHavePartial = false;
			let err = '';
			const cashoutInfo = this.cashoutInfo;
			const max = this.maxCashOutAmount;
			const min = this.minCashoutAmount;
			const maxCashout = this.maxCashout;
			if (cashoutInfo.cashoutAvailable === false) {
				return err;
			}
			if (isForceParital ||
				(cashoutInfo.isSupportPartial &&
				this.isShowPartialRemainStake &&
				this.cashoutVal !== this.maxCashout)) {
				isHavePartial = true;
			}
			if (!cashoutInfo.maxCashOutAmount || !cashoutInfo.coefficient) {
				err = `${isHavePartial ? 'Partial ' : ''}Cashout unavailable, please refresh.`;
			}
			if (maxCashout < min) {
				err = isHavePartial ?
				`Partial Cashout only available over ${showCurrency}${min}, please refresh.` :
				`Cashout unavailable under ${showCurrency}${min}, please refresh.`;
			}
			if (maxCashout > max) {
				err = isHavePartial ?
				`Partial Cashout unavailable over ${showCurrency}${formatNumber(max)}, please refresh.` :
				`Cashout unavailable over ${showCurrency}${formatNumber(max)}, please refresh.`;
			}
			return err;
		},
		seeEventDetail(item) {
			const { product = -1, eventId = '', sportId = '', categoryId = '', tournamentId = '' } = item || {};

			const sportName = sportsConfigById[sportId].name;

			if (!sportName || !eventId || !sportId || !categoryId || !tournamentId || !~product) {
				return;
			}
			// 只有live状态下才会显示这个按钮，所以跳转链接一定是live
			location.href = `${baseUrl}sport/${sportName}/live/${categoryId}/${tournamentId}/${eventId}`;
		}
	},
	watch: {
		showPopOver (val) {
			// 如果显示了popOver，则一定让其滚动到可以看到的地方
			if (val) {
				this.$nextTick(() => {
					const popSlider = this.$el.querySelector('.m-pop-slider-wrapper');
					if (popSlider && popSlider.scrollIntoView) {
						popSlider.scrollIntoView(false);
					}
				});
			}
		},
		// 弹出确认弹出
		showConfirm (val) {
			if (val) {
				const contentData = {
					showCashoutVal: this.showCashoutVal,
					remainStakeShowVal: this.remainStakeShowVal,
					highlight: this.highlight,
					isSupportPartial: this.cashoutInfo.isSupportPartial ? +this.cashoutVal !== +this.maxCashout : false
				};
				this.highlight = false;
				this.$dialog({
					title: 'Cashout',
					'class': 'm-cashout-confirm',
					content: ConfirmPop,
					contentData,
					button: [
						'Cancel',
						'Confirm'
					]
				})
					.onBtnClick(ret => {
						ret = +ret;
						if (ret === 0) {
							this.cancelCashout();
						} else {
							this.commitCashout();
						}
						this.showConfirm = false;
					});
			}
		},
		/*
		slider显示的情况下，cashoutVal值变化时，更新usedStake和remainStake
		 */
		cashoutVal (val, oldVal) {
			if (this.showPopOver) {
				// 重新计算remainStake和usedStake
				this.calStake();

				// 设置显示值
				this.showCashoutVal = formatNumber(val, 2);
			}
		},
		/*
			toast错误信息显示
		 */
		showErrorTips (val, oldVal) {
			if (val) {
				this.$nextTick(() => {
					if (this.betInfo.showTips) {
						this.showErrorTips = false;
						return;
					}

					this.$toast(this.getErrorTips || this.getLocalErrorInfo() || 'Cashout unavailable, please refresh.')
						.onClose(() => {
							const localErr = this.getLocalErrorInfo();
							if (this.localErrorTips) {
								this.localErrorTips = '';
							}
							if (localErr) {
								this.localErrorTips = localErr;
							}

							this.showErrorTips = false;
						});
				});
			}
		},

		/*
		refresh loading
		 */
		refreshLoading (val, oldVal) {
			if (!val && oldVal) {
				setTimeout(() => {
					this.loading4refresh = this.refreshLoading;
				}, 500);
			} else {
				this.loading4refresh = this.refreshLoading;
			}
		},
		cashoutLoading (val) {
			if (val) {
				this.__cashOutLoading = this.$dialog({
					title: null,
					'class': 'm-submit-pop',
					content: {
						render (h) {
							return h('div', {
								'class': 'm-submit',
							}, [
								'submitting'
							]);
						}
					},
					button: []
				});
			} else if (this.__cashOutLoading) {
				this.__cashOutLoading.close();
			}
		}
	},
	mounted () {
		const cashoutInfo = this.cashoutInfo || {},
			maxCashOutAmount = +cashoutInfo.maxCashOutAmount || 0;
		this.cashoutVal = maxCashOutAmount;
		this.showCashoutVal = cashoutInfo.showCashoutVal;
		this.maxCashout = maxCashOutAmount;
		this.usedStake = cashoutInfo.availableStake;
		this.showErrorTips = !!cashoutInfo.errorMsg;
	}
};
</script>
