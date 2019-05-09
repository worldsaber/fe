<template>
	<div class="m-betslip-coin">
		<div class="m-coin-wrap">
			<i class="m-block"/>
			<ul class="radio-group">
				<li class="radio-item" v-for="(item, index) in group" :key="index" @click="select(item)">
					<div class="icon-select" v-if="item.value === payMode">
						<div class="icon-select-inner"/>
					</div>
					<div class="icon-unselect" v-else/>{{item.label}}
				</li>
			</ul>
			<div class="usable-amount">Usable: <span>{{currency}} {{formatCoin}}</span></div>
		</div>
	</div>
</template>

<script>
import {
	LS
} from 'storage';
import { mapState, mapGetters, mapMutations } from 'vuex';
import { UPDATE_PAY_MODE } from 'store/betslip/mutationTypes';

export default {
	props: {
		totalStake: {
			type: Number,
			'default': 0
		}
	},
	data() {
		return {
			currency: window.currency,
			group: [{
				value: 1,
				label: 'SportyCoins'
			}, {
				value: 0,
				label: 'Balance'
			}]
		};
	},
	computed: {
		...mapState('betslip', ['payMode', 'currentType']),
		...mapState('assetsInfo', ['coin']),
		...mapGetters('assetsInfo', ['formatCoin'])
	},
	methods: {
		...mapMutations('betslip', [UPDATE_PAY_MODE]),
		select(item) {
			this.updatePayMode(item.value);
		}
	},
	watch: {
		totalStake(val) {
			if (val > this.coin && this.payMode !== 1) {
				this.updatePayMode(0); // 手动使用balance
			}
		},
		currentType: {
			handler(val) {
				if (val !== 'system') {
					let payMode = LS.get(`wap_${val}_tab_paymode`) || '0';
					if (this.coin <= 0) {
						payMode = 0;
					}
					this.updatePayMode(+payMode);
				}
			},
			immediate: true
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-betslip-coin {
	text-align: right;
	justify-content: flex-end;
	.m-coin-wrap {
		position: relative;
		display: inline-block;
		padding: 12/@rem 8/@rem;
		vertical-align: middle;
		width: 254/@rem;
		background-color: @thinGreen;
		.m-block {
			position: absolute;
			right: 12/@rem;
			top: -6/@rem;
			display: inline-block;
			width: 12/@rem;
			height: 12/@rem;
			background-color: @thinGreen;
			transform: rotate(45deg);
			transform-origin: center;
		}
		.radio-group {
			list-style: none;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.radio-item {
				flex: 0 0 auto;
				white-space: nowrap;
				font-size: 12/@rem;
				font-weight: 500;
				line-height: 16/@rem;
				.icon-unselect {
					margin-right: 6/@rem;
					display: inline-block;
					vertical-align: top;
					width: 14/@rem;
					height: 14/@rem;
					border: 1px solid @darkGray;
					border-radius: 7/@rem;
					background-color: @white;
				}
				.icon-select {
					margin-right: 6/@rem;
					position: relative;
					display: inline-block;
					vertical-align: top;
					width: 16/@rem;
					height: 16/@rem;
					border-radius: 8/@rem;
					background-color: @green;
					.icon-select-inner {
						position: absolute;
						background-color: @white;
						border-radius: 3/@rem;
						top: 5/@rem;
						left: 5/@rem;
						width: 6/@rem;
						height: 6/@rem;
						z-index: 1;
					}
				}
			}
		}
		
		.usable-amount {
			margin-top: 3/@rem;
			margin-left: 22/@rem;
			font-size: 12/@rem;
			text-align: left;
			line-height: 16/@rem;
			span {
				color: @green;
			}
		}
	}
}
</style>
