import { mapMutations, mapState } from 'vuex';
import { UPDATE_PAGE_MODULE } from 'store/issue/mutationTypes';
import exitConfirm from '../pagelet/exitConfirm.vue';

export default {
	methods: {
		...mapMutations('issue', {
			chgShowPage: UPDATE_PAGE_MODULE
		}),
		jmpRules() {
			this.$router.push({ name: 'rulers' });
		},
		backHome() {
			if (this.pageModule === 'issue' && !this.isSpectator) {
				const d = this.$dialog({
					title: null,
					content: exitConfirm,
					button: []
				});
				d.onMounted(() => {
					d.$content.$on('exit', () => {
						this.$router.go(-1);
						this.$dialog();
					});
				});
			} else {
				this.$router.go(-1);
			}
		}
	},
	computed: {
		...mapState('issue', [
			'pageModule',
			'isSpectator'
		]),
	},
};
