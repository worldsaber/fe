<template>
	<AfTable class="market-content" v-if="isShow">
		<template v-for="(data, index) in parseComboMarket()">
			<AfTableRow :key="index" v-if="index === 0">
				<AfTableCell v-for="title in data"
				class="m-outcome-row-combo-title m-outcome-three m-outcome-combo-title"
				:key="title"><em>{{title}}</em></AfTableCell>
			</AfTableRow>
			<AfTableRow :key="`1-${j}`" v-if="index === 1" v-for="(res, j) in data">
				<template v-for="(one, i) in res">
					<OutcomeCell v-if="i > 0"
					class="m-outcome-combo m-outcome-three m-outcome-only-odds"
					:outcomeId="one.id"
					:market="market"
					:key="`${j}-${i}`"><em v-if="one.isActive === 1 && market.status === 0">{{one.odds}}</em><em v-else class="m-icon-lock"></em></OutcomeCell>
					<!-- 第一行title用文字填充 -->
					<AfTableCell v-else :key="`${j}-${i}`" class="m-outcome-three m-outcome-combo-column-title m-outcome-only-odds m-outcome-combo-title">{{one}}</AfTableCell>
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
		}
	},
	created () {
		if (this.currentOutComes.outcomeOrder.length > 4) {
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
				return {
					outcomes: this.market.outcomes,
					outcomeOrder: this.market.outcomeOrder
				};
			}
			return {
				outcomes,
				outcomeOrder
			};
		}
	},
	methods: {
		// 在当前market是comboMarket的时候有用，转换其数据
		// 通过转换filterOutcomesMixins注入的数据
		parseComboMarket () {
			const { outcomeOrder, outcomes } = this.currentOutComes;
			const data = [];
				// title的第一个格子一定是空
			const title = [''];
				// 转换成二维
			const result = {};
			const keys = [];
			const index = 0;
			for (let i = 0, l = outcomeOrder.length; i < l; i++) {
				const id = outcomeOrder[i];
				const desc = outcomes[id].desc.split('&');
					// 将名字拆解保存到outcome上，这个值不受监控
				outcomes[id].descFirst = desc[0].trim();
				if (desc[1]) {
					outcomes[id].descSecond = desc[1].trim();
				}
				const tmp = outcomes[id].descFirst;
				if (!result[tmp]) {
					result[tmp] = [];
						// 保存顺序
					keys.push(tmp);
				}
				result[tmp].push(outcomes[id]);
			}

			// // 为了保证顺序将每个数组下的元素全部处理成一样的顺序
			const first = result[keys[0]];
				// 取出第一个元素的顺序
				// 没有行列转换默认是1
			const constFirstKeys = first.map(cur => (index === 0 ? cur.descSecond : cur.descFirst));
				// 其他元素必须按照第一个元素的顺序展示
			for (let i = 1; i < keys.length; i++) {
				const key = keys[i];
				const old = result[key];
				const newRes = [];
				for (const o of constFirstKeys) {
						// 没有行列转换默认是1
					const t = old.find(cur => cur[index === 0 ? 'descSecond' : 'descFirst'] === o);
					if (t) {
						newRes.push(t);
					}
				}
				if (newRes.length === old.length) {
					result[key] = newRes;
				}
			}

				// 准备title
			for (const k of first) {
				title.push(index === 0 ? k.descSecond : k.descFirst);
			}
				// 准备每行数据
			for (const key of keys) {
					// 加入横向标题
				result[key].unshift(key);
				data.push(result[key]);
			}
			return [title, data];
		},
	}
};
</script>
<style lang="less">
@import './outcome.less';
</style>

