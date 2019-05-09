<template lang="html">
  <div class="m-table__wrapper">
	  <BetTableHeader
		:isOpen="checkOpen"
		:titles="tableConfig.desc"
		:headerKey="tableConfig.marketId"
		:marketGuide="tableConfig.marketGuide || ''"
	  >
		<p
			:class="[
				'm-table-header-opt',
				{
					'm-icon-priority--checked': isPriority,
					'm-icon-priority': !isPriority
				}
			]"
			@click="changePriority">
		</p>
	  </BetTableHeader>
	  <BetTable v-show="checkOpen" :tableKey="tableConfig.marketId" :checkedList="checkedList || []">
		  <template v-if="tableConfig.showType === 'A'" v-for="rowItem in getShowList.rowData">
			  <BetTableRow
				:colData="rowItem"
				:colCount="getShowList.colCount"
				:keySet="getRenderKey()"
				:operationKeys="getOpertaionKeys()"
				:responsiveKeys="getReactKeys()"
				:betable="betable"
				></BetTableRow>
		  </template>
		  <template v-if="tableConfig.showType === 'B'">
			  <BetTableCol
				:colTitle="getShowList.colTitle"
				:colData="getShowList.rowData"
				:colCount="getShowList.colTitle.length + 1"
				:keySet="getRenderKey()"
				:operationKeys="getOpertaionKeys()"
				:responsiveKeys="getReactKeys()"
				:betable="betable"
				></BetTableCol>
		  </template>
	  </BetTable>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
import { objType } from 'utils';

import * as mutationTypes from 'store/eventDetail/mutationTypes';

import { modifyCombineData, modifyListData } from './commonFun';
import BetTable from './table/betTable.vue';
import BetTableRow from './table/outcomeTableRow.vue';
import BetTableHeader from './table/betTableHeader.vue';
import BetTableCol from './table/outcomeTableCol.vue';

export default {
	components: {
		BetTable,
		BetTableRow,
		BetTableHeader,
		BetTableCol
	},
	props: {
		tableConfig: {
			type: Object,
			'default': null
		}
	},
	computed: {
		checkOpen() {
			return !this.packedList.includes(this.tableConfig.marketId);
		},
		...mapState('eventDetail', [
			'priorityMarketKeys'
		]),
		...mapState('betslip', [
			'betable'
		]),
		...mapGetters('eventDetail', {
			checkedList: 'currentCheckedList',
			packedList: 'getPackMarket'
		}),
		isPriority() {
			return this.priorityMarketKeys.includes(this.tableConfig.marketId);
		},
		getShowList() {
			const type = this.tableConfig.showType || 'A',
				list = [...this.tableConfig.list] || [];

			switch (type) {
			case 'A':
				return modifyListData(list);
			case 'B':
				return modifyCombineData(list);
			default:
				return [];
			}
		}
	},
	methods: {
		...mapMutations('eventDetail', {
			setPriority: mutationTypes.SET_MARKET_PRIORITY
		}),
		changePriority(event) {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			const tableConfig = this.tableConfig || {},
				marketId = tableConfig.marketId || '';

			if (marketId) {
				this.setPriority(marketId);
			}
		},
		getRenderKey() {
			const config = this.tableConfig || {};
			const ret = [];

			if (config.showType === 'B') {
				ret.push('title');
				ret.push('odds');
			}

			if (config.showType === 'A') {
				if (+config.status === 1) {
					ret.push('desc');
				} else {
					ret.push('desc__odds');
				}
			}

			if (objType(config.showType) !== 'null') {
				ret.push('space');
			}

			return ret;
		},
		getOpertaionKeys() {
			const config = this.tableConfig || {};
			if (+config.status === 0) {
				return config.showType === 'B' ? ['odds'] : ['desc__odds'];
			}
			return [];
		},
		getReactKeys() {
			const config = this.tableConfig || {};
			if (+config.status === 0) {
				return config.showType === 'B' ? ['odds'] : ['desc__odds'];
			}
			return [];
		}
	}
};
</script>

<style lang="less">
@import './table/index.less';
.m-table__wrapper {
	position: relative;

	&:last-of-type {
		.m-outcome {
			border-bottom: none;
		}
	}
}
</style>
