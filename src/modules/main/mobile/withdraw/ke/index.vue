<template>
  <Layout :isHaveBottomNav="false" :isHaveNavBar="false">
		<MainContent slot="mid" :mobile="mobile" :wholeMobile="wholeMobile" :balance="balance"></MainContent>
	</Layout>
</template>

<script>
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Layout from 'components/layout/main.vue';
import 'components/loading';
import MainContent from './pagelet/index';
import getMobile from '../../deposit/ke/js/fetchMobile';
import getBalance from './js/fetchBalance';

export default {
	name: 'withdraw',
	components: {
		Layout,
		MainContent
	},
	data () {
		return {
			mobile: '',
			wholeMobile: '',
			balance: 0
		};
	},
	created () {
		// this.pageLoading(false);
		Promise.all([getBalance().then(balance => {
			this.balance = balance;
		}), getMobile().then(data => {
			if (typeof data === 'object') {
				this.mobile = data.mobile;
				this.wholeMobile = data.wholeMobile;
			}
		})]).then(values => {
			this.pageLoading(false);
		});
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		})
	}
};
</script>

<style lang="less">
.m-withdrawBlockTip-dialog {
	&.es-dialog {
		.es-dialog-footer {
			.es-dialog-btn {
				width: auto;
				min-width: 30%;
			}
		}
	}
}
</style>
