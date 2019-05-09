export default {
	methods: {
		goPrev() {
			this.$emit('back');
		},
		closePop() {
			this.$emit('closePop');
		}
	}
};
