<template lang="html">
	<div class="m-table--col">
		<div class="m-table-row">
			<div class="m-table-cell m-outcome-title" :style="getColTitleStyle">
				 <span></span>
			</div>
			<template v-for="titleItem in colTitle">
				<div class="m-table-cell m-outcome-title" :style="getColTitleStyle">
					<span>{{titleItem}}</span>
				</div>
			</template>
		</div>
		<div class="m-table-row m-outcome" v-for="rowItem in colData">
			<div class="m-table-cell m-outcome-title" :style="getColTitleStyle">
				 <span>{{rowItem.title}}</span>
			</div>
			<template v-if="keySet.length" v-for="(item,idx) in rowItem">
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
						'm-table-cell-item',
						{
							'm-icon-arrow--up': keyItem === 'odds' && item.statusDesc === 'up',
							'm-icon-arrow--down': keyItem === 'odds' && item.statusDesc === 'down'
						}
					]">{{getShowValue(keyItem, item, key)}}</span>
			   </template>
			   <template v-else>
				  <span
				  	v-if="canRender(keyItem, item, key)"
					:class="[
						'm-table-cell-item',
						{
							'm-icon-arrow--up': keyItem === 'odds' && item.statusDesc === 'up',
							'm-icon-arrow--down': keyItem === 'odds' && item.statusDesc === 'down'
						}
					]">{{getShowValue(keyItem, item, key)}}</span>
			  </template>
			  <span
	   		    v-if="isDisable(item, key)"
	   			class="m-table-cell-item m-icon-lock"
	   		  ></span>
			 </BetTableCell>
			</template >
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
		colTitle: {
			type: Array,
			'default': []
		},
		colData: {
			type: Object
		}
	}
};
</script>
