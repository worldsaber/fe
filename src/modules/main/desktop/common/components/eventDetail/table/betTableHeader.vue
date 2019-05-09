<template lang="html">
	<AfTable class="m-table-header">
		<AfTableRow>
			<template
				v-for="(item,index) in titleList">
				<TableCell @click="changeOpenStatus">
					<i :class="[
						'm-icon--bg',
						{
							'm-icon--unfold': !isOpen,
							'm-icon--fold': isOpen
						}
					]"></i>
					<span class="m-table-header-title">{{item.name}}</span>
					<div class="m-tips" v-if="index === 0 && marketGuide">
						<i class="m-icon-tips"></i>
						<PopOver
							position="bottom"
							:content="marketGuide"
							v-if="marketGuide"
							:style="getPopStyle(marketGuide)"
						></PopOver>
					</div>
				</TableCell>
			</template>
			<TableCell>
				<div class="m-table-operation">
					<slot></slot>
				</div>
			</TableCell>
		</AfTableRow>
	</AfTable>
</template>

<script>
import { mapMutations } from 'vuex';

import 'packages/tableLayout';

import * as mutationTypes from 'store/eventDetail/mutationTypes';

import PopOver from 'components/popOver';

import TableCell from './betTableCell.vue';

export default {
	name: 'BetTableHeader',

	componentName: 'BetTableHeader',

	props: {
		titles: {
			type: [String, Array],
			require: true
		},
		isOpen: {
			type: Boolean,
			'default': true
		},
		headerKey: {
			type: String
		},
		marketGuide: {
			type: String,
			'default': ''
		}
	},

	components: {
		TableCell,
		PopOver
	},

	computed: {
		titleList() {
			if (Array.isArray(this.titles)) {
				return this.titles;
			}

			if (this.titles) {
				return [{ name: this.titles }];
			}

			return [];
		},
	},

	methods: {
		...mapMutations('eventDetail', {
			updatePackedList: mutationTypes.UPDATE_TABLE_PACKEDLIST
		}),
		calWidth(item, index) {
			if (item.width) {
				return item.width;
			}

			if (this.titleList.length >= 3) {
				return 1 / this.titleList.length + '%';
			}

			if (+index) {
				return '20%';
			}

			return '80%';
		},
		changeOpenStatus() {
			this.updatePackedList({
				type: this.headerKey,
				opened: !this.isOpen
			});
		},
		getPopStyle(marketGuide) {
			return `width: ${marketGuide.length * 6}px;`;
		}
	}
};
</script>
