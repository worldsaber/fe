<template>
	<ULayout style="padding: 10px 20px;">
		<UNav :tabList="tabList" :active="0" @click="tabClick"></UNav>
		<AccountForm v-show="currentTab == 0"></AccountForm>
		<template v-if="currentTab == 1">
			<PswForm v-if="isPswSuccess === 0" @success="isPswSuccess = 1"></PswForm>
			<PswSuccess v-else></PswSuccess>
		</template>
	</ULayout>
</template>

<script>
import { mapMutations } from 'vuex';
import * as mutationTypes from 'store/usercenter/mutationTypes';
import { userCenter } from 'config/order/userCenterConfig';
import ULayout from 'components/userCenter/layout';
import UNav from 'components/userCenter/nav';

import AccountForm from './accountForm';
import PswForm from './passwordForm';
import PswSuccess from './success';

export default {
	components: {
		ULayout,
		UNav,
		AccountForm,
		PswForm,
		PswSuccess
	},
	data () {
		return {
			currentTab: 0,
			isPswSuccess: 0,
			tabList: ['Profile', 'Change Password'],
		};
	},
	created () {
		this.updatePageTab(userCenter[7]);
	},
	methods: {
		...mapMutations('userCenter', {
			updatePageTab: mutationTypes.UPDATE_CURRENT_TAB
		}),
		tabClick (index) {
			this.currentTab = index;
			this.isPswSuccess = 0;
		},
	}
};
</script>

<style lang="less">
@import '../index.less';
</style>
