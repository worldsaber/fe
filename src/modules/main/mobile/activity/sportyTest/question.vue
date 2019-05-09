<template>
	<div class="sporty-question-wrap">
		
		<div class="question-topic-wrap">
			<div class="question-topic">{{question.topic}}</div>
			<div class="question-options">
				<Option :option="option" :selected="selected" v-for="(option, index) in formatOptions" :key="`${next}-${index}`" @selected="onSelected"/>
			</div>
			<div class="question-next-btn" @click="onNext" v-show="selected">Next</div>
		</div>
	</div>
</template>
<script>
import dialog from 'components/dialog';
import Option from './option.vue';
import NamePrompt from './namePrompt.vue';
import { shuffle } from './util.js';

const seqMap = ['A', 'B', 'C', 'D'];

export default {
	props: {
		questions: {
			type: Array,
			required: true
		}
	},
	components: {
		Option,
		NamePrompt,
	},
	data() {
		return {
			step: [],
			next: 0,
			selected: null,
			userName: '',
		};
	},
	computed: {
		question() {
			return this.questions[this.next];
		},
		options() {
			const options = this.question.options;
			return shuffle(options);
		},
		formatOptions() {
			return this.options.map((opt, index) => ({
				seq: seqMap[index],
				...opt
			}));
		},
	},
	methods: {
		onSelected(value) {
			this.selected = value;
		},
		onNext() {
			if (!this.selected) {
				dialog.toast('please select an option!');
				return;
			}

			this.step[this.question.subNo] = this.selected;

			// 判断是否是最后一个
			if (this.next === this.questions.length - 1) {
				// 弹层姓名输入框
				const dlg = dialog({
					css: 'dialog-sporty-test',
					content: NamePrompt,
					contentData: {
						callback: value => {
							this.userName = value;
							this.$emit('next', {
								userName: this.userName,
								answers: this.step
							});
							dlg.close();
						}
					},
					button: []
				});
			} else {
				this.next++;
				this.selected = null;
			}
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import './font/font.less';

.sporty-question-wrap{
	flex: 1;
	background: url('./image/question-back.png') no-repeat;
	background-size: contain;
	background-position: bottom center;
	width: 100%;
	overflow-y: auto;
}
.question-topic-wrap{
	width: 100%;
}
.question-topic{
	width: 288/@rem;
	margin-left: 16/@rem;
	margin-top: 24/@rem;
	font-size: 26/@rem;
	font-weight: bold;
	color: #FFF;
	letter-spacing: 0;
	line-height: 1;
	font-family: 'MyriadPro';
}
.question-options{
	margin: 40/@rem 16/@rem 0;
}
.question-next-btn{
	height: 55/@rem;
	width: 200/@rem;
	line-height: 55/@rem;
	text-align: center;
	color: #1b1e25;
	border-radius: 4/@rem;
	background-color: #c6ff00;
	box-shadow: 0 6/@rem 0 0 rgba(0, 0, 0, 0.5);
	cursor: pointer;
	margin: 20/@rem auto;
	font-size: 22/@rem;
	font-weight: bold;
	font-family: 'MyriadPro';
}
</style>

