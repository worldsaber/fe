<template>
  <Layout :isHaveBottomNav="false" :isHaveNavBar="false" :isHasFooter="isHasFooter">
		<MainContent slot="mid" :accountInfoFromParent="accountInfo" @hideFooter="hide" @showFooter="show"></MainContent>
	</Layout>
</template>

<script>
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Layout from 'components/layout/main.vue';
import 'components/loading';
import MainContent from './pagelet/index';
import { getAccountInfo } from '../deposit/ke/js/fetchMobile';

export default {
	name: 'myAccountInfo',
	components: {
		Layout,
		MainContent
	},
	data () {
		return {
			accountInfo: {},
			genderMap: ['Male', 'Female'],
			isHasFooter: true
		};
	},
	created () {
		getAccountInfo().then((accountInfo = {}) => {
			if (accountInfo.birthday) {
				const birth = accountInfo.birthday;
				accountInfo.birthdayStr = birth.substr(4, 2) + '/' + birth.substr(6, 2) + '/' + birth.substr(0, 4);
			}
			if (accountInfo.gender) {
				accountInfo.genderStr = this.genderMap[+accountInfo.gender - 1] || '';
			}
			if (accountInfo.state && accountInfo.area) { // 当地理位置两个级别都有的时候，拼成一个，赋给accountInfo.state，以便显示在个人中心
				accountInfo.state = `${accountInfo.state}, ${accountInfo.area}`;
			}
			this.accountInfo = accountInfo;
			this.pageLoading(false);
		});
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		hide() {
			this.isHasFooter = false;
		},
		show() {
			this.isHasFooter = true;
		}
	}
};
</script>
