import { mapMutations, mapGetters } from 'vuex';

import { EventBus } from 'kernel/js/eventBus.js';
import { isEmptyObject, objType } from 'utils';

import * as mutationTypes from 'store/eventDetail/mutationTypes';

import listEvent from 'config/eventConfig/listEvent.js';

export default {
	props: {
		colCount: {
			type: Number,
			required: true
		},
		// 渲染table cell的关键字列表
		keySet: {
			type: Array
		},
		// 有click事件处理的key列表
		operationKeys: {
			type: Array,
			default() {
				return [];
			}
		},
		responsiveKeys: {
			type: Array,
			default() {
				return [];
			}
		},
		betable: {
			type: Boolean,
			required: true
		},
	},
	computed: {
		...mapGetters('eventDetail', [
			'getOutcomeKey',
			'getBetDetail'
		]),
		hasData() {
			return !isEmptyObject(this.colData);
		},
		getColStyle() {
			return {
				width: (100 / this.colCount) + '%'
			};
		},
		getColTitleStyle() {
			return {
				width: (100 / this.colCount) + '%',
				'max-width': (100 / this.colCount) + '%'
			};
		}
	},
	methods: {
		...mapMutations('eventDetail', {
			updateCheckList: mutationTypes.UPDATE_SELECT_LIST,
		}),
		getCellKey(item) {
			if (objType(item.id) === 'undefined') {
				return '';
			}

			return item.id;
		},
		resolveKey(key) {
			return key.split('__');
		},
		checkStatus(item) {
			return this.rootTable.checkedList.includes(`${this.rootTable.tableKey}_${item.id}`);
		},
		isresponsive(item) {
			if (!this.responsiveKeys.length) {
				return true;
			}
			return this.responsiveKeys.includes(item);
		},
		renderCell(item, key) {
			let ret = false;

			if (key.indexOf('__') !== -1) {
				const keys = this.resolveKey(key);
				ret = keys.some(tempKey => objType(item[tempKey]) !== 'undefined');
			} else if (typeof item[key] !== 'undefined') {
				ret = true;
			}
			return ret;
		},
		handleClick(tableCell) {
			const cellData = tableCell.cellData,
				opt = {
					marketId: `${this.rootTable.tableKey}`,
					outcomeId: cellData.id,
					checked: tableCell.checkStatus
				};

			if (!tableCell.checkStatus || tableCell.checkStatus && this.betable) {
				this.updateCheckList(opt);
			}

			// 获取选中项的详细信息并通知betslips
			// key: sportId_eventId_marketId(include specifier)_outcomeId
			const key = this.getOutcomeKey(opt),
				betDetail = this.getBetDetail(opt);

			// 选中
			if (betDetail && opt.checked) {
				EventBus.$emit(listEvent.LIST_ITEM_ADD, {
					key,
					betInfo: betDetail
				});
			}

			// 取消选中
			if (key && !opt.checked) {
				EventBus.$emit(listEvent.LIST_ITEM_DELETE, key);
			}
		},
		operable(key) {
			return this.operationKeys.includes(key);
		},
		isDisable(item, key) {
			if (objType(item.space) !== 'undefined') {
				return false;
			}

			return item.disabled || !item.isActive || !this.operable(key);
		},
		getShowValue(keyItem, item, key) {
			return keyItem === 'space' ?
				'' :
				keyItem === 'odds' && this.isDisable(item, key) ?
					'- - -' :
					item[keyItem] || '- - -';
		},
		canRender(keyItem, item, key) {
			return keyItem === 'space' ?
				true :
				keyItem === 'odds' && this.isDisable(item, key) ?
					false :
					!!item[keyItem];
		}
	}
};
