<template>
	<AfTable class="market-content" v-if="isShow">
		<!-- 一行2个·或者3个的情况 -->
		<template v-if="showType === 'type_2' || showType=== 'type_3'">
			<AfTableRow>
				<OutcomeCell v-for="(id) in outcomeOrder"
				:class="{
					'm-outcome-two': showType === 'type_2',
					'm-outcome-three': showType === 'type_3',
					'm-outcome-odds-des': true
				}"
				:outcomeId="id"
				:market="market"
				:key="id">
					<template v-if="outcomes[id].isActive === 1 && market.status === 0"><em>{{outcomes[id].desc}}</em><em>{{outcomes[id].odds}}</em></template>
					<template v-else><em>{{outcomes[id].desc}}</em><em class="m-icon-lock"></em></template>
				</OutcomeCell>
			</AfTableRow>
		</template>

		<!-- 2行 4个 -->
		<template v-else-if="showType === 'type_4'">
			<AfTableRow>
				<OutcomeCell v-for="index in 2"
					:outcomeId="outcomeOrder[index - 1]"
					:market="market"
					class="m-outcome-two m-outcome-odds-des"
					:key="outcomeOrder[index - 1]">
					<template v-if="outcomes[outcomeOrder[index - 1]].isActive === 1 && market.status === 0">
						<em>{{outcomes[outcomeOrder[index - 1]].desc}}</em>
						<em>{{outcomes[outcomeOrder[index - 1]].odds}}</em>
					</template>
					<template v-else>
						<em>{{outcomes[outcomeOrder[index - 1]].desc}}</em>
						<em class="m-icon-lock"></em>
					</template>
				</OutcomeCell>
			</AfTableRow>
			<AfTableRow>
				<OutcomeCell v-for="index in 2"
				:outcomeId="outcomeOrder[index + 1]"
				:market="market"
				class="m-outcome-two m-outcome-odds-des"
				:key="outcomeOrder[index + 1]">
					<template v-if="outcomes[outcomeOrder[index + 1]].isActive === 1 && market.status === 0">
						<em>{{outcomes[outcomeOrder[index + 1]].desc}}</em>
						<em>{{outcomes[outcomeOrder[index + 1]].odds}}</em>
					</template>
					<template v-else>
						<em>{{outcomes[outcomeOrder[index + 1]].desc}}</em>
						<em class="m-icon-lock"></em>
					</template>
				</OutcomeCell>
			</AfTableRow>
		</template>

		<!-- 大于4个的 一行显示3个不够的补齐-->
		<template v-else>
			<AfTableRow v-for="index in Math.ceil(outcomeOrder.length/3)" :key="index">
				<template v-for="i in 3">
					<OutcomeCell v-if="!!outcomes[outcomeOrder[3 * index - 4 + i]]"
						:outcomeId="outcomeOrder[3 * index - 4 + i]"
						:market="market"
						class="m-outcome-three m-outcome-odds-des"
						:key="outcomeOrder[3 * index - 4 + i]">
						<template v-if="outcomes[outcomeOrder[3 * index - 4 + i]].isActive === 1 && market.status === 0">
							<em>{{outcomes[outcomeOrder[3 * index - 4 + i]].desc}}</em>
							<em>{{outcomes[outcomeOrder[3 * index - 4 + i]].odds}}</em>
						</template>
						<template v-else>
							<em>{{outcomes[outcomeOrder[3 * index - 4 + i]].desc}}</em>
							<em class="m-icon-lock"></em>
						</template>
					</OutcomeCell>
					<!-- 不够的用afTableCell填充 -->
					<AfTableCell v-else  class="m-outcome-three" :key="i"></AfTableCell>
				</template>
			</AfTableRow>
		</template>

	</AfTable>
</template>
<script>
import { AfTable, AfTableRow, AfTableCell } from 'packages/tableLayout';
import OutcomeCell from './outcomeCell.vue';

export default {
	components: {
		AfTable,
		AfTableRow,
		OutcomeCell,
		AfTableCell
	},
	model: {
		prop: 'isShow',
		event: 'isShow'
	},
	props: {
		isShow: {
			type: Boolean,
			'default': true
		},
		market: {
			type: Object,
			required: true,
		},
		marketType: {
			type: String,
			required: true
		}
	},
	created () {
		if (this.outcomeOrder.length > 4) {
			this.$emit('isShow', false);
		}
	},
	computed: {
		// 当前能显示的outComes-- 这里可以控制是否需要删除不是active的outcome
		// 去除不能显示的market
		currentOutComes () {
			const outcomes = {};
			const outcomeOrder = [];
			if (this.market && this.market.outcomeOrder && this.market.outcomeOrder.length) {
				const out = this.market.outcomes;
				this.market.outcomeOrder.forEach(id => {
					if (out[id]) {
						outcomes[id] = out[id];
						outcomeOrder.push(id);
					}
				});
			}
			return {
				outcomes,
				outcomeOrder
			};
		},
		outcomes () {
			return this.currentOutComes.outcomes;
		},
		outcomeOrder () {
			return this.currentOutComes.outcomeOrder;
		},
		showType () {
			const order = this.outcomeOrder;
			if (order.length) {
				const l = order.length;
				if (l === 2) {
					return 'type_2';
				} else if (l === 3) {
					return 'type_3';
				} else if (l === 4) {
					return 'type_4';
				}
			}
		}
	}
};
</script>

<style lang="less">
@import './outcome.less';
</style>

