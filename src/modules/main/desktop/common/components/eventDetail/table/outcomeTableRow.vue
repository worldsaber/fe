<template lang="html">
  <div class="m-table-row m-outcome">
	  <template v-if="keySet.length" v-for="(item, idx) in colData">
		  <BetTableCell
		   v-for="(key, index) in keySet"
		   v-if="renderCell(item, key)"
		   :style="getColStyle"
		   :key="`${idx}-${index}`"
		   @click="handleClick"
		   :operable="operable(key)"
		   :checked="checkStatus(item)"
		   :disabled="isDisable(item, key)"
		   :responsive="isresponsive(key)"
		   :cellData="item"
		   :cellKey="getCellKey(item)">
		   <template
			v-if="resolveKey(key).length >= 1"
			v-for="keyItem in resolveKey(key)">
			   <span
			    v-if="canRender(keyItem, item, key)"
				:class="[
					'm-table-cell-item', {
						'm-icon-arrow--up': keyItem === 'odds' && item.statusDesc === 'up',
						'm-icon-arrow--down': keyItem === 'odds' && item.statusDesc === 'down'
				}]">{{getShowValue(keyItem, item, key)}}</span>
		   </template>
		   <template v-else>
			  <span
			    v-if="canRender(keyItem, item, key)"
				:class="[
					'm-table-cell-item', {
						'm-icon-arrow--up': keyItem === 'odds' && item.statusDesc === 'up',
						'm-icon-arrow--down': keyItem === 'odds' && item.statusDesc === 'down'
				}]">{{getShowValue(keyItem, item, key)}}</span>
		   </template>
		   <span
		   	v-if="isDisable(item, key)"
			class="m-table-cell-item m-icon-lock"
			></span>
		 </BetTableCell>
	  </template>
	  <template v-else v-for="item in colData">
		  <BetTableCell
			v-for="(colValue, colKey) in item"
			v-if="renderCell(item, key)"
			:style="getColStyle"
			:key="colKey"
			@click="handleClick"
			:operable="operable(colValue)"
			:checked="checkStatus(item)"
			:disabled="isDisable(item, colValue)"
			:responsive="isresponsive(colValue)"
			:cellData="item"
			:cellKey="getCellKey(item)">
			 <span class="m-table-cell-item">{{colValue || '---'}}</span>
		 </BetTableCell>
	  </template>
  </div>
</template>

<script>
import BetTableCell from './betTableCell.vue';
import tableMixin from '../js/tableMixin.js';
import outcomeMixin from '../js/outcome.js';

export default {
	components: {
		BetTableCell
	},
	mixins: [tableMixin, outcomeMixin],
	props: {
		colData: {
			type: Array
		},
	}
};
</script>
