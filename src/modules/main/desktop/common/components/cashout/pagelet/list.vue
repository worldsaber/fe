<template lang="html">
	<div>
		<div class="m-sel-item">
			<template
				v-for="(item, index) in selections"
			>
				<div
					class="m-text-min"
					:key="item.id"
				>
					<span>{{item.home}} vs {{item.away}}</span>
				</div>
			</template>
			<div
				class="m-text-mini"
				v-if="betInfo.showMores"
			>
				<span>{{betInfo.showMores}}</span>
			</div>
		</div>
		<div class="m-bet-money">
			<div>
				<div class="m-col">
					<div class="m-col-title">{{betInfo.hasCashouted ? 'Remain Stake' : 'Bet Stake'}}</div>
					<div class="m-col-text">{{betInfo.showStake}}</div>
				</div>

				<div
					class="m-col"
					v-if="betInfo.bonus"
				>
					<div class="m-col-title">Bet Bonus</div>
					<div class="m-col-text">{{betInfo.bonus}}</div>
				</div>

				<div class="m-col">
					<div class="m-col-title">Pot. Win</div>
					<div class="m-col-text">{{betInfo.showPotWinnings}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'CashoutList',

	props: {
		betInfo: {
			type: Object
		}
	},
	computed: {
		list() {
			return this.betInfo.selectionDescs || [];
		},
		selections() {
			const list = this.list;

			if (list.length <= 3) {
				return list;
			}

			return list.slice(0, 3);
		}
	}
};
</script>
