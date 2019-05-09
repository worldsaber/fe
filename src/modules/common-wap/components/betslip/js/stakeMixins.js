import { formatNumber } from 'utils';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { LS } from 'storage';

const defError = 'No internet connection, try again.';
export default {
	computed: {
		betBtnCls () {
			return {
				'place-bet': true,
				'bet-accept-change': this.isShowAcceptChange,
				'bet-submit': this.betLoading,
				'bet-disabled': !this.canBet || this.showStakeUnion.totalStake === 0 ||
				this.showStakeUnion.totalStake > this.maxStake ||
				this.showStakeUnion.totalStake < this.minStake ||
				this.stakeUnion.some(cur => {
					if (cur.stake) {
						return cur.stake > this.maxStake || cur.stake < this.minStake;
					}
					return false;
				})
			};
		},
		// 按钮文字
		betBtnText () {
			if (this.betLoading) {
				return 'Submitting';
				// 不是自动接收赔率的情况下
			} else if (this.isShowAcceptChange) {
				return 'Accept Changes';
			} else if (this.ISFASTSTAKE && !this.loginStatus) {
				return 'Log in to Place Bet';
			}
			return 'Place Bet';
		},
		totalToPay () {
			let couponAmout = 0;
			// 取到当前选中红包的
			if (this.checkItem && this.checkItem.curBal) {
				couponAmout = this.checkItem.curBal;
			}
			const totalStake = this.showStakeUnion.totalStake;
			return formatNumber(couponAmout >= totalStake ? 0 : totalStake - couponAmout, 2);
		},
		isShowAcceptChange () {
			// 当前选择自动接收赔率，但是只接受 odds change的这种情况
			if (this.autoAcceptChange) {
				// 当前所有比赛都可以投注，证明可能只有赔率的变化
				if (this.betCount === this.validEventSize.outcomeCount) {
					return false;
				}
				return this.acceptStatus;
			}
			return this.acceptStatus;
		},
		showCoinGroup() {
			return this.coin > 0 && this.currentType !== 'system';
		}
	},
	methods: {
		betConfirm() {
			const totalStake = this.showStakeUnion.totalStake;
			// 当前发生变化，并且不再提交状态中
			if (this.isShowAcceptChange && !this.betLoading) {
				this.accpetChanges();
			} else if (this.canBet && totalStake >= this.minStake && totalStake <= this.maxStake && !this.betLoading) {
				if (!this.confirmDialog) {
					// 未登录时先登录
					if (!window.loginStatus) {
						window.login && window.login.show();
					} else {
						this.isShowConfirm = true;
					}
				}
			}
		},
		betCheckGift () {
			if (this.checkGiftId) {
				this.updateBetLoading(true);
				return this.getCouponsGroup({
					isComfirm: true
				}).then(ret => {
					if (ret && ret.conponAviable) {
						// 继续校验totalStake和coupon
						const leastOrderAmount = this.checkItem && +this.checkItem.leastOrderAmount || 0;
						const totalStake = this.showStakeUnion.totalStake;
						// 满减不符合条件
						if (!totalStake ||
							(leastOrderAmount && leastOrderAmount > totalStake)) {
							// 重置coupon的confirm状态
							this.updateConfirmStatus(true);
							// 用以promise状态向下走
							return -111;
						}
					} else if (ret && !ret.conponAviable) { // 红包不合法
						return -111;
					}
				});
			}
			return Promise.resolve();
		},
		bet () {
			const totalStake = this.showStakeUnion.totalStake;
			if (this.canBet && totalStake >= this.minStake && totalStake <= this.maxStake && !this.betLoading) {
				// 先检测红包
				this.betCheckGift()
				// 获取红包错误错误拦截
				.catch(() => Promise.reject({
					message: defError
				}))
				.then(status => {
					if (status !== -111) {
						console.log('place bet');
						return this.placeBet();
					}
					// 红包错误在前面已经提示过了
					return Promise.reject();
				})
				.then(data => {
					console.log(data);
					let title = null;
					let content = defError;
					// 这里不管什么原因，重新刷一次红包显示状态
					if (data.bizCode !== 10000) {
						if (data.login === false) {
							if (this.$popupLogin) {
								this.$popupLogin.show();// use popup login.
							} else {
								console.log('Need to load components/login/popupLogin.js in root component ');
							}
							return;
						}
						const code = data.bizCode;
						console.log(code);
						switch (code) {
						// 下注金额不在范围内
						case 4100:
							title = 'Submission Failed';
							content = data.message;
							break;
						// 下单被拒(4310和4300部分情况需要刷新oddkey和flexibet开关)
						case 4310:
						case 4300:
							title = 'Submission Failed';
							content = data.message;
							if (!this.ISFASTSTAKE) {
								this.fetchFlexiBetConfig();
							}
							break;
						// 余额不足
						case 4200:
							content = data.message;
							// 刷新余额
							this.fetchAcountInfo();
							if (this.payMode === 0) {
								title = 'Balance Insufficient';
								this.$dialog({
									title,
									content,
									button: ['Later', 'Deposit']
								}).onBtnClick(ret => ret && (window.location.href = URL.addPara(userCenterUrl.deposit, {
									source: 'betslip'
								})));
							} else {
								title = 'Insufficient SportyCoins';
								this.$dialog({
									css: 'sportycoin-dialog',
									title,
									content,
									button: ['OK']
								});
							}
							return;
						// 红包生单失败
						case 4210:
							// 刷新红包
							this.resetCoupons(true);

							// TODO: 红包生单一律使用后台的错误信息
							return {
								title: 'Gift Unavailable',
								content: data.message
							};
						case 4600:
							content = data.message;
							this.verifyOddsBoost();
							break;
						default:
							if (data.message || data.msg) {
								content = data.msg || data.message;
								if (data.opt === 'clear') {
									this.handleClear();
								}
							}
						}
						return {
							title,
							content
						};
					}
					// 下单成功， 这里如果是快速投注，使用betslip的成功页。普通betslip不需要任何操作
					let betslipMode = 0; // 0代表普通betslip投注
					if (this.ISFASTSTAKE) {
						this.toggleRight(true);
						betslipMode = 1;
					}
					LS.set('wap_last_betslip_mode', betslipMode); // 记录上一次下单方式，用于REBET
				})
				.catch(data => {
					// 没有错误就跳过
					const title = null;
					let content = defError;
					if (typeof data === 'object') {
						if (data.message) {
							content = data.message;
						}
						if (data.opt === 'clear') {
							this.handleClear();
						}
						return {
							title,
							content
						};
					} else if (typeof data === 'string') {
						content = data;
						return {
							content
						};
					}
				})
				.then(res => {
					this.updateBetLoading(false);
					if (res && res.content) {
						res.button = ['OK'];
						this.$dialog(res);
					}
				});
			}
		},
		handleClear () {
			this.resetStake();
			this.resetCoupons(true);
			this.clearAllBetSlip();
		},
	}
};
