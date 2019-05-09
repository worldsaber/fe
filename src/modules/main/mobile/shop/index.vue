<template lang="html">
	<Layout :isHasFooter="false" :isHaveNavBar="true" :isHaveBottomNav="false">
	  	<div slot="mid">
			<div class="m-gifts-shop">
				<router-view></router-view>
			</div>
	  	</div>
    </Layout>
</template>

<script>
import {
	mapState,
	mapActions,
	mapMutations
} from 'vuex';
import 'components/login/popupLogin';
import { URL } from 'utils';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus';
import Layout from 'components/layout/main.vue';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import { UPDATE_CURRENT_ID } from 'store/shop/mutationTypes';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { setRecord } from 'config/deposit/record';

export default {
	components: {
		Layout
	},
	computed: {
		...mapState('shop', [
			'errorInfo'
		])
	},
	watch: {
		errorInfo(val) {
			const { type = '', msg = '' } = val || {};

			switch (type) {
			case 'toast':
				this.$dialog();
				this.$toast(msg);
				return;
			case 'login':
				this.$dialog();
				this.$popupLogin.show();
				return;
			case 'deposit':
				this.fetchAcountInfo();
				this.$dialog();
				this.$dialog({
					title: val.title,
					content: msg,
					button: ['LATER', 'DEPOSIT']
				}).onBtnClick(ret => {
					setRecord(location.href);

					if (ret) {
						window.location.href = URL.addPara(userCenterUrl.deposit, {
							source: 'shop'
						});
					}
				});
				return;
			case 'success':
				this.$dialog();
				this.$toast(msg);
				this.fetchAcountInfo();
				this.loadData();
				return;
			case 'soldOut':
			case 'goodsError':
			case 'dialog':
				this.$dialog();
				this.$dialog({
					content: msg,
					title: null,
					button: ['OK']
				}).onBtnClick(ret => {
					if (this.$route.name !== 'list') {
						this.$router.replace({
							name: 'list'
						});
					} else {
						this.loadData();
					}
				});
				return;
			case 'locked':
				this.$dialog();
				this.$dialog({
					content: msg,
					title: null,
					button: ['OK']
				});
				return;
			case 'timeout':
				this.$dialog();
				this.$dialog({
					content: msg,
					title: null,
					button: ['OK']
				});
			default:
			}
		},
		$route(val, oldVal) {
			if (val.name === 'list') {
				this.$dialog();
			}

			this.updateDetailId();
			this.loadData();
		}
	},
	methods: {
		...mapActions('shop', [
			'getList',
			'getDetail'
		]),
		...mapActions('assetsInfo', [
			'fetchAcountInfo'
		]),
		...mapMutations('layout', {
			setLoading: CHANGE_LOADING,
		}),
		...mapMutations('shop', {
			updateCurrentId: UPDATE_CURRENT_ID
		}),
		handleLoginStatus() {
			this.$popupLogin && this.$popupLogin.close();
			this.loadData();
		},
		loadData() {
			if (this.$route.name === 'list') {
				this.getList();
			} else {
				this.getDetail();
			}
		},
		updateDetailId() {
			const route = this.$route;
			if (route.name === 'list') {
				this.updateCurrentId('');
			} else {
				this.updateCurrentId(route.params.id);
			}
		}
	},
	created() {
		this.updateDetailId();
		this.loadData();
	},
	mounted() {
		this.setLoading(false);
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	destroyed() {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	}
};
</script>

<style lang="less" scoped>
@import 'base/styles/variable.less';

@import './style/layout.less';
.m-navbar .m-navbar-item {
	.m-t--share {
		color: @dark;
		font-size: 14/@rem;
		line-height: 16/@rem;
	}
}
</style>
