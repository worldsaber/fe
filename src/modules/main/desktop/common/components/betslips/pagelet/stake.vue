<template lang="html">
	<div>
		<div class="m-stake-tips" v-if="hasMutexGroup && !isSingle">
			<i class="m-icon--tips"></i>
			<span>You have selected contingent outcomes.</span>
		</div>
		<div class="m-plays-wrapper">
			<div
				v-if="isSystem && stakeUnion.length>1"
				class="m-opt-assist"
			>
				<div class="m-label">Play All</div>
				<div class="m-content">
					<span class="m-s-unit">{{showCurrency}}</span>
					<AfInput
						v-model="unionStake"
						:error="!!unionErrorInfo"
						:placeholder="'min. ' + minStake"
						@change="unionifyStake"
						@blur="checkUnionStake($event)"
						@input="setCheckStatus"
						@focus="changeActiveIn('unionStake')"
						id="j_unionStake"
					/>
				</div>
				<p
					v-if="unionErrorInfo"
					class="m-text-error"
				>{{unionErrorInfo}}</p>
			</div>
			<div class="m-plays">
				<template v-if="showTitle">
					<div class="m-plays-title">
						<div class="m-type">Type</div>
						<div class="m-num">No.</div>
						<div class="m-money">Stake({{showCurrencyFix}})</div>
					</div>

					<div
						v-for="(stakeItem, index) in stakeUnion"
						:key="stakeItem.name"
						class="m-plays-item"
						:id="`j_stake_${index}`"
					>
						<div class="m-line-wrapper">
							<div class="m-type">{{stakeItem.name}}</div>
							<div class="m-num">{{stakeItem.count || ''}}</div>
							<div class="m-money">
								<AfInput
									v-model="stake[index]"
									:placeholder="'min. ' + minStake"
									@change="modifyStake"
									:data-index="index"
									:error="showUniqueStakeError(index)"
									@blur="checkUniqueStake($event, index)"
									@input="setCheckStatus"
									@focus="changeActiveIn('stake_'+index)"
								/>
							</div>
						</div>
						<p
							v-show="showUniqueStakeError(index) && !errorInfo.sumMsg"
							class="m-error-tips"
						>{{getUniqueErrorMsg(index)}}</p>
					</div>
				</template>

				<template v-else>
					<div class="m-plays-item">
						<div class="m-line-wrapper">
							<div class="m-label">Total Stake</div>
							<div class="m-value">
								<span>{{showCurrency}}</span>
								<AfInput
									v-model="stake[0]"
									:placeholder="'min. ' + minStake"
									@change="modifyStake"
									:data-index="0"
									:error="showUniqueStakeError(0)"
									@blur="checkUniqueStake($event, 0)"
									@input="setCheckStatus"
									@focus="changeActiveIn('stake_0')"
									id="j_stake_0"
								/>
							</div>
						</div>
						<p
							v-show="showUniqueStakeError(0) && !errorInfo.sumMsg"
							class="m-error-tips"
						>{{getUniqueErrorMsg(0)}}</p>
					</div>
				</template>

			</div>
		</div>
		<Tips
			v-if="actionTips"
			type="error"
			:msg="actionTips"
		/>
		<Tips
			v-else-if="errorInfo.sumMsg"
			type="error"
			:msg="errorInfo.sumMsg"
		/>
		<Coins v-show="showCoins" :coins="coins"/>
		<FlexiBet v-show="showFlexibetBar" />
		<div class="m-money-wrapper">
			<div
				v-if="isMultiple"
			>
				<div class="m-label m-label-fix">Odds</div>
				<div class="m-value m-value-fix">{{showMultipleOdds}}</div>
			</div>
			<div
				v-if="showTitle"
			>
				<div class="m-label">Total Stake</div>
				<div class="m-value">{{getTotalStake}}</div>
			</div>
			<Coupons :totalStake="calTotalStake"/>
			<div v-if="showBonus">
				<div class="m-label">Max. Bonus</div>
				<div class="m-value">{{getShowBonus}}</div>
			</div>
			<div>
				<div class="m-label">Potential Win</div>
				<div class="m-value">{{earnings}}</div>
			</div>
		</div>

		<div class="m-btn-wrapper">
			<af-Button
				v-if="betLoading"
				extraType='text'
				:disabled="!submitStatus"
				:loading="true"
				class="m-btn--submit"
			>Submitting...</af-Button>

			<template v-else>
				<af-Button
					v-if="!acceptStatus"
					extraType='primary'
					:disabled="!submitStatus"
					:loading="false"
					@click="commitBet"
				>Place Bet</af-Button>

				<af-Button
					v-else
					extraType='primary'
					@click="accpetChanges"
				>Accept Changes</af-Button>
			</template>
		</div>

		<!-- 确认框 -->
		<template v-if="showComfirm">
			<div
				class="m-comfirm-wrapper"
				:style="getConfirmStyle"
			>
				<div>
					<div class="m-content-wrapper">
						<div class="m-label">{{getConfirmTitle}}</div>
						<div class="m-value">{{showCurrency}}<span class="m-money">{{getShowPayMoney}}</span></div>
					</div>

					<!-- flexibet -->
					<template v-if="isFlexi">
						<div class="m-line">
							<div class="m-line-label m-line-label-fix">Options to be Correct</div>
							<div class="m-line-value">{{flexiSelect}} of {{flexiThreshold}}</div>
						</div>
						<div class="m-line">
							<div class="m-line-label">Total Odds</div>
							<div class="m-line-value">{{showMultipleOdds}}</div>
						</div>
						<div class="m-line">
							<div class="m-line-label">Potential Win</div>
							<div class="m-line-value">{{earnings}}</div>
						</div>
					</template>

					<div class="m-btn-wrapper">
						<af-Button
							extraType='text'
							@click="cancelPlaceBet"
						>Cancel</af-Button>
						<af-Button
							extraType='primary'
							@click="commitPlaceBet"
						>Confirm</af-Button>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

import 'packages/input';
import 'packages/button';

import { formatNumber } from 'utils';
import 'utils/dom';

import * as mutationTypes from 'store/betslipStake/mutationTypes';
import * as couponMutationTypes from 'store/coupons/mutationTypes';
import { UPDATEPAYMETHOD } from 'store/betslip/mutationTypes';
import { payConfirmTxt } from 'config/payConfig';

import Tips from 'components/tips/index';

import 'components/coupons';

import { createOrderTips } from '../js/config';

import PopTips from './popTips.vue';
import FlexiBet from './flexiBet.vue';
import Coins from './coins.vue';

export default {
	name: 'BetslipsStake',

	props: {
		coins: {
			type: [String, Number],
			'default': 0
		}
	},

	components: {
		Tips,
		FlexiBet,
		Coins
	},

	data() {
		return {
			stake: [],
			unionStake: this.uStake || '',
			errorInfo: {},
			loading: false,
			hasError: false,
			showComfirm: false,
			isReady: false,
			canCheckStake: false,		// 输入框失去焦点或者tab切换时，检测stake的值,(12/26增加enter健)
			activeInput: '',
			actionTips: ''
		};
	},

	computed: {
		...mapState('betslip', [
			'currentType',
			'acceptStatus',
			'flexiSelect',
			// 'flexLimit',
			'oddsThreshold'
		]),
		...mapState('betslipStake', [
			'showCurrency',
			'showCurrencyFix',
			'minStake',
			'maxStake',
			'maxPotWin',
			'betLoading'
		]),
		...mapGetters('betslipStake', [
			'uStake',
			'stakeUnion',
		]),
		...mapGetters('betslip', [
			'canBet',
			'getBetCount',
			'hasMutexGroup',
			'getSelectList',
			'isSupportFlexiBet',
			'flexiThreshold',
			'isFlexi',
			'isSupportCoins',
			'getCurrentPayMethods'
		]),
		...mapGetters('coupons', [
			'getCouponInfo',
			'checkItem',
			'checkGiftId'
		]),
		...mapState('coupons', [
			'clickedGiftId'
		]),
		...mapState('bonus', [
			'maxBonus'
		]),
		isMultiple() {
			return this.currentType === 'multiple';
		},
		isSystem() {
			return this.currentType === 'system';
		},
		isSingle() {
			return this.currentType === 'single';
		},
		showMultipleOdds() {
			const stakeUnion = this.stakeUnion || [];

			return stakeUnion && stakeUnion.length && stakeUnion[0].odds || '';
		},
		showFlexibetBar() {
			// return this.isMultiple && this.isSupportFlexiBet && this.flexiThreshold >= this.flexLimit;
			return this.isMultiple && this.isSupportFlexiBet;
		},
		showCoins() {
			return this.isSupportCoins && +this.coins;
		},
		getConfirmTitle() {
			const isFlexi = this.isFlexi,
				getCurrentPayMethods = this.getCurrentPayMethods;

			if (isFlexi) {
				return 'Confirm to Pay?';
			}

			let showTxt = payConfirmTxt[getCurrentPayMethods];
			showTxt = showTxt ? ` ${showTxt}` : '';
			return `About to Pay${showTxt}?`;
		},
		unionErrorInfo() {
			if (this.errorInfo.union) {
				return this.errorInfo.union || '';
			}

			return '';
		},
		submitStatus() {
			// 有错误、无选项
			if (this.hasError || !this.stakeUnion.length) {
				return false;
			}

			// 无值
			if (!this.calTotalStake) {
				return true;
			}

			// 全部unavailable和suspended状态, 不可place bet
			if (!this.canBet) {
				return false;
			}

			let ret = false;
			const stake = this.stake || [];
			for (const stakeItem of stake) {
				if (stakeItem) {
					ret = true;
					break;
				}
			}

			return ret;
		},

		// total stake
		calTotalStake() {
			let ret = 0;
			for (const stakeItem of this.stakeUnion) {
				if (stakeItem.count && stakeItem.stake) {
					ret += stakeItem.count * stakeItem.stake;
				}
			}

			return ret;
		},

		// 格式totalStake
		getTotalStake() {
			const ret = this.calTotalStake;

			return ret ? formatNumber(ret, 2) : 0;
		},

		// pot win
		earnings() {
			let min = [],
				sum = [];
			for (const stakeItem of this.stakeUnion) {
				const tempStake = stakeItem.stake;
				if (tempStake) {
					min.push(stakeItem.min * tempStake);
					sum.push(stakeItem.sum * tempStake);
				}
			}

			if (!min.length || !sum.length) {
				return 0;
			}

			min.sort((a, b) => a - b);
			min = min[0];

			let total = sum.reduce((temp, item) => temp += +item, 0);

			// 12/22 pot win包含bonus(只将bonus加到max pot win上)
			const bonus = this.getBonus;

			if (min === total) {
				total += bonus;

				total = total > this.maxPotWin ? this.maxPotWin : total;
				return `${formatNumber(total, 2)}`;
			}

			total += bonus;

			total = total > this.maxPotWin ? this.maxPotWin : total;
			min = min > this.maxPotWin ? this.maxPotWin : min;

			return min === total ? `${formatNumber(total, 2)}` : `${formatNumber(min, 2)} ~ ${formatNumber(total, 2)}`;
		},

		// 确认支付金额
		getPayMoney() {
			if (this.checkGiftId) {
				const money = this.calTotalStake * 10000 - this.checkItem.originBal;
				return money > 0 ? money : 0;
			}

			return this.calTotalStake * 10000;
		},

		getShowPayMoney() {
			return formatNumber(this.getPayMoney / 10000, 2);
		},

		showTitle() {
			return this.getBetCount > 1;
		},

		showBonus() {
			if (this.isFlexi) {
				return;
			}

			let hasBonus = false;

			const stakeUnion = this.stakeUnion || [];
			for (const stakeItem of stakeUnion) {
				if (stakeItem.bonusRatio) {
					hasBonus = true;
					break;
				}
			}

			return hasBonus;
		},

		getBonus() {
			if (this.isFlexi) {
				return 0;
			}

			const stakeUnion = this.stakeUnion || [];
			let ret = 0;
			for (const stakeItem of stakeUnion) {
				ret += stakeItem.bonusRatio * (stakeItem.stake || 0);
			}

			// ret /= 100;

			ret = ret > this.maxBonus ? this.maxBonus : ret;

			return ret;
		},

		getShowBonus() {
			return this.isFlexi ? 0 : formatNumber(this.getBonus, 2);
		},
		getConfirmStyle() {
			const betWrapperDom = document.querySelector('#j_betslip .m-tabs');

			return {
				top: betWrapperDom && `-${betWrapperDom.offsetHeight}px` || '0px'
			};
		},
		// stake 输入框内容匹配规则：最多输入两位小数，整数长度限制为 maxStake 的长度
		inputReg() {
			const maxIntLength = String(this.maxStake).length;
			return new RegExp(`^\\d{0,${maxIntLength}}(\\.\\d{0,2})?`);
		}
	},

	watch: {
		currentType(val, oldVal) {
			// tab切换时，设置检查stake状态
			this.canCheckStake = true;

			// 12/26
			this.activeInput = '';
		},
		stakeUnion(val, oldVal) {
			if (!val.length) {
				return;
			}

			// play all有值时，玩法变化时，各种玩法stake自动同步paly all的值，同时校验
			if (this.unionStake && this.isSystem) {
				this.fillStakeItem();
				this.checkStake('union', null);
			} else {
				this.stake.splice(0);
				for (const stakeItem of val) {
					this.stake.push(stakeItem.stake || '');
				}

				// play all无值时，逐个校验各个玩法stake和总stake
				this.stake.forEach((item, index) => {
					this.checkStake('unique', index);
				});
			}
		},
		getBetCount() {
			this.fixError();
			this.fixStake();
		},

		getSelectList() {
			this.fixError();
			this.fixStake();
		},

		clickedGiftId(val) {
			if (val) {
				this.changeCoupon();
			}
		},

		errorInfo(val, oldVal) {
			this.checkErrorInfo();
		},

		// acceptStatus
		acceptStatus(val) {
			if (val) {
				this.showComfirm = false;
				this.isReady = false;
			}
		},

		// 是否可以生单
		isReady(val) {
			if (val) {
				this.placeBet(this.getPayMoney)
					.then(ret => {
						this.isReady = false;
					}, err => { // eslint-disable-line
						this.isReady = false;
					});

				this.showComfirm = false;
			}
		},
		calTotalStake(val) {
			if (val) {
				this.actionTips = '';
			}
		}
	},

	methods: {
		...mapActions('betslipStake', [
			'placeBet',
		]),
		...mapActions('betslip', [
			'accpetChanges'
		]),
		...mapActions('coupons', [
			'getCoupons'
		]),
		...mapMutations('betslip', {
			savePayMethods: UPDATEPAYMETHOD
		}),
		...mapMutations('betslipStake', {
			updateStake: mutationTypes.UPDATESTAKE
		}),
		...mapMutations('coupons', {
			updateCouponStatus: couponMutationTypes.COUPONSUNAVAIABLE,
			changeChecked: couponMutationTypes.UPDATECHECKEDGIFTID,
			updateConfirmStatus: couponMutationTypes.UPFATECOMFIRMERROR,
			updateGiftsTips: couponMutationTypes.UPDATEDISABLEDTIPS
		}),
		setCheckStatus() {
			// 输入过程中，不检查输入的stake值
			this.canCheckStake && (this.canCheckStake = false);
		},
		changeActiveIn(type = '') {
			// 12/26
			this.activeInput = type;
		},
		fillStakeItem() {
			this.stake.splice(0);
			this.stake.length = this.stakeUnion.length;
			this.stake.fill(this.unionStake);
		},
		unionifyStake(opt) {
			const val = opt.value;
			this.unionStake = this.formatInput(val);

			// 修改其他stake的值，与该值相同
			this.fillStakeItem();

			this.fixStake();

			// stake值发生变化时，红包选中清空
			this.changeChecked({
				giftId: '',
				type: this.currentType
			});

			this.checkUnionStake(null, false, false);
		},
		checkUnionStake(event, checkMin = true, isBlur = true) {
			// if (this.unionStake) {
			this.canCheckStake = true;
			isBlur && (this.activeInput = '');
			// }

			this.checkStake('union', null, checkMin);
			this.checkErrorInfo();

			if (isBlur) {
				const originStake = this.unionStake;
				this.unionStake = +this.unionStake || '';

				if (originStake !== '' + this.unionStake) {
					this.fixStake();
				}
			}
		},
		formatInput(val) {
			let fixVal = val.replace(/[^\d\.]/g, '');
			const fixValArr = fixVal.match(this.inputReg);

			if (fixValArr) {
				fixVal = fixValArr[0];
			}
			return fixVal;
		},
		modifyStake(opt, event) {
			const val = opt.value,
				parentNode = event.target.closest('.m-input-wrapper');

			const index = parentNode.getAttribute('data-index');

			const fixVal = this.formatInput(val);
			this.stake.splice(+index, 1, fixVal);

			// system时，重置unionStake为0, 更新store中unionStake
			if (this.currentType === 'system' && this.unionStake) {
				this.unionStake = '';
			}

			this.fixStake();

			// stake值发生变化时，红包选中清空
			this.changeChecked({
				giftId: '',
				type: this.currentType
			});

			this.checkUniqueStake(null, index, false, false);
		},
		checkUniqueStake(event, index, checkMin = true, isBlur = true) {
			// if (this.stake[index]) {
			this.canCheckStake = true;
			isBlur && (this.activeInput = '');
			// }

			this.checkStake('unique', index, checkMin);
			this.checkErrorInfo();

			if (isBlur) {
				const originStake = this.stake[index];
				this.stake[index] = +this.stake[index] || '';

				// 有前缀0，失去焦点时，更新store
				if (originStake !== '' + this.stake[index]) {
					this.fixStake();
				}
			}
		},
		checkStake(type = 'union', index = -1, checkMin = true) {
			if (!this.canCheckStake) {
				return;
			}

			// play all时检查错误信息之前，重置错误信息
			if (type === 'union') {
				this.errorInfo = {};

				this.errorInfo.union = this.getErrorMsg('union', null, checkMin);
			} else {
				const stakeList = this.stake || [];
				const tempStakeList = [...stakeList];

				tempStakeList.splice(index, 1);
				tempStakeList.unshift(stakeList[index]);

				for (let i = 0, len = tempStakeList.length; i < len; i++) {
					const tempIndex = i === 0 ? index : i <= index ? i - 1 : i,
						key = this.getErrorKey('unique', tempIndex),
						errorMsg = this.getErrorMsg('unique', tempIndex, checkMin);

					this.errorInfo = {
						...this.errorInfo,
						...{
							[key]: errorMsg,
							union: errorMsg ? '' : this.errorInfo.union
						}
					};
					if (errorMsg) {
						break;
					}
				}
			}

			this.checkTotalStake(type);

			// stake 全部检验完，重置检测状态
			this.canCheckStake = false;
		},
		getErrorKey(type = 'union', index = -1) {
			if (type === 'union') {
				return 'union';
			}

			const currentStakeObj = this.stakeUnion[index] || {};
			return currentStakeObj.name || 'Single';
		},
		getErrorMsg(type = 'union', index = -1, checkMin = false) {
			const checkData = type === 'unique' ? this.stake[index] : this.unionStake;

			if (checkMin && checkData && checkData < this.minStake) {
				return `Please enter a value no less than ${this.minStake}`;
			}

			if (checkData && checkData > this.maxStake) {
				return `Please enter a smaller value as the total stake cannot exceed ${formatNumber(this.maxStake)}`;
			}

			return '';
		},
		checkTotalStake(type = 'union') {
			let totalStake = 0;
			if (type === 'union') {
				totalStake = this.stakeUnion.reduce((temp, item) => {
					const tempStake1 = item.count && +this.unionStake && (item.count * this.unionStake) || 0;
					temp += tempStake1;
					return temp;
				}, 0);
			} else {
				totalStake = this.stakeUnion.reduce((temp, item, index) => {
					const tempStake2 = item.count && +this.stake[index] && (item.count * this.stake[index]) || 0;
					temp += tempStake2;
					return temp;
				}, 0);
			}

			if (totalStake > this.maxStake) {
				this.errorInfo.sumMsg = `Total stake cannot exceed ${formatNumber(this.maxStake)}`;
			} else {
				this.errorInfo.sumMsg = '';
			}
		},
		showUniqueStakeError(index = -1) {
			if (index > -1) {
				if (this.getUniqueErrorMsg(index)) {
					return true;
				}
			}

			return false;
		},
		getUniqueErrorMsg(index = -1) {
			const key = this.getErrorKey('unique', index);

			return this.errorInfo[key] || '';
		},

		checkErrorInfo() {
			const errorInfo = this.errorInfo || {};

			if (this.currentType === 'single') {
				this.hasError = !!errorInfo.Single;
				return;
			}

			if (this.currentType === 'multiple') {
				this.hasError = !!errorInfo.Multiple;
				return;
			}

			const errorKeys = Object.keys(errorInfo);

			for (const errorKey of errorKeys) {
				if (errorInfo[errorKey]) {
					this.hasError = true;
					return;
				}
			}

			this.hasError = false;
		},

		fixStake() {
			let options = {};

			// 更新store
			if (this.currentType === 'system') {
				const stakeUnion = this.stakeUnion || [],
					stakeCount = stakeUnion.length;
				for (let index = 0; index < stakeCount; index++) {
					// 注意这里先不要转成 Number 类型
					options[stakeUnion[index].name] = this.stake[index] || '';
				}
				options.union = +this.unionStake || '';
			} else {
				options = this.stake[0];
			}

			this.updateStake({
				type: this.currentType,
				stake: options
			});
		},

		fixError() {
			// bet数量变化时，设置检查stake状态
			this.canCheckStake = true;

			// betslip列表发成变化（新增，update，删除，check status）时，检查stake是否有误，矫正有误项
			if (this.unionStake && this.isSystem) {
				this.fillStakeItem();
				this.checkStake('union');
			} else {
				this.stake.forEach((item, index) => {
					this.checkStake('unique', index);
				});
			}
		},

		// 选择红包
		changeCoupon() {
			const currentCoupon = this.getCouponInfo(this.clickedGiftId);

			if (currentCoupon) {
				const totalStake = this.calTotalStake || 0,
					leastOrderAmount = +currentCoupon.leastOrderAmount;

				if (currentCoupon.maskTips) {
					this.updateCouponStatus(true);
					return;
				}

				// 没有stake、满减不符合条件
				if (!totalStake ||
					(leastOrderAmount && leastOrderAmount > totalStake)) {
					this.updateCouponStatus(true);
					this.updateGiftsTips(
						!totalStake ? 'Please enter a stake first' : 'Min. Stake Required Not Met'
					);
				} else {
					this.changeChecked({
						giftId: this.clickedGiftId,
						type: this.currentType
					});
				}
			}
		},

		commitBet() {
			if (!this.calTotalStake) {
				this.actionTips = `Please enter a value no less than ${this.minStake}`;
				this.hasError = true;
				return;
			}

			if (this.isFlexi && +this.showMultipleOdds < +this.oddsThreshold) {
				this.$dialog();
				this.$dialog({
					title: null,
					contentData: {
						title: 'Note',
						msg: createOrderTips(this.oddsThreshold)
					},
					content: PopTips,
					button: []
				});
				return;
			}

			if (this.betLoading) {
				return;
			}

			if (!window.loginStatus) {
				window.login({ activeTab: 'Log In' });
				return;
			}

			// place bet clicked
			this.showComfirm = true;
		},

		cancelPlaceBet() {
			this.showComfirm = false;
		},

		commitPlaceBet() {
			// bet使用了红包，请求红包接口验证红包
			if (this.checkGiftId) {
				this.getCoupons({
					betType: 0,
					isComfirm: true
				}).then(ret => {
					if (ret && ret.conponAviable) {
						// 继续校验totalStake和coupon
						const totalStake = this.calTotalStake || 0,
							leastOrderAmount = this.checkItem && +this.checkItem.leastOrderAmount || 0;

						// 没有stake、满减不符合条件
						if (!totalStake ||
							(leastOrderAmount && leastOrderAmount > totalStake)) {
							// 重置coupon的confirm状态
							this.updateConfirmStatus(true);
							this.isReady = false;
							this.showComfirm = false;
						} else {
							this.isReady = true;
						}
					} else {
						this.isReady = false;
						this.showComfirm = false;
					}
				});
			} else {
				// 没有使用红包，直接生单
				this.isReady = true;
			}
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13 && this.activeInput) {
				const currentInputDom = document.querySelector(`#j_${this.activeInput} input`);
				currentInputDom && (currentInputDom.blur());
			}
		}
	},
	mounted() {
		window.addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestroy() {
		window.removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>
