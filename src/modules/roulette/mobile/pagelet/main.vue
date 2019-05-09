<template>
	<div id="m-roulette">
		<div class="m-roulette-overlay" v-if="showOverlay" @click="overlayClick"/>
		<div class="setting-tip" v-if="showSettingTip">Deposit or Withdraw here<i class="icon-close" @click="overlayClick"/><div class="setting-arrow"/></div>
		<div class="setting-wrap" v-if="showSetting">
			<div class="setting-menu" @click="goDeposit">Deposit</div>
			<div class="setting-menu middle" @click="goWithdraw">Withdraw</div>
			<div class="setting-menu" @click="goShare">Share</div>
			<div class="setting-arrow"/>
		</div>
		<div class="clear-wrap">
			<div :class="['clear-btn', {
				'disable': clearDisable
				}]" @click="clear">Clear</div>
		</div>
		<div class="clear-tip-wrap" v-if="showClearTip">
			<div class="clear-tip">Tap "Clear" to remove the chip.<i class="icon-close" @click="overlayClick"/><div class="clear-arrow"/></div>
		</div>
		<div class="m-header">
			<div class="title-row">
				<div class="back-btn" @click="back"><i class="icon-back"/></div>
				<div class="balance-text" v-if="loginStatus">Balance <animateCount :value="balance / 10000" :disabled="disableAnimate"/></div>
				<div class="login-btn" v-else @click="goLogin">Register / Log ln</div>
				<div class="blank-block"/>
				<!-- <div class="share-btn" @click="share"><i class="icon-share"/></div>
				<i class="icon-tips" @click="goTips"/> -->
				<div class="guide-btn" @click="goTips">Guides</div>
				<i class="icon-setting" @click="showSetting = true"/>
				<img class="icon-music" v-if="!enableMusic" @click="toggleMusic(true)" src="../images/music-off.svg"/>
				<img class="icon-music" v-else @click="toggleMusic(false)" src="../images/music-on.svg"/>
			</div>
			<div class="stake-row">
				<div class="num-wrap">Current Bet {{+showBet > 0 ? '-' : ''}}<animateCount v-model="showBet"/></div>
				<div class="num-wrap" v-if="false">Current Win {{+showWin > 0 ? '+' : ''}}<animateCount v-model="showWin"/></div>
				<div class="num-wrap"/>
			</div>
		</div>
		<div class="m-roulette-wrap"></div>
		<div class="table-wrap">
			<div class="history-wrap">
				<!-- <div class="history-label">Current Records</div> -->
				<div :class="[historyStack.length>6?'history-list-scroll':'history-list']" v-if="historyStack.length > 0">
					<div :class="['history-item', historyStack[index - 1].color]" v-for="(index,i) in historyStack.length" :key="i">{{historyStack[index - 1].result}}<img v-if="historyStack[index - 1].status === 1" class="icon-win" src="../images/icon-win.png"></div>
				</div>
				<div class="history-list-blank" v-else>Current Records</div>
				<button class="history-btn" @click="goHistory">History
					<i class="arrow"></i>
					<i class="arrow"></i>
				</button>
			</div>
			<div class="selection-wrap">
				<div class="num-area">
					<block @click.native="pickBlock(0)" :data="blockMap[0]" :class="['num-block', blockMap[0].color]" :pick="pickMap[0]" :tableChipMap="tableChipMap"/>
					<div class="num-right">
						<div :class="['num-row', `row-${row}`]" v-for="row in 3" :key="row">
							<block @click.native="pickBlock(5*row + col - 5)" :data="blockMap[5*row + col - 5]" :class="['num-block', blockMap[5*row + col - 5].color]" :pick="pickMap[5*row + col - 5]" :tableChipMap="tableChipMap" v-for="col in 4" :key="blockMap[5*row + col - 5].value"/>
							<block @click.native="pickBlock(5*row)" @touchstart.native="toggleHighlight(row, true)" @touchend.native="toggleHighlight(row, false)" :data="blockMap[5*row]" :class="['num-block', blockMap[5*row].color]" :pick="pickMap[5*row]" :tableChipMap="tableChipMap" :key="blockMap[5*row].value"/>
						</div>
					</div>
				</div>
				<div class="special-area">
					<div class="color-row">
						<block @click.native="pickBlock(16)" :pick="pickMap[16]" :tableChipMap="tableChipMap" class="color-block">
							<div class="m-block-body">
								<div class="block-diamond">
									<div class="diamond-top"/>
									<div class="diamond-bottom"/>
								</div>
								<div class="block-wrap">
									<div class="block-label">{{blockMap[16].label}}</div>
									<div class="block-odd">{{blockMap[16].odd}}</div>
								</div>
							</div>
						</block>
						<block @click.native="pickBlock(17)" :pick="pickMap[17]" :tableChipMap="tableChipMap" class="color-block">
							<div class="m-block-body black">
								<div class="block-wrap">
									<div class="block-label">{{blockMap[17].label}}</div>
									<div class="block-odd">{{blockMap[17].odd}}</div>
								</div>
								<div class="block-diamond">
									<div class="diamond-top"/>
									<div class="diamond-bottom"/>
								</div>
							</div>
						</block>
					</div>
					<div class="range-row">
						<block @click.native="pickBlock(18)" :data="blockMap[18]" :pick="pickMap[18]" :tableChipMap="tableChipMap" class="block-1-6"/>
						<block @click.native="pickBlock(19)" :data="blockMap[19]" :pick="pickMap[19]" :tableChipMap="tableChipMap" class="odd-block"/>
						<block @click.native="pickBlock(20)" :data="blockMap[20]" :pick="pickMap[20]" :tableChipMap="tableChipMap" class="even-block"/>
						<block @click.native="pickBlock(21)" :data="blockMap[21]" :pick="pickMap[21]" :tableChipMap="tableChipMap" class="block-7-12"/>
					</div>
				</div>
			</div>
		</div>
		<chips :chips="chips" v-model="chipIndex"/>
		<div class="total-stake-row">Total Stake: {{currency}} {{showTotalStake}}</div>
		<div class="button-wrap">
			<div :class="['action-btn left', {'disable': !this.lastBet && loginStatus}]" @click="rebet('')"/>
			<div @click="spin" class="action-btn middle"/>
			<div class="action-btn right" @click="autoPlay"><img class="icon-reward" src="../images/rewards.png"></div>
		</div>
		<Share :shareCfg="shareCfg" v-show="showShare" @close-share="closeShare"/>
		<BetLoading v-show="showLoading" @click.stop="noop"/>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { LS } from 'storage';
import { formatNumber, isEmptyObject } from 'utils';
import { EventBus } from 'kernel/js/eventBus';
import commonEvent from 'config/eventConfig/commonEvent';
import share from 'components/share';
import BetLoading from 'components/betLoading';
import 'components/login/popupLogin';
import { setRecord } from 'config/deposit/record';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { pagePath } from 'config/pageConfig';
import roundsToPlayD from './roundsToPlayD.vue';
import winToast from './winToast.vue';
import block from './block.vue';
import blockMap from '../js/blockMap';
import chips from './chips.vue';
import tablechips from '../js/tableChips';
import animateCount from './animateCount';
import { lockedMessage, defaultMessage } from '../js/commonFun.js';

const resultToColor = {};
blockMap.forEach(block => {
	resultToColor[block.label] = block.color;
});
export default {
	components: {
		block,
		chips,
		share,
		BetLoading,
		animateCount
	},
	props: {
		enableMusic: {
			type: Boolean,
			'default': true
		}
	},
	data() {
		const pickMap = [];
		blockMap.forEach((block, i) => {
			pickMap[i] = [];
		});
		return {
			blockMap,
			pickMap,
			chipIndex: 0,
			tableChipMap: {},
			totalStake: 0,
			timeid: '',
			balance: 0,
			historyStack: [],
			lastBet: '', // 保存上一次投注的数据
			totalWin: 0, // 包含连续投注返奖
			trueWin: 0, // 不包含返奖
			stopFlag: false,
			loginStatus: false,
			showShare: false,
			showLoading: false,
			plans: '', // 连续投注方案,
			currency: window.currency,
			showSetting: false,
			showSettingTip: false,
			showClearTip: false,
			showBet: 0,
			showWin: 0,
			disableAnimate: false
		};
	},
	created() {
		this.checkSettingTip();
		this.getChips().then(() => {
			this.chips.forEach((chip, i) => {
				this.tableChipMap[chip] = tablechips[i] ? tablechips[i] : '';
			});
			this.setChipIndex();
		});
		if (window.loginStatus) {
			this.init();
		}

		this.loginStatus = window.loginStatus;
	},
	computed: {
		...mapState('roulette', ['stakeLimit', 'chips']),
		currentBet() {
			let bet = 0;
			this.historyStack.forEach(history => {
				bet += history.bet;
			});
			return bet;
		},
		formatBet() {
			return formatNumber(this.currentBet / 10000, 2);
		},
		clearDisable() {
			let disable = true;
			for (let i = 0; i < this.pickMap.length; i++) {
				if (this.pickMap[i].length > 0) {
					disable = false;
					break;
				}
			}
			return disable;
		},
		currentWin() {
			let win = 0;
			this.historyStack.forEach(history => {
				win += history.winningAmount;
			});
			return win;
		},
		formatWin() {
			return formatNumber(this.currentWin, 2);
		},
		showBalance() {
			return formatNumber(this.balance / 10000, 2);
		},
		showTotalStake() {
			return formatNumber(this.totalStake / 10000, 2);
		},
		shareCfg() {
			const tempUrl = `${location.origin}/${window.country}/m/roulette`;
			return {
				url: tempUrl,
				hashtag: 'SportyBet',
				via: 'SportyBet'
			};
		},
		showOverlay() {
			return this.showClearTip || this.showSettingTip || this.showSetting;
		}
	},
	methods: {
		...mapActions('roulette', ['getChips']),
		init() { // 这里的请求与用户相关
			// this.detectAutoPlay().then(res => {
			// 	if (res) {
			// 		this.getHistory(res);
			// 	}
			// }); 去掉获取连续投注上下文
			this.getBalance(true);
			this.getLastBet();
		},
		overlayClick() {
			this.showClearTip = false;
			this.showSetting = false;
			this.showSettingTip = false;
		},
		toggleHighlight(row, flag) {
			const rowEle = document.querySelector(`.num-row.row-${row}`);
			if (rowEle) {
				rowEle.className = flag ? `num-row row-${row} highlight` : `num-row row-${row}`;
			}
		},
		checkSettingTip() {
			const showTip = LS.get('roulette_show_setting_tip') !== '1';
			if (showTip) {
				this.showSettingTip = true;
				LS.set('roulette_show_setting_tip', '1');
			}
		},
		checkClearTip() {
			const showTip = LS.get('roulette_show_clear_tip') !== '1';
			if (showTip && this.loginStatus) {
				this.showClearTip = true;
				LS.set('roulette_show_clear_tip', '1');
			}
		},
		setChipIndex() {
			const chip = LS.get('roulette_chip_amount');
			const index = this.chips.indexOf(+chip);
			this.chipIndex = index > -1 ? index : 0;
		},
		pickBlock(i) { // 带声音pick
			this.$emit('triggerMusic', 'chip');
			if (!window.loginStatus) {
				this.$popupLogin.show();
				return;
			}
			this.checkClearTip();
			this.pick(i);
		},
		pick(i, stake) { // 编程式pick
			const currentStake = stake || this.chips[this.chipIndex];
			const limit = this.stakeLimit[this.blockMap[i].id];
			if (this.totalStake + currentStake > this.balance) {
				this.$toast('Your balance is insufficient.');
				return;
			}
			if (this.pickMap[i] && (currentStake + this.getSum(this.pickMap[i])) > limit.max) {
				this.$toast(`The maximum amount for "${limit.name}" is ${window.currency} ${formatNumber(limit.max / 10000, 2)} per bet.`);
				return;
			}
			this.pickMap[i].push(currentStake);
			this.calcTotalStake();
		},
		calcTotalStake() {
			if (this.timeid) {
				clearTimeout(this.timeid);
			}
			this.timeid = setTimeout(() => {
				let totalStake = 0;
				this.pickMap.forEach(item => {
					if (item.length > 0) {
						totalStake += this.getSum(item);
					}
				});
				this.totalStake = totalStake;
				this.timeid = '';
			}, 200);
		},
		getSum(arr) {
			let sum = 0;
			arr && arr.forEach(num => {
				sum += num;
			});
			return sum;
		},
		reset() {
			this.totalStake = 0;
			this.pickMap.forEach((item, i) => {
				if (this.pickMap[i].length > 0) {
					this.pickMap[i].splice(0, this.pickMap[i].length);
				}
			});
		},
		clear() {
			this.$emit('triggerMusic', 'button');
			this.reset();
		},
		getConfig() {
			return fetch('/highfreq/roulette/bonusplan').then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					res.data.forEach(plan => {
						plan.percent = +plan.percent;
					});
					this.plans = res.data || [];
				}
			}).catch(e => {
				console.log(e);
			});
		},
		getLastBet() {
			return fetch('/highfreq/roulette/lastBet').then(res => res.json()).then(res => {
				if (res.login === false) {
					this.$popupLogin.show();
					return;
				}
				if (res.bizCode === 10000 && res.data) {
					this.lastBet = res.data.betInfoDetail || '';
				}
			});
		},
		formatChip(chips) {
			for (let i = 0; i < chips.length; i++) {
				chips[i] = (+chips[i]) / 10000;
			}
			return chips;
		},
		getBetInfo() {
			const betInfo = {};
			let sum;
			this.pickMap.forEach((item, i) => {
				if (item.length > 0) {
					sum = 0;
					item.forEach(stake => {
						sum += stake;
					});
					betInfo[blockMap[i].value] = sum;
				}
			});
			return betInfo;
		},
		getHistory(data) {
			const lastBetId = data.lastBetId,
				currentNum = data.currentNum;
			fetch(`/highfreq/roulette/bethistory?lastBetId=${lastBetId}&limit=${currentNum}`).then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					this.historyStack = res.data.list;
					this.historyStack.forEach(history => {
						history.color = resultToColor[history.result];
					});
				}
			});
		},
		getBalance(disabled) {
			fetch('/pocket/v1/finAccs/finAcc/userBal').then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					if (disabled) { //  禁止数字变化的动画
						this.disableAnimate = true;
						this.$nextTick(() => {
							this.balance = res.data.avlBal;
							this.$nextTick(() => {
								this.disableAnimate = false;
							});
						});
					} else {
						this.balance = res.data.avlBal;
					}
				}
			});
		},
		rebet(betDetail) {
			this.$emit('triggerMusic', 'button');
			if (!window.loginStatus) {
				this.$popupLogin.show();
				return;
			}
			if (betDetail || this.lastBet) { // 可以rebet
				this.reset();
				if (!this.blockIndexMap) { // 搞一个index对应投注项的map
					this.blockIndexMap = {};
					this.blockMap.forEach((block, i) => {
						this.blockIndexMap[block.value] = i;
					});
				}
				if (betDetail) { // 订单rebet
					Object.keys(betDetail).forEach(key => {
						// this.pickMap[this.blockIndexMap[key]].push(betDetail[key]);
						this.pick(this.blockIndexMap[key], betDetail[key]);
					});
					this.calcTotalStake();
				} else { // 主界面rebet、去后台拿最新记录
					this.showLoading = true;
					this.getLastBet().then(() => {
						this.showLoading = false;
						if (this.lastBet) {
							Object.keys(this.lastBet).forEach(key => {
								// this.pickMap[this.blockIndexMap[key]].push(this.lastBet[key]);
								this.pick(this.blockIndexMap[key], this.lastBet[key]);
							});
							this.calcTotalStake();
						}
					}).catch(e => {
						console.log(e);
						this.showLoading = false;
					});
				}
			}
		},
		goHistory() {
			this.$emit('triggerMusic', 'button');
			if (!window.loginStatus) {
				this.$popupLogin.show();
				return;
			}
			this.$emit('toggleHistory', true);
		},
		autoPlay() {
			this.$emit('triggerMusic', 'button');
			this.showLoading = true;
			this.getConfig().then(() => {
				this.showLoading = false;
				const d = this.$dialog({
					title: null,
					css: 'round-to-play',
					content: roundsToPlayD,
					contentData: {
						plans: this.plans
					},
					button: []
				});
				d.onMounted(() => {
					d.$content.$on('autoplay', plan => { // 开始新的连续投注
						console.log('new auto play', plan);
						this.$emit('triggerMusic', 'button');
						if (!window.loginStatus) {
							this.$popupLogin.show();
							return;
						}
						const betInfo = this.getBetInfo();
						if (isEmptyObject(betInfo)) {
							this.$toast('Please make some bets first.');
							return;
						}
						this.totalWin = 0; // 重置中奖金额
						this.trueWin = 0;
						this.plan = plan; // 记录连续投注方案
						this.$emit('toggleRoulette', true);
						this.showLoading = true;
						this.autoSpin(betInfo, plan);
					});
				});
			}).catch(e => {
				this.showLoading = false;
				console.log(e);
			});
		},
		randomPick() {
			const min = 0,
				max = this.blockMap.length - 1,
				randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;

			this.pick(randomIndex);
		},
		autoSpin(betInfo, plan) {
			let params;
			if (this.lastResponse && this.lastResponse.inContinuousBet) {
				params = {
					betInfo,
					continuousCnt: plan.count,
					currentNum: ++this.lastResponse.currentNum,
					lastBetId: this.lastResponse.lastBetId
				};
			} else {
				params = {
					betInfo,
					continuousCnt: plan.count,
					currentNum: 1
				};
			}
			fetch('/highfreq/roulette/bet', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify(params)
			}).then(res => res.json()).then(res => {
				if (this.showLoading) {
					this.showLoading = false;
				}
				if (res.login === false) {
					this.$emit('toggleRoulette', false);
					this.$popupLogin.show();
					return;
				}
				if (res.bizCode === 10000) {
					res.data.percent = this.plan.percent;
					this.showBet = (this.currentBet + this.totalStake) / 10000;
					this.balance -= this.totalStake;
					EventBus.$emit('roulette_start', {
						...res.data,
						type: 'auto'
					});
					this.$emit('startAutoPlay', 'wheel');
					this.totalWin += +res.data.winningAmount;
					this.trueWin += res.data.winningAmount - res.data.bonusAmount;
					this.lastBet = betInfo; // 更新上一次投注信息
					this.lastResponse = res.data; // 记录上一次下单的相应数据
				} else if (res.bizCode === 4200) {
					this.lastResponse = '';
					this.getBalance();
					const d = this.$dialog({
						title: 'Balance Insufficient',
						content: 'There is not enough balance in your account to palce this bet.',
						button: ['LATER', 'DEPOSIT']
					});
					d.onMounted(() => {
						d.onBtnClick(i => {
							this.$dialog();
							if (i === 1) {
								setRecord(pagePath.roulette);
								window.location.href = URL.addPara(userCenterUrl.deposit, {
									source: 'roulette'
								});
							} else { // 连续投注点LATER需要统计输赢情况
								this.$emit('toggleRoulette', false);
								if (params.currentNum !== 1) {
									this.resultToast(); // 连续投注第一次失败不需要统计输赢
								}
							}
						});
					});
				} else if (res.bizCode === 4220) {
					this.lastResponse = '';
					const d = this.$dialog({
						title: null,
						content: lockedMessage,
						button: ['OK']
					});
					d.onMounted(() => {
						d.onBtnClick(() => {
							this.$emit('toggleRoulette', false);
							if (params.currentNum !== 1) {
								this.resultToast(); // 连续投注第一次失败不需要统计输赢
							}
						});
					});
				} else {
					this.lastResponse = '';
					const d = this.$dialog({
						title: null,
						content: res.message || defaultMessage,
						button: ['OK']
					});
					d.onMounted(() => {
						d.onBtnClick(() => {
							this.$emit('toggleRoulette', false);
							if (params.currentNum !== 1) {
								this.resultToast(); // 连续投注第一次失败不需要统计输赢
							}
						});
					});
				}
			}).catch(() => {
				if (this.showLoading) {
					this.showLoading = false;
				}
				this.lastResponse = '';
				const d = this.$dialog({
					title: null,
					content: defaultMessage,
					button: ['OK']
				});
				d.onMounted(() => {
					d.onBtnClick(() => {
						this.$emit('toggleRoulette', false);
						if (params.currentNum !== 1) {
							this.resultToast(); // 连续投注第一次失败不需要统计输赢
						}
					});
				});
			});
		},
		spin() {
			this.$emit('triggerMusic', 'button');
			if (!window.loginStatus) {
				this.$popupLogin.show();
				return;
			}
			const betInfo = this.getBetInfo();
			if (isEmptyObject(betInfo)) {
				const d = this.$dialog({
					title: null,
					content: 'You haven\'t chosen any bets, do you want to place bet randomly?',
					button: ['CANCEL', 'YES']
				});
				d.onMounted(() => {
					d.onBtnClick(i => {
						if (i === 1) {
							this.randomPick();
							this.$emit('triggerMusic', 'button');
						}
					});
				});
				return;
			}
			this.totalWin = 0;
			this.trueWin = 0;
			this.showLoading = true;
			fetch('/highfreq/roulette/bet', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					betInfo,
					continuousCnt: 1,
					currentNum: 1
				})
			}).then(res => res.json()).then(res => {
				this.showLoading = false;
				if (res.login === false) {
					this.$popupLogin.show();
					return;
				}
				if (res.bizCode === 10000) {
					this.showBet = (this.currentBet + this.totalStake) / 10000;
					this.balance -= this.totalStake;
					this.$emit('toggleRoulette', true);
					this.$nextTick(() => {
						EventBus.$emit('roulette_start', {
							...res.data,
							type: 'default'
						});
						this.$emit('startAutoPlay', 'wheel');
					});
					this.totalWin = +res.data.winningAmount;
					this.trueWin = this.totalWin; // 非连续投注没返奖，暂时不处理
					this.lastBet = betInfo; // 更新上一次投注信息
					this.lastResponse = res.data; // 记录上一次下单的相应数据
					// this.historyStack.unshift({
					// 	result: res.data.result,
					// 	color: resultToColor[res.data.result],
					// 	status: res.data.winningStatus === 1 ? 1 : '',
					// 	bet: this.getBetSum(betInfo),
					// 	winningAmount: +res.data.winningAmount
					// });
					// this.getBalance();
				} else if (res.bizCode === 4200) { // 余额不足
					this.getBalance();
					const d = this.$dialog({
						title: 'Balance Insufficient',
						content: 'There is not enough balance in your account to palce this bet.',
						button: ['LATER', 'DEPOSIT']
					});
					d.onMounted(() => {
						d.onBtnClick(i => {
							this.$dialog();
							if (i === 1) {
								setRecord(pagePath.roulette);
								window.location.href = URL.addPara(userCenterUrl.deposit, {
									source: 'roulette'
								});
							}
						});
					});
				} else if (res.bizCode === 4220) {
					this.$dialog({
						title: null,
						content: lockedMessage,
						button: ['OK']
					});
				} else {
					this.$dialog({
						title: null,
						content: res.message || defaultMessage,
						button: ['OK']
					});
				}
			}).catch(() => {
				this.showLoading = false;
				this.$dialog({
					title: null,
					content: defaultMessage,
					button: ['OK']
				});
			});
		},
		getBetSum(betInfo) {
			let sum = 0;
			Object.keys(betInfo).forEach(key => {
				sum += betInfo[key];
			});
			return sum;
		},
		resultToast() {
			if (+this.trueWin > 0) {
				this.$nextTick(() => {
					this.$dialog({
						title: null,
						css: 'win-toast',
						content: winToast,
						contentData: {
							winningAmount: formatNumber(this.totalWin, 2)
						},
						button: [],
						timeout: 2000
					});
					this.getBalance();
					this.showWin = this.currentWin;
					this.$emit('triggerMusic', 'win');
				});
			} else {
				this.$toast('Sorry, you lost.'); // lost弹窗
			}
		},
		stopAutoPlay() {
			this.stopFlag = true;
			this.$emit('triggerMusic', 'button');
		},
		toggleMusic(val) {
			this.$emit('toggleMusic', val);
		},
		noop() {},
		animateEnd() { // 中奖弹窗等
			this.$emit('stopAutoPlay', 'wheel');
			if (this.lastResponse) {
				this.historyStack.unshift({
					result: this.lastResponse.result,
					color: resultToColor[this.lastResponse.result],
					status: this.lastResponse.winningStatus === 1 ? 1 : '',
					bet: this.getBetSum(this.lastBet),
					winningAmount: +this.lastResponse.winningAmount
				});
				if (this.lastResponse.inContinuousBet && !this.stopFlag) { // 连续投注
					this.getBalance();
					this.$nextTick(() => {
						this.showWin = this.currentWin;
					});
					const betInfo = this.getBetInfo();
					this.autoSpin(betInfo, this.plan);
				} else { // 连续投注最后一次或者非连续投注
					if (this.stopFlag) {
						this.stopFlag = false;
						this.lastResponse = '';
					}
					setTimeout(() => {
						this.$emit('toggleRoulette', false);
						this.resultToast();
						this.reset();
					}, 2000);
				}
			} else {
				console.log('no last response');
			}
		},
		detectAutoPlay() {
			return fetch('/highfreq/roulette/continuousContext').then(res => res.json()).then(res => {
				if (res.bizCode === 10000 && res.data && res.data.inContinuousBet) {
					const left = res.data.continuousCnt - res.data.currentNum;
					const d = this.$dialog({
						title: 'Game Countinue',
						css: 'm-game-continue',
						content: `${left <= 1 ? left + ' round' : left + ' rounds'} left，do you want to continue the last game?`,
						button: ['QUIT', 'RESUME'],
					});
					d.onMounted(() => {
						d.onBtnClick(i => {
							if (i === 1) { // 继续自动投注
								console.log('continue auto');
							}
						});
					});
					return res.data;
				}
				return false;
			}).catch(e => {
				console.log(e);
				return false;
			});
		},
		goShare() {
			this.overlayClick();
			this.share();
		},
		share() {
			this.showShare = true;
		},
		goDeposit() {
			if (!window.loginStatus) {
				this.overlayClick();
				this.$popupLogin.show();
				return;
			}
			window.location.href = URL.addPara(userCenterUrl.deposit, {
				source: 'roulette'
			});
		},
		goWithdraw() {
			if (!window.loginStatus) {
				this.overlayClick();
				this.$popupLogin.show();
				return;
			}
			window.location.href = userCenterUrl.withdraw;
		},
		back() {
			// window.location.href = pagePath.home;
			window.history.go(-1);
		},
		closeShare() {
			this.showShare = false;
		},
		goTips() {
			this.$emit('toggleGuide', true);
		},
		goLogin() {
			if (!window.loginStatus) {
				this.$popupLogin.show();
				return;
			}
			this.loginStatus = true;
			this.init();
		},
		handleLoginStatus() {
			if (window.loginStatus) {
				this.init(); // 登录后拿用户相关数据
				this.loginStatus = true;
				this.$popupLogin && this.$popupLogin.close();
				// this.checkClearTip();
			}
		}
	},
	destroyed() {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	mounted() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		EventBus.$on('roulette_end', this.animateEnd);
		EventBus.$on('rebet', this.rebet);
		EventBus.$on('stop_auto_play', this.stopAutoPlay);
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

@keyframes slide-out {
	0% {
		transform: scale(1, 0);
	}
	75% {
		transform: scale(1, 1.2);
	}
	100% {
		transform: scale(1, 1);
	}
}
#m-roulette {
	position: relative;
	height: 100%;
	// height: 100vh;
	background: linear-gradient(to bottom, #8042af, #111961);
	.m-roulette-overlay {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		opacity: 0;
		z-index: 999;
	}
	.setting-tip {
		position: absolute;
		z-index: 9999;
		top: 35/@rem;
		right: 8/@rem;
		padding: 0 13/@rem;
		height: 34/@rem;
		line-height: 34/@rem;
		font-size: 12/@rem;
		vertical-align: middle;
		color: @dark;
		background-color: @white;
		border-radius: 17/@rem;
		.icon-close {
			margin-left: 12/@rem;
			line-height: 34/@rem;
			vertical-align: middle;
			.m-icon-delete();
			&::before {
				color: #CCC9C9;
			}
		}
		.setting-arrow {
			position: absolute;
			top: -4/@rem;
			right: 50/@rem;
			width: 8/@rem;
			height: 8/@rem;
			background-color: @white;
			transform: rotate(45deg);
		}
	}
	.setting-wrap {
		position: absolute;
		z-index: 9999;
		top: 35/@rem;
		right: 18/@rem;
		width: 86/@rem;
		background-color: #6225c2;
		font-size: 12/@rem;
		color: @white;
		animation: slide-out 0.3s;
		transform-origin: top;
		.setting-menu {
			line-height: 36/@rem;
			padding-left: 16/@rem;
			&.middle {
				border-top: 1px solid #8150CE;
				border-bottom: 1px solid #8150CE;
			}
			&:active {
				background-color: #330974;
			}
		}
		.setting-arrow {
			position: absolute;
			top: -5/@rem;
			right: 38/@rem;
			width: 10/@rem;
			height: 10/@rem;
			background-color: #6225c2;
			transform: rotate(45deg);
		}
	}
	.clear-tip-wrap {
		position: absolute;
		left: 50%;
		bottom: 30%;
		transform: translateX(-50%);
		padding-bottom: 40/@rem;
		z-index: 9999;
	}
	.clear-tip {
		position: relative;
		background: @white;
		border-radius: 17/@rem;
		padding: 0 12/@rem;
		line-height: 34/@rem;
		font-size: 12/@rem;
		white-space: nowrap;
		.icon-close {
			margin-left: 9/@rem;
			line-height: 34/@rem;
			vertical-align: middle;
			.m-icon-delete();
			&::before {
				color: #CCC9C9;
			}
		}
		.clear-arrow {
			position: absolute;
			bottom: -5/@rem;
			left: 50%;
			transform: translateX(-50%) rotate(45deg);
			width: 10/@rem;
			height: 10/@rem;
			background: @white;

		}
	}
	.clear-wrap {
		position: absolute;
		bottom: 30%;
		left: 0;
		text-align: center;
		width: 100%;
		z-index: 49;
		.clear-btn {
			display: inline-block;
			width: 83/@rem;
			height: 33/@rem;
			font-size: 12/@rem;
			text-align: center;
			line-height: 36/@rem;
			color: @white;
			background-image: url('../images/clear-btn.png');
			background-repeat: no-repeat;
			background-size: contain;
			background-position: bottom;
			&.disable {
				background-image: url('../images/clear-btn--disable.png');
			}
		}
	}
	.m-header {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 20;
		.title-row {
			display: flex;
			position: relative;
			align-items: center;
			justify-content: center;
			background-color: rgba(0, 0, 0, 0.8);
			line-height: 36/@rem;
			height: 36/@rem;
			.back-btn {
				flex: 0 0 auto;
				width: 32/@rem;
				height: 20/@rem;
				line-height: 20/@rem;
				text-align: center;
				margin-left: 7/@rem;
				border: 1px solid @white;
				border-radius: 7/@rem;
				background-color: @darker;
				.icon-back {
					color: @white;
					.m-icon-wap-back();
				}
			}
			.balance-text {
				margin-left: 5/@rem;
				flex: 0 0 auto;
				color: @white;
				font-size: 15/@rem;
				font-weight: 600;
			}
			.login-btn {
				margin-left: 5/@rem;
				padding: 0 3/@rem;
				flex: 0 0 auto;
				border: 1px solid @white;
				border-radius: 7/@rem;
				line-height: 20/@rem;
				font-size: 14/@rem;
				background-color: @darker;
				color: @white;
			}
			.blank-block {
				flex: 1 1 auto;
			}
			.share-btn {
				flex: 0 0 auto;
				height: 20/@rem;
				width: 20/@rem;
				line-height: 20/@rem;
				border-radius: 5/@rem;
				background-color: @white;
				text-align: center;
				.icon-share {
					.m-icon-share();
					&::before {
						color: @darker;
						font-size: 14/@rem;
					}
				}
			}
			.icon-tips {
				margin-left: 15/@rem;
				flex: 0 0 auto;
				height: 24/@rem;
				width: 20/@rem;
				line-height: 24/@rem;
				border-radius: 10/@rem;
				background-color: @darker;
				text-align: center;
				transform: rotate(180deg);
				transform-origin: center;
				.m-icon-tips();
				&::before {
					color: @white;
					font-size: 24/@rem;
				}
			}
			.guide-btn {
				padding: 0 12/@rem;
				flex: 0 0 auto;
				border: 1px solid @white;
				border-radius: 7/@rem;
				line-height: 20/@rem;
				font-size: 12/@rem;
				background-color: @darker;
				color: @white;
			}
			.icon-setting {
				margin-left: 12/@rem;
				flex: 0 0 auto;
				line-height: 20/@rem;
				.m-icon-setting();
				&::before {
					font-size: 18/@rem;
					color: @white;
				}
			}
			.icon-music {
				margin: 0 14/@rem;
				flex: 0 0 auto;
				height: 24/@rem;
			}
		}
		.stake-row {
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: rgba(0, 0, 0, 0.5);
			line-height: 38/@rem;
			.num-wrap {
				flex: 1 1 auto;
				font-size: 13/@rem;
				color: @white;
				text-align: center;
				font-weight: 600;
			}
		}
	}
	.m-roulette-wrap {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 21.5%;
		background-image: url('../images/roulette.png');
		background-repeat: no-repeat;
		background-size: 90%;
		background-position: bottom;
		z-index: 1;
	}

	.table-wrap {
		position: absolute;
		top: 22.8%;
		left: 0;
		width: 100%;
		height: 47.97%;
		box-sizing: border-box;
		padding-top: 42/@rem;
		padding-bottom: 42/@rem;
		background-image: url('../images/table.png');
		background-repeat: no-repeat;
		background-size: 96% 100%;
		background-position: center;
		.history-wrap {
			position: absolute;
			top: 4/@rem;
			left: 16%;
			width: 68%;
			// color: @white;
			font-size: 12/@rem;
			font-weight: 600;
			line-height: 32/@rem;
			background: rgba(0, 0, 0, 0.5);
			border-radius: 5/@rem;
			height: 32/@rem;
			box-sizing: border-box;
			padding: 4/@rem;
			display: flex;
			align-items: center;
			justify-content: center;
			color: @white;
			.history-label {
				flex: 0 0 auto;
				font-size: 12/@rem;
				font-weight: bold;
			}
			.history-list {
				flex: 1 1 auto;
				margin-left: 4/@rem;
				margin-right: 4/@rem;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				.history-item {
					position: relative;
					margin-right: 2/@rem;
					flex: 0 1 18/@rem;
					height: 18/@rem;
					line-height: 18/@rem;
					border-radius: 50%;
					text-align: center;
					background: @green;
					&.green {
						background-color: @green;
					}
					&.black {
						background-color: @darker;
					}
					&.red {
						background-color: #d41624;
					}
					.icon-win {
						position: absolute;
						width: 14/@rem;
						bottom: -4/@rem;
						left: 3/@rem;
					}
				}
			}
			.history-list-scroll {
				margin-left: 4/@rem;
				margin-right: 4/@rem;
				overflow-x: scroll;
				overflow-y: hidden;
				white-space: nowrap;
				.history-item {
					display: inline-block;
					position: relative;
					margin-right: 6/@rem;
					width: 18/@rem;
					height: 18/@rem;
					line-height: 18/@rem;
					border-radius: 50%;
					text-align: center;
					background: @green;
					&.green {
						background-color: @green;
					}
					&.black {
						background-color: @darker;
					}
					&.red {
						background-color: #d41624;
					}
					.icon-win {
						position: absolute;
						z-index: 10;
						left: 3/@rem;
					}
				}
			}
			.history-list-blank {
				flex: 1 1 auto;
				margin-left: 10/@rem;
				// text-align: center;
				font-size: 12/@rem;
				color: @white;
				font-weight: 500;
				opacity: 0.5;
				font-weight: 500;
			}
			.history-btn {
				flex: 0 0 auto;
				height: 100%;
				color: @white;
				padding: 0 10/@rem;
				border: none;
				font-weight: 500;
				font-size: 12/@rem;
				border-radius: 2/@rem;
				background: linear-gradient(to bottom, #0C790E, #0FBF13);
				.arrow {
					.m-icon-arrow--right();
					&::before {
						font-size: 10/@rem;
						position: relative;
						left: 3/@rem;
					}
				}
				.arrow:first-child {
					margin-right: -10/@rem;
				}
			}
		}
		.selection-wrap {
			height: 100%;
			width: 67.8%;
			overflow: hidden;
			border: 1px solid @dark;
			background: @white;
			margin: auto;
			box-sizing: border-box;
			border: 1px solid @dark;
			border-bottom-left-radius: 50/@rem;
			border-bottom-right-radius: 50/@rem;
			.num-area {
				height: 67.2%;
				display: flex;
				align-items: center;
				justify-content: center;
				.num-block {
					height: 100%;
					height: calc(100% - 2px);
					flex: 1 1 auto;
					border: 1px solid @dark;
					&.green {
						background-color: @green;
						flex: 1 1 42/@rem;
						&:active {
							.light {
								background-image: url('../images/0@1x.svg');
							}
						}
					}
					&.black {
						background-color: @darker;
						flex: 1 1 45/@rem;
						&:active {
							.light {
								background-image: url('../images/1-12@1x.svg');
							}
						}
					}
					&.red {
						background-color: #d41624;
						flex: 1 1 45/@rem;
						&:active {
							.light {
								background-image: url('../images/1-12@1x.svg');
							}
						}
					}
					&.yellow {
						background-color: #fc9d00;
						flex: 1 1 27/@rem;
						&:active {
							.light {
								background-image: url('../images/C@1x.svg');
							}
						}
					}
				}
				.num-right {
					// width: 203/@rem;
					flex: 5 5 203/@rem;
					height: 100%;
				}
				.num-row {
					height: 33.33%;
					display: flex;
					align-items: center;
					justify-content: center;
					&.highlight {
						.num-block {
							&.black {
								.light {
									background-image: url('../images/1-12@1x.svg');
								}
							}
							&.red {
								.light {
									background-image: url('../images/1-12@1x.svg');
								}
							}
							&.yellow {
								.light {
									background-image: url('../images/C@1x.svg');
								}
							}
						}
					}
				}
			}
			.special-area {
				height: 32.8%;
				background-color: #02593C;
				.color-row {
					height: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					.color-block {
						height: 100%;
						height: calc(100% - 2px);
						width: 123/@rem;
						flex: 1 1 auto;
						border: 1px solid @dark;
						&:active {
							.light {
								background-image: url('../images/RedBlack@1x.svg');
							}
						}
					}
					.m-block-body {
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						&.black {
							.block-diamond {
								margin-right: 0;
								margin-left: 12/@rem;
								.diamond-top {
									border-bottom: 11/@rem solid @darker;
								}
								.diamond-bottom {
									border-top: 11/@rem solid @darker;
								}
							}
						}
						.block-diamond {
							flex: 0 0 auto;
							width: 44/@rem;
							margin-right: 12/@rem;
							.diamond-top {
								width: 0;
								height: 0;
								border-left: 22/@rem solid #02593C;
								border-right: 22/@rem solid #02593C;
								border-bottom: 11/@rem solid @red;
							}
							.diamond-bottom {
								width: 0;
								height: 0;
								border-left: 22/@rem solid #02593C;
								border-right: 22/@rem solid #02593C;
								border-top: 11/@rem solid @red;
							}
						}
						.block-wrap {
							flex: 0 0 auto;
							.block-label {
								text-align: center;
								line-height: 1;
								font-size: 12/@rem;
								font-weight: 600;
								color: @white;
							}
							.block-odd {
								text-align: center;
								line-height: 12/@rem;
								font-size: 12/@rem;
								transform: scale(0.67);
								font-weight: 600;
								color: @white;
							}
						}
					}
				}
				.range-row {
					height: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					.block-1-6, .block-7-12 {
						height: 100%;
						height: calc(100% - 2px);
						width: 68/@rem;
						flex: 1 1 auto;
						border: 1px solid @dark;
						&.m-block .block-label {
							font-size: 12/@rem;
						}
					}
					.block-1-6.m-block {

						.block-odd {
							transform-origin: right;
						}
						&:active {
							.light {
								background-image: url('../images/1-6@1x.svg');
							}
						}
					}
					.block-7-12.m-block {

						.block-odd{
							transform-origin: left;
						}
						.placed-chip {
							left: 0;
						}
						.stake-num {
							left: 0;
							transform-origin: top left;
						}
						&:active {
							.light {
								background-image: url('../images/7-12@1x.svg');
							}
						}
					}
					.odd-block, .even-block {
						height: 100%;
						height: calc(100% - 2px);
						width: 58/@rem;
						flex: 1 1 auto;
						border: 1px solid @dark;
						&.m-block .block-label {
							font-size: 12/@rem;
						}

						&:active {
							.light {
								background-image: url('../images/OddEven@1x.svg');
							}
						}
					}
				}
			}
		}
	}
	.total-stake-row {
		position: absolute;
		bottom: 14%;
		width: 100%;
		height: 14/@rem;
		font-size: 12/@rem;
		line-height: 14/@rem;
		text-align: center;
		color: @white;
		font-weight: 500;
	}
	.button-wrap {
		position: absolute;
		padding: 0 9/@rem;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		bottom: 1.3%;
		left: 0;
		.action-btn {
			flex: 1 1 26.6%;
			height: 38/@rem;
			background-repeat: no-repeat;
			background-size: contain;
			background-position-y: bottom;
			&.left {
				background-image: url('../images/rebet.png');
				&:active {
					background-image: url('../images/rebet--active.png');
				}
				&.disable {
					background-image: url('../images/rebet--disable.png');
				}
			}
			&.middle {
				flex: 1 1 46.6%;
				height: 50/@rem;
				background-image: url('../images/spin.png');
				&:active {
					background-image: url('../images/spin--active.png');
				}
			}
			&.right {
				position: relative;
				background-image: url('../images/auto-play.png');
				&:active {
					background-image: url('../images/auto-play--active.png');
				}
				.icon-reward {
					position: absolute;
					top: -16/@rem;
					height: 25/@rem;
					right: -4/@rem;
				}
			}
		}
	}
}

.round-to-play {
	&.es-dialog.m-dialog {
		padding: 0;
	}
	.es-dialog-main.m-dialog-main {
		padding: 0;
	}
}
.win-toast {
	&.es-dialog.m-dialog {
		padding: 0;
		width: 230/@rem;
		height: 180/@rem;
		background-color: transparent;
		background-image: url('../images/win-bgd.png');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
	.es-dialog-main.m-dialog-main {
		padding: 0;
	}
	.es-dialog-body.m-dialog-body {
		background-color: transparent;
	}
}
</style>
