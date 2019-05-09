<template>
	<div class="m-million">
		<div class="m-header">

		</div>
		<div class="m-issue-wrap" v-loading="isLoading">
			<timer class="m-timer" v-show="!isLoading" :startTime="issue.endTime + curDeltaTime" :status="status" @end="issueEnd"/>
			<div v-show="!isLoading">
				<div v-if="isSpectator" class="m-spectator-mode">You are under Spectator Mode...</div>
				<div class="m-issue-title-wrap">
					<span class="m-issue-index">{{issue.number ? issue.number + '.' : ''}} </span>
					<p class="m-issue-text">{{issue.title}}</p>
				</div>
				<div :class="'m-selection-wrap ' + sel.className + (isSpectator ? ' spectator' : '')" v-for="(sel,index) in issue.options" :key="index" @click="pick(sel)">
					<div class="percent-bar" :style="`width:${sel.percent};`"></div>
					<span class="m-selection-index">{{sel.showNumber}}. </span>
					<p class="m-selection-text">{{sel.content}}</p>
					<span class="m-selection-amount" v-if="showAnswer">{{sel.amount}}</span>
					<div class="m-selection-loading" v-if="submiting && selected === sel.number"><div class="loading"/></div>
				</div>
			</div>
		</div>
		<div class="m-heat-title">Heat Index</div>
		<div class="kenya-heat">
			<div :class="'country-wrap' + (country === 'ke' ? ' myteam' : '')">
				<img class="country-icon" src="../image/kenya-icon.png"/>
				<div class="country-label">
					Kenya
					<img class="my-team" v-if="country === 'ke'" src="../image/my-team.svg"/>
				</div>
			</div>
			<div class="heat-wrap" v-if="kenyaHeat">
				<img class="heat-winner" v-if="winner==='home'" src="../image/winner.png"/>
				<div class="heat-value home" :style="`width: ${kenyaHeatWidth}`">{{kenyaHeat}}</div>
			</div>
		</div>
		<div class="nigeria-heat">
			<div :class="'country-wrap' + (country === 'ng' ? ' myteam' : '')">
				<img class="country-icon" src="../image/nigeria-icon.png"/>
				<div class="country-label">
					Nigeria
					<img class="my-team" v-if="country === 'ng'" src="../image/my-team.svg"/>
				</div>
			</div>
			<div class="heat-wrap" v-if="nigeriaHeat">
				<img class="heat-winner" v-if="winner==='away'" src="../image/winner.png"/>
				<div class="heat-value" :style="`width: ${nigeriaHeatWidth}`">{{nigeriaHeat}}</div>
			</div>
		</div>
		<p class="winner-rule">All participants of the Winning Country will obtain a Cash Gift</p>
	</div>
</template>

<script>
import cookie from 'storage/cookie';
import { isEmptyObject, formatNumber } from 'utils';
import 'components/loading';
import { mapState, mapMutations } from 'vuex';
import { UPDATE_IS_SPECTATOR, UPDATE_GIFT, UPDATE_HEAT, UPDATE_CURRENT_LIVES } from 'store/issue/mutationTypes';
import timer from './timer.vue';
import commonMixin from '../js/commonMixin.js';
import countDialog from './countDialog.vue';
import noAuthDialog from './noAuthDialog.vue';
import giftToast from './giftToast.vue';

const selectionIndex = ['A', 'B', 'C', 'D', 'E', 'F'];
const retryConfig = 3;

export default {
	components: {
		timer
	},
	mixins: [
		commonMixin
	],
	data() {
		return {
			showAnswer: false,
			country: window.country,
			issue: '',
			status: '',
			answer: '', // 用户选择的选项
			amount: 0, // 当前用户数
			giftAmount: 0, // 当前获得红包
			isLoading: true,
			kenyaHeat: '',
			kenyaHeatWidth: '0%',
			nigeriaHeat: '',
			nigeriaHeatWidth: '0%',
			startTime: (new Date()).getTime() + 14000,
			submiting: false,
			showCountDialog: false,
			winner: '', // 国家热度winner
			deltaRealTime: 0,
			deltaMode: 'delta', // 补偿模式, delta通过计算与服务器时间差值补偿; 'polling'轮询获取结果，不补偿时间。
			currentNum: '',
			selected: '',
			questionRetry: 0,
			answerRetry: 0
		};
	},
	created() {
		let now;
		now = (new Date()).getTime();
		if (now >= this.baseInfo.endTime + this.deltaTime) { // 期次已结束
			this.$router.go(-1);
		} else { // 期次未结束
			const timestamp = this.baseInfo.startTime;
			const timerId = setInterval(() => {
				now = (new Date()).getTime();
				if (now >= timestamp + this.curDeltaTime) {
					this.fetchQuestion();
					clearInterval(timerId);
				}
			}, 100);
		}
	},
	mounted() {

	},
	computed: {
		...mapState('issue', [
			'baseInfo',
			'timeConfig',
			'subjectSize',
			'isSpectator',
			'gift',
			'deltaTime',
			'currentPeriodLives'
		]),
		curDeltaTime() {
			return this.deltaRealTime !== 0 ? this.deltaRealTime : this.deltaTime;
		}
	},
	methods: {
		...mapMutations('issue', {
			updateIsSpectator: UPDATE_IS_SPECTATOR,
			changeGift: UPDATE_GIFT,
			changeHeat: UPDATE_HEAT,
			updateCurrentLives: UPDATE_CURRENT_LIVES
		}),
		fetchQuestion() {
			this.isLoading = true;
			const fetchStart = (new Date()).getTime();
			const userId = cookie('userId') || '';
			fetch(`/promotion/v1/activities/quiz/subject/${userId}${this.currentNum ? '?number=' + this.currentNum : this.currentNum}`, {
				method: 'GET'
			}).then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					const fetchEnd = (new Date()).getTime();
					if (fetchEnd - fetchStart > 1000) {
						this.deltaMode = 'polling';
					} else {
						this.deltaMode = 'delta';
						this.deltaRealTime = fetchEnd - res.data.ts;
					}
					if (res.data.options.length > 0) { // 拿到题目了
						this.isLoading = false;
						this.issue = this.format(res.data);
						this.currentNum = res.data.number;
						this.giftAmount = formatNumber(res.data.userTotalPrize / 10000);
						this.updateCurrentLives(res.data.currentPeriodLives);
						this.kenyaHeat = res.data.homeHot / 100 > 0 ? formatNumber(res.data.homeHot / 100) + '%' : '0%';
						this.nigeriaHeat = res.data.awayHot / 100 > 0 ? formatNumber(res.data.awayHot / 100) + '%' : '0%';
						this.kenyaHeatWidth = this.formatHeatWidth(res.data.homeHot);
						this.nigeriaHeatWidth = this.formatHeatWidth(res.data.awayHot);
						this.winner = res.data.homeHot > res.data.awayHot ? 'home' : 'away';

						this.issue.userTotalPrize && this.changeGift(this.issue.userTotalPrize / 10000);

						if (res.data.homeHot === res.data.awayHot) {
							this.winner = ''; // 这里有可能相等
						}
						if (res.data.userAnswer) {
							this.answer = res.data.userAnswer;
							for (let i = 0; i < this.issue.options.length; i++) {
								if (this.issue.options[i].number === this.answer) {
									this.issue.options[i].className = 'selected';
								}
							}
						}

						this.changeHeat({
							home: this.kenyaHeat,
							homeWidth: this.kenyaHeatWidth,
							away: this.nigeriaHeat,
							awayWidth: this.nigeriaHeatWidth,
							winner: this.winner
						});

						if (this.issue.userStatus === 0 && !this.isSpectator) {
							this.updateIsSpectator(0); // 围观模式
							const d = this.$dialog({
								title: null,
								css: 'm-issue-auth',
								content: noAuthDialog,
								contentData: {
									type: 'late'
								},
								button: []
							});
							d.onMounted(() => {
								d.$content.$on('exit', () => {
									this.backHome();
									this.$dialog();
								});
								d.$content.$on('goSpectator', () => {
									this.$dialog();
								});
							});
						}
					} else { // 没拿到
						let timestamp;
						if (this.questionRetry < retryConfig) {
							this.questionRetry++;
							if (!this.issue) {
								timestamp = this.baseInfo.startTime;
							} else {
								timestamp = this.issue.endTime + 1000 * (this.timeConfig.resultWaitingTime + this.timeConfig.nextSubjectTime);
							}
							this.fix(this.deltaMode, this.fetchQuestion, 1000, timestamp);
						}
					}
				} else {
					this.$dialog(res.message);
					this.isLoading = false;
				}
			}).catch(e => {
				this.isLoading = false;
				console.log(e);
			});
		},
		fix(mode, callback, delay, timestamp) {
			if (mode === 'polling') {
				setTimeout(() => {
					callback();
				}, delay);
			} else {
				let now;
				const timerId = setInterval(() => {
					now = (new Date()).getTime();
					if (now >= timestamp + this.curDeltaTime) {
						callback();
						clearInterval(timerId);
					}
				}, 100);
			}
		},
		format(issue) {
			issue.options && issue.options.forEach(option => {
				option.showNumber = selectionIndex[option.number - 1];
				option.percent = '0%';
				option.amount = 0;
				option.className = '';
			});
			return issue;
		},
		formatHeatWidth(heat) {
			if (!heat) {
				return '20%';
			}
			return (20 + heat / 10000 * 80 / 3) + '%';
		},
		fetchAnswer() {
			fetch('/promotion/v1/activities/quiz/result', {
				method: 'GET'
			}).then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					if (isEmptyObject(res.data)) { // 没拿到答案
						if (this.answerRetry < retryConfig) {
							this.answerRetry++;
							const timestamp = this.issue.endTime + 1000 * this.timeConfig.resultWaitingTime;
							this.fix(this.deltaMode, this.fetchAnswer, 500, timestamp);
						}
					} else {
						if (res.data.answer === this.answer) {
							this.status = 'right';
							if (res.data.eachUserPrize > 0) {
								const d = this.$dialog({
									title: null,
									css: 'm-issue-toast',
									content: giftToast,
									width: '100%',
									contentData: {
										gift: formatNumber(res.data.eachUserPrize / 10000),
										giftType: res.data.giftType
									},
									timeout: 2000,
									button: [],
								});
								d.onMounted(() => {
									d.setPosition({
										top: '10%'
									});
								});
								res.data.eachUserPrize && this.changeGift(this.gift + (res.data.eachUserPrize / 10000));
							}
						} else if (!this.isSpectator) {
							this.status = 'wrong';
							if (this.currentPeriodLives > 0 && this.issue.number < this.subjectSize) { // 本轮当前可以复活
								const titleBar = this.$parent.$refs.titleBar;
								console.log(titleBar);
								if (titleBar) {
									titleBar.animate();
								}
								if (res.data.eachUserPrize > 0) { // 答错了复活也会有红包
									const d = this.$dialog({
										title: null,
										css: 'm-issue-toast',
										content: giftToast,
										width: '100%',
										contentData: {
											gift: formatNumber(res.data.eachUserPrize / 10000),
											giftType: res.data.giftType
										},
										timeout: 2000,
										button: [],
									});
									d.onMounted(() => {
										d.setPosition({
											top: '10%'
										});
									});
									res.data.eachUserPrize && this.changeGift(this.gift + (res.data.eachUserPrize / 10000));
								}
							} else { // 不可复活, 错误弹窗
								let now;
								const timestamp = this.issue.endTime + 1000 * (this.timeConfig.resultWaitingTime + 3); // 回答错误后三秒钟显示错误弹窗
								const timerId = setInterval(() => {
									now = (new Date()).getTime();
									if (now >= timestamp + this.curDeltaTime) {
										let contentData;
										this.updateIsSpectator(0); // 围观模式
										if (this.answer === '') {
											contentData = {
												type: 'noAnswer'
											};
										} else {
											contentData = {
												type: 'wrong',
												questionNum: this.issue.number
											};
										}
										const d = this.$dialog({
											title: null,
											css: 'm-issue-auth',
											content: noAuthDialog,
											contentData,
											button: []
										});
										d.onMounted(() => {
											// d.$content.$on('exit', () => {
											// 	this.backHome();
											// 	this.$dialog();
											// });
											d.$content.$on('goExtraLives', () => {
												this.$router.replace({
													name: 'extraLives'
												});
											});
											d.$content.$on('goSpectator', () => {
												this.$dialog();
											});
											const mask = d.$el.querySelector('.mask');
											const dbody = d.$el.querySelector('.m-issue-auth.es-dialog.m-dialog');
											mask && (mask.style['z-index'] = '1999');
											dbody && (dbody.style['z-index'] = '2000');
										});
										clearInterval(timerId);
									}
								}, 100);
							}
						}

						let allUser = 0;
						this.showAnswer = true;
						const result = res.data.optionResults;
						result && result.forEach(result => {
							allUser += result.selectedUser;
						});
						this.issue.options.forEach((option, i) => {
							if (option.number === res.data.answer) {
								option.className = 'right';
							} else if (option.number === this.answer) {
								option.className = 'wrong';
							} else {
								option.className = 'normal';
							}
							option.amount = formatNumber(result[i].selectedUser);
							option.percent = 100 * result[i].selectedUser / allUser + '%';
						});
					}
				} else {
					this.$dialog();
				}
			}).catch(e => {
				console.log(e);
			});
		},
		issueEnd() {
			const timestamp = this.issue.endTime + 1000 * this.timeConfig.resultWaitingTime;
			let now,
				countEl;
			const timerId = setInterval(() => {
				now = (new Date()).getTime();
				if (this.issue.endTime + this.curDeltaTime < now && now < timestamp + this.curDeltaTime && !this.showCountDialog) {
					countEl = this.$dialog({
						title: null,
						css: 'm-issue-counting',
						content: countDialog,
						contentData: {
							nextPeriodTime: this.baseInfo.nextPeriodTime
						},
						button: []
					});
					this.showCountDialog = true;
				}
				if (now >= timestamp + this.curDeltaTime) {
					clearInterval(timerId);
					this.answerRetry = 0;
					this.fetchAnswer();

					countEl && countEl.close();
					this.showCountDialog = false;
					this.nextSubjectTimer();
				}
			}, 100);
		},
		nextSubjectTimer() {
			const timestamp = this.issue.endTime + 1000 * (this.timeConfig.resultWaitingTime + this.timeConfig.nextSubjectTime);
			// 下一道题的开始时间
			let now;
			const timerId = setInterval(() => {
				now = (new Date()).getTime();
				if (now >= timestamp + this.curDeltaTime) {
					clearInterval(timerId);
					this.showAnswer = false;
					this.answer = '';
					this.issue.options.forEach(option => {
						option.percent = '0%';
						option.className = '';
					});
					this.status = '';
					if (this.issue.number >= this.subjectSize) {
						// 结束
						this.$dialog();
						this.$router.replace({ name: 'quizOver' });
					} else if (this.currentNum < this.subjectSize) {
						this.currentNum++;
						this.questionRetry = 0;
						this.fetchQuestion();
					}
				}
			}, 80);
		},
		pick(sel) {
			if (!this.submiting && !this.answer && this.issue.userStatus === 1 && !this.isSpectator) {
				this.submiting = true;
				this.selected = sel.number;
				const userId = cookie('userId') || '';
				fetch(`/promotion/v1/activities/quiz/answer/${userId}`, {
					method: 'POST',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({
						number: this.issue.number,
						selectedOption: sel.number,
						ts: Date.now() - this.curDeltaTime,
						delta: this.curDeltaTime,
						timer: this.issue.endTime + this.curDeltaTime - Date.now()
					})
				}).then(res => res.json()).then(res => {
					this.submiting = false;
					this.selected = '';
					if (res.bizCode === 10000 && res.data.isAnswered) {
						this.answer = sel.number;
						sel.className = 'selected';
					}
				}).catch(e => {
					this.submiting = false;
					this.selected = '';
					console.log(e);
				});
			}
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-million {
	position: absolute;
	min-height: 100%;
	background-image: linear-gradient(to bottom, #2b0098, #7c2bb7);

	.m-header {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 11/@rem;
		padding-bottom: 37/@rem;
		background: transparent;
		line-height: 30/@rem;
		.m-label {
			flex: 0 0 auto;
			color: @white;
			opacity: 0.5;
			font-size: 12/@rem;
			&.gift {
				flex: 1 1 auto;
				text-align: right;
			}
		}
		.m-value {
			flex: 0 0 auto;
			color: @white;
			font-size: 16/@rem;
			margin-left: 6/@rem;
			margin-right: 20/@rem;
		}
	}

	.m-issue-wrap {
		position: relative;
		margin-top: 67/@rem;
		margin-left: 15/@rem;
		margin-right: 15/@rem;
		padding-top: 40/@rem;
		padding-bottom: 26/@rem;
		background-color: @white;
		border-radius: 10/@rem;

		.m-timer {
			position: absolute;
			top: -28/@rem;
			left: 50%;
			margin-left: -28/@rem;
		}

		.m-spectator-mode {
			color: #ff175f;
			font-size: 12/@rem;
			line-height: 14/@rem;
			font-weight: 500;
			text-align: center;
		}

		.m-issue-title-wrap {
			display: flex;
			align-items: flex-start;
			justify-content: center;
			padding: 8/@rem 21/@rem 40/@rem 21/@rem;
			font-size: 16/@rem;
			line-height: 19/@rem;
			color: @dark;

			.m-issue-index {
				flex: 0 0 auto;
				margin-right: 6/@rem;
			}
			.m-issue-text {
				flex: 1 1 auto;
			}
		}
		.m-selection-wrap {
			display: flex;
			// align-items: flex-start;
			align-items: center;
			justify-content: center;
			position: relative;
			z-index: 1;
			overflow: hidden;
			margin-left: 25/@rem;
			margin-right: 25/@rem;
			margin-bottom: 12/@rem;
			padding: 12/@rem 20/@rem;
			font-size: 16/@rem;
			line-height: 20/@rem;
			border-radius: 26/@rem;
			box-shadow: 0 0 12/@rem 0 @midGray;

			&.selected {
				color: @white;
				background-color: #692bff;
			}
			&.spectator {
				color: #787B83;
				background-color: #eaecef;
			}
			&.right {
				.percent-bar {
					background-color: #00dfa1;
				}
			}
			&.wrong {
				.percent-bar {
					background-color: #ff175f;
				}
			}
			.percent-bar {
				position: absolute;
				top: 0;
				left: 0;
				background-color: @midGray;
				width: 0%;
				height: 100%;
				z-index: -1;
				transition: width 0.4s ease;
			}
			.m-selection-index {
				flex: 0 0 auto;
				margin-right: 6/@rem;
			}
			.m-selection-text {
				flex: 1 1 auto;
			}
			.m-selection-loading {
				flex: 0 0 auto;
				.loading{
					.m-icon-loading-circle();
					animation: circles 1s infinite;
					animation-timing-function: linear;
					&:before{
						height: 16/@rem;
						width: 16/@rem;
						line-height: 20/@rem;
						font-size: 16/@rem;
					}
				}
			}
			.m-selection-amount {
				flex: 0 0 auto;
				margin-left: 6/@rem;
				font-size: 12/@rem;
				color: #787B83;
			}
		}
	}

	.m-heat-title {
		margin-top: 27/@rem;
		margin-bottom: 14/@rem;
		text-align: center;
		font-size: 16/@rem;
		color: @white;
		font-weight: bold;
		line-height: 19/@rem;
	}

	.nigeria-heat {
		display: flex;
		align-items: center;
		justify-content: flex-start;

		.heat-winner {
			position: absolute;
			left: 6/@rem;
			top: 22/@rem;
		}
	}

	.kenya-heat {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 15/@rem;

		.heat-winner {
			position: absolute;
			left: 6/@rem;
			top: -18/@rem;
		}

	}
	.country-wrap {
		flex: 0 0 auto;
		display: flex;
		height: 32/@rem;
		align-items: center;
		justify-content: center;
		&.myteam {
			background-color: #692bff;
			border-bottom-right-radius: 16/@rem;
			border-top-right-radius: 16/@rem;
		}
		.country-icon {
			flex: 0 0 auto;
			margin-left: 20/@rem;
			width: 26/@rem;
			height: 26/@rem;
			margin-right: 10/@rem;
		}
		.country-label {
			flex: 0 0 auto;
			width: 60/@rem;
			position: relative;
			color: @white;
			font-size: 14/@rem;
			line-height: 16/@rem;
			font-weight: bold;
			.my-team {
				position: absolute;
				top: -20/@rem;
				left: 0;
			}
		}
	}
	.heat-wrap {
		flex: 1 1 auto;
		margin-left: 10/@rem;
		margin-right: 12/@rem;
		position: relative;

		.heat-value {
			display: inline-block;
			width: 0%;
			text-align: center;
			font-size: 14/@rem;
			line-height: 18/@rem;
			border-radius: 12/@rem;
			background-color: #237dff;
			color: @white;
			font-weight: bold;
			&.home {
				background-color: #ffa600;
			}
		}
	}

	.winner-rule {
		margin-top: 13/@rem;
		padding: 0 36/@rem 17/@rem 36/@rem;
		font-size: 12/@rem;
		text-align: left;
		color: @white;
	}
}

.m-issue-counting.es-dialog.m-dialog {
	padding: 0;
	border-radius: 10/@rem;
	background-color: transparent;
	.es-dialog-main {
		padding: 0;
	}
}

.m-issue-auth.es-dialog.m-dialog {
	border-radius: 10/@rem;
}
</style>
