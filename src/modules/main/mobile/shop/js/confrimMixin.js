import Vue from 'vue';
import { mapState } from 'vuex';
import 'components/login/popupLogin';
import ShopComfirm from '../pagelet/confirm.vue';

export default {
	computed: {
		...mapState('assetsInfo', [
			'balance'
		]),
	},
	methods: {
		showComfirm(item) {
			if (!window.loginStatus) {
				this.$dialog();
				this.$popupLogin.show();
				return;
			}

			if (this.balance < item.showPrice) {
				this.$toast('Your balance is insufficient.');
				return;
			}

			this.$dialog();
			this.$dialog({
				title: null,
				'class': 'm-shop-popCfm',
				content: Vue.extend(ShopComfirm).mixin({
					store: window.v_store
				}),
				contentData: {
					showPrice: item.showPrice,
					id: item.id
				},
				position: {
					bottom: 0,
					left: 0,
					right: 0
				},
				width: '100%',
				button: []
			});
		}
	}
};
