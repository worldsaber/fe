<template>
	<div class="sporty-test-wrap">
		<Header class="sporty-header" v-show="!isShare"/>
		<Players v-if="isPlayers" @next='onNextPlayers'/>
		<Welcome v-if="isWelcome" @next="onNextWelcome"/>
		<Question v-if="isQuestion" :questions="questions" @next="onNextQuestion" />
		<Share v-if="isShare" :imageId="step.imageId" :userName="step.userName" :shareImage="step.shareImage"/>
	</div>
</template>
<script>
import dialog from 'components/dialog';
import { pagePath } from 'config/pageConfig';
import Header from './header.vue';
import Players from './players.vue';
import Welcome from './welcome.vue';
import Question from './question.vue';
import Share from './share.vue';
// import { questions } from './data';
import { shuffle } from './util.js';
import shareImageMap from './image/player/index';
import TestFinished from './finished.vue';

export default {
	components: {
		Header,
		Players,
		Welcome,
		Question,
		Share,
	},
	data() {
		return {
			step: {
				type: 'players'
			},
			questions: [],
		};
	},
	computed: {
		isWelcome() {
			return this.step.type === 'welcome';
		},
		isPlayers() {
			return this.step.type === 'players';
		},
		isQuestion() {
			return this.step.type === 'question';
		},
		isShare() {
			return this.step.type === 'share';
		}
	},
	created() {
		const loading = document.querySelector('#pageLoading');
		loading.style.display = 'none';

		this.getQuestionsList();
	},
	methods: {
		getQuestionsList() {
			fetch('/promotion/v1/activities/quizgame/subjects', {
				headers: new Headers({
					'Content-Type': 'application/json',
				}),
				method: 'POST'
			})
			.then(res => res.json())
			.then(res => {
				if (res.bizCode === 10000) {
					const data = res.data;
					const subjects = data.subjects || [];
					let questions = subjects.map((sub, index) => {
						const options = sub.options.map(opt => ({
							label: opt.optCtt,
							value: opt.score,
							no: opt.optNo
						}));
						return {
							topic: sub.subCtt,
							options,
							subNo: index // sub.subNo
						};
					});
					// 最后一题不参与shuffle
					const len = questions.length;

					if (len > 1) {
						questions = [...shuffle(questions.slice(0, -1)), questions[len - 1]];
					}
					this.questions = questions;
				}
			});
		},
		onNextWelcome() {
			const empty = this.checkQuestionNum();
			if (empty) {
				return;
			}
			this.step = {
				type: 'question',
			};
		},
		onNextPlayers() {
			// 判断题目是否存在
			const empty = this.checkQuestionNum();
			if (empty) {
				return;
			}
			this.step = {
				type: 'welcome'
			};
		},
		onNextQuestion(payload) {
			// 计算分数
			const answers = payload.answers;
			let sum = 0;
			for (const opt of answers) {
				sum += opt.value;
			}

			// const path = answers.map(opt => opt.no).join('');
			// let player = PlayersPath.find(item => item.reg.test(path));
			// // 如果没有匹配的, 随机选取一个
			// if (!player) {
			// 	const index = Math.floor(Math.random() * PlayersPath.length);
			// 	player = PlayersPath[index];
			// }

			// 根据分数 生成 分享图片
			this.getShareImage(sum, payload.userName)
			.then(({ imageId, remark }) => {
				const shareImage = shareImageMap[remark];
				this.step = {
					type: 'share',
					userName: payload.userName,
					score: sum,
					imageId,
					shareImage
				};
			});
		},
		getShareImage(score, name) {
			return fetch('/promotion/v1/activities/quizgame/url', {
				headers: new Headers({
					'Content-Type': 'application/x-www-form-urlencoded'
				}),
				body: {
					score,
					name
				},
				method: 'POST'
			})
			.then(res => res.json())
			.then(res => {
				if (res.bizCode === 10000) {
					const data = res.data;
					return {
						imageId: data.url,
						remark: String(data.remark).trim(),  // 去除收尾空格
					};
				}
			});
		},
		checkQuestionNum() {
			const len = this.questions.length;
			if (len === 0) {
				// 弹层姓名输入框
				const dlg = dialog({
					css: 'dialog-sporty-test-finished',
					content: TestFinished,
					contentData: {
						callback: value => {
							dlg.close();
							const from = URL.getPara('from') || 'sporty_test';
							location.href = `${location.origin}${pagePath.home}?from=${from}`;
						}
					},
					button: []
				});
			}
			return len === 0;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import './font/font.less';

html, body, button, input, select, textarea{
	font-family: 'MyriadPro, Helvetica, Arial, sans-serif';
}
.sporty-test-wrap{
	display: flex;
	flex-direction: column;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: #d21011;
	overflow: hidden;
	.sporty-header{
		// position: absolute;
		z-index: 100;
		width: 100%;
		flex-shrink: 0;
	}
}




</style>

