<template>
	<div class="m-block">
		<div class="stake-num" v-if="stake > 0">{{showStake}}</div>
		<img :class="['placed-chip', 'chip-' + i]" v-for="(chip, i) in showPick" :key="i" :src="tableChipMap[chip]"/>
		<div class="light"/>
		<slot>
			<div class="block-body">
				<div :class="['block-label', {'yellow': data.color === 'yellow'}]">{{data.label}}</div>
				<div :class="['block-odd', {'yellow': data.color === 'yellow'}]">{{data.odd}}</div>
			</div>
		</slot>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	props: {
		data: {
			type: Object,
			'default': () => ({
				label: '',
				odd: '',
				color: ''
			})
		},
		pick: {
			type: Array,
			'default': () => []
		},
		tableChipMap: {
			type: Object,
			'default': () => ({})
		}
	},
	data() {
		return {
			stake: 0 // 筹码总额,不一定和显示的筹码相等
		};
	},
	computed: {
		...mapState('roulette', ['chips']),
		showPick() {
			let stake = 0;
			let showPick = [];
			this.pick.forEach(pick => {
				stake += pick;
				if (this.chips.indexOf(pick) > -1) {
					showPick.push(pick); // 正常筹码
				} else { // 非正常拼一拼
					showPick = showPick.concat(this.constructRebetChip(pick, this.chips));
				}
			});
			this.stake = stake;

			const start = showPick.length - 5 < 0 ? 0 : showPick.length - 5;
			return showPick.slice(start);
		},
		showStake() {
			return parseFloat(this.stake / 10000, 10);
		}
	},
	methods: {
		constructRebetChip(totalStake, chips) {
			const pick = [];
			let stake = totalStake;
			let currentChip;
			for (let i = chips.length - 1; i > -1; i--) {
				currentChip = chips[i];
				while (stake >= currentChip) {
					stake -= currentChip;
					pick.push(currentChip);
				}
			}
			return pick;
		}
	}
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';

.m-block {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	.light {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
	.stake-num {
		position: absolute;
		top: 0;
		right: 0;
		font-size: 12/@rem;
		color: @white;
		transform: scale(0.5);
		transform-origin: top right;
	}
	.placed-chip {
		position: absolute;
		bottom: 0;
		right: 0;
		height: 13/@rem;
		&.chip-1 {
			bottom: 1.5px;
		}
		&.chip-2 {
			bottom: 3px;
		}
		&.chip-3 {
			bottom: 4.5px;
		}
		&.chip-4 {
			bottom: 6px;
		}
	}
	.block-label {
		//padding-top: 26%;
		text-align: center;
		line-height: 1;
		font-size: 20/@rem;
		font-weight: 600;
		color: @white;
		&.yellow {
			line-height: 24/@rem;
			font-size: 14/@rem;
			vertical-align: top;
		}
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
</style>
