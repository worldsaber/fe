<template>
	<div class="chip-wrap">
		<div :class="['chip-item', iconMap[i]]" v-for="(chip, i) in showChips" :key="i" @click="select(i)">
			<!-- <number :value="chip"/> -->{{chip}}
			<img class="chip-selected" v-if="value === i" src="../images/light.png">
		</div>
	</div>
</template> 

<script>
import { LS } from 'storage';
import number from './number';

export default {
	props: {
		chips: {
			type: Array,
			'default': () => []
		},
		value: {
			type: Number,
			'default': 0
		}
	},
	components: {
		number
	},
	data() {
		return {
			iconMap: ['blue', 'pp', 'black', 'ppr', 'yellow']
		};
	},
	created() {

	},
	computed: {
		showChips() {
			return this.chips.map(chip => {
				let showChip = chip / 10000;
				if (showChip >= 1000) {
					showChip = parseFloat(showChip / 1000) + 'K';
				}
				return showChip;
			});
		}
	},
	methods: {
		select(i) {
			this.$emit('input', i);
			this.$emit('change', i);
			this.$parent.$emit('triggerMusic', 'chip');
			LS.set('roulette_chip_amount', this.chips[i]);
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.chip-wrap {
	position: absolute;
	width: 100%;
	padding: 0 40/@rem;
	box-sizing: border-box;
	height: 43/@rem;
	bottom: 19.6%;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: space-around;
	.chip-item {
		position: relative;
		flex: 0 0 auto;
		height: 44/@rem;
		width: 44/@rem;
		line-height: 44/@rem;
		text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.83);
  		text-stroke: 1px #000000;
		color: @darker;
		font-weight: bold;
		text-align: center;
		font-size: 13/@rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: right bottom;
		&.blue {
			background-image: url('../images/blue.png');
		}
		&.pp {
			background-image: url('../images/pp.png');
		}
		&.ppr {
			background-image: url('../images/ppr.png');
		}
		&.black {
			background-image: url('../images/black.png');
		}
		&.yellow {
			background-image: url('../images/yellow.png');
		}
		.chip-value {
			position: absolute;
			height: 35/@rem;
			width: 45/@rem;
			line-height: 35/@rem;
			text-align: center;
			bottom: -20/@rem;
			left: 0;
		}
		.m-number-wrap {
			position: absolute;
			top: 8/@rem;
			z-index: 5;
			height: 17/@rem;
			line-height: 17/@rem;
			font-size: 13/@rem;
			color: @dark;
			white-space: nowrap;
		}
		.chip-selected {
			position: absolute;
			top: -7/@rem;
			left: -7/@rem;
			z-index: 1;
			height: 58/@rem;
		}
	}
}
</style>
