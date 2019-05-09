<script>
import { AfTable } from 'packages/tableLayout';
// import { EventBus } from 'kernel/js/eventBus.js';
import tableMixin from '../js/tableMixin.js';

let uid = 0;

export default {
	name: 'BetTable',

	componentName: 'BetTable',

	mixins: [tableMixin],

	props: {
		checkedList: {
			type: Array,
			default() {
				return [];
			}
		},
		tableKey: {
			type: String,
			default () {
				return `table${++uid}`;
			}
		},
	},
	render(h) {
		return h(
			AfTable,
			this.$slots.default
		);
	}
};
</script>
