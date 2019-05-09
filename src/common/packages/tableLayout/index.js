import Vue from 'vue';
import AfTable from './table.vue';
import AfTableRow from './tableRow.vue';
import AfTableCell from './tableCell.vue';

import './index.less';

let isReadyTable = false;
let isReadyRow = false;
let isReadyCell = false;

AfTable.install = function(Vue) {
	if (isReadyTable) {
		return;
	}
	Vue.component(AfTable.name, AfTable);
	isReadyTable = true;
};

AfTableRow.install = function(Vue) {
	if (isReadyRow) {
		return;
	}
	Vue.component(AfTableRow.name, AfTableRow);
	isReadyRow = true;
};

AfTableCell.install = function(Vue) {
	if (isReadyCell) {
		return;
	}
	Vue.component(AfTableCell.name, AfTableCell);
	isReadyCell = true;
};

Vue.use(AfTable);
Vue.use(AfTableRow);
Vue.use(AfTableCell);

export { AfTable, AfTableRow, AfTableCell };
