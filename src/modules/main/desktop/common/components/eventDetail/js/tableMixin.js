export default {
	computed: {
		rootTable() {
			let parent = this.$parent;

			while (parent && parent.$options.componentName !== 'BetTable') {
				parent = parent.$parent;
			}

			return parent;
		}
	},
	methods: {
		// getColStyle(colCount) {
		// 	return {
		// 		width: (100 / colCount) + '%'
		// 	};
		// }
	}
};
