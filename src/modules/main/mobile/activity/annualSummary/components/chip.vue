<template>
	<svg class="chip-item" :width="width" :height="height" :viewBox="viewBox" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<g :transform="chip.transform" :fill="color">
				<path :d="chip.path"></path>
			</g>
		</g>
	</svg>
</template>
<script>
// 随机角度， 随机颜色，随机形状，随机动画
import anime from 'animejs';
import { chips, colors } from '../images/chip/index.js';

function random(len) {
	return Math.floor(Math.random() * len);
}

export default {
	props: {
		wh: Number,
		ht: Number,
		delay: {
			type: Number,
			'default': 0
		}
	},
	data() {
		const randChipIndex = random(chips.length);
		const randColorIndex = random(colors.length);
		return {
			chip: chips[randChipIndex],
			color: colors[randColorIndex],
			start: random(100),
			end: random(30),  // 落点在 start [-15, 15] 范围
			delayTime: this.delay + random(1000),  // 随机延迟
			duration: 4000 + random(2000),
			rotate: random(30), // 自旋转 [-15, 15]

		};
	},
	computed: {
		width() {
			return `${this.chip.width}px`;
		},
		height() {
			return `${this.chip.height}px`;
		},
		viewBox() {
			return `0 0 ${this.chip.width}, ${this.chip.height}`;
		},
	},
	mounted() {
		let end = this.start + this.end - 15;
		const deg = this.rotate - 15;

		const start = this.start / 100 * this.wh;  // 起点x坐标
		end = end / 100 * this.wh;  // 终点x坐标
		const top = -this.ht * Math.random() / 2 - 100;  // 起点y坐标
		const bottom = this.ht + 100;  // 终点y坐标

		anime({
			targets: this.$el,
			translateX: [start, end],
			translateY: [top, bottom],
			scale: [0.5, 0.5],
			rotate: [0, `${deg}deg`],
			duration: this.duration,
			delay: this.delayTime,
			easing: 'easeInSine'
		});
	}
};
</script>
<style lang="less">
.chip-item{
	position: absolute;
	z-index: 10000;
	transform-origin: center center;
}
</style>

