<template>
	<div class="testimonials-wrap">
		<div class="words-operation operation-left" @click="goLeft"></div>
		<div class="words-wrap">
			<WordsCard v-for="(item, index) in words" :key="index" v-show="index === activeIndex" :words="item.words" :author="item.author" />
		</div>
		<div class="words-operation operation-right" @click="goRight"></div>
	</div>
</template>
<script>
import WordsCard from './words-card.vue';
import testimonialKeWords from './testimonials-ke.js';
import testimonialNgWords from './testimonials-ng.js';

export default {
	components: {
		WordsCard
	},
	data() {
		return {
			words: window.country === 'ke' ? testimonialKeWords : testimonialNgWords,
			activeIndex: 0
		};
	},
	computed: {
		len() {
			return this.words.length;
		}
	},
	methods: {
		goLeft() {
			this.changeActiveIndex(-1);
		},
		goRight() {
			this.changeActiveIndex(1);
		},
		changeActiveIndex(offset) {
			let index = this.activeIndex;
			const len = this.len;
			index += offset;
			if (index < 0) {
				index = index % len + len;
			}
			if (index >= len) {
				index %= len;
			}
			this.activeIndex = index;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';
.testimonials-wrap{
	display: flex;
	align-items: center;
	margin-bottom: 30/@rem;
	.words-wrap{
		flex: 1;
	}
	.operation-left{
		.m-icon-back();
	}
	.operation-right{
		.m-icon-arrow--right();
	}
	.words-operation{
		width: 48/@rem;
		height: 48/@rem;
		text-align: center;
		color: #353a45;
		&::before{
			font-size: 32/@rem;
			line-height: 48/@rem;
			cursor: pointer;

		}
	}
}
</style>
