<template>
	<div class="m-number-wrap" :style="`height: ${heightPx}px; width: ${widthPx}px; left: ${leftPx}px;`">
		<img :class="['single-number', {'point': number.name === 'point'}]" v-for="number in numbers" :src="number.src"/>
	</div>
</template>

<script>
import numberMap from '../js/number.js';

export default {
	props: {
		value: {
			type: Number,
			require: true
		}
	},
	data() {
		let fontSize = getComputedStyle(document.body, null).fontSize || '12px';
		fontSize = +fontSize.substr(0, fontSize.length - 2);
		return {
			height: 17,
			pointHeight: 5,
			width: 0,
			fontSize
		};
	},
	computed: {
		numbers() {
			const numbers = [];
			let value = this.value / 10000;
			if (value >= 1000) {
				value = parseFloat(value / 1000) + 'K';
			}
			value.toString().split('').forEach(char => {
				if (char === '.') {
					numbers.push({
						name: 'point',
						src: numberMap.point.src
					});
					this.width += Math.ceil(this.pointHeight / numberMap.point.height * numberMap.point.width);
				} else {
					numbers.push({
						name: char,
						src: numberMap[char].src
					});
					this.width += Math.ceil(this.height / numberMap[char].height * numberMap[char].width);
				}
			});
			return numbers;
		},
		left() {
			return 45 / 2 - this.width / 2;
		},
		heightPx() {
			return this.height / 12 * this.fontSize;
		},
		widthPx() {
			return this.width / 12 * this.fontSize;
		},
		leftPx() {
			return this.left / 12 * this.fontSize;
		}
	}
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';

.m-number-wrap {
	position: absolute;
	top: 8/@rem;
	z-index: 5;
	height: 17/@rem;
	line-height: 17/@rem;
	font-size: 0;
	white-space: nowrap;
	.single-number {
		height: 17/@rem;	
		display: inline-block;
		vertical-align: bottom;
		&.point {
			height: 5/@rem;
		}
	}
}
</style>
