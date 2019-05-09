<template lang="html">
	<div class="m-user">
		<UserInfo />
		<UserCenter />
	</div>
</template>

<script>
import { mapActions } from 'vuex';

import UserInfo from './pagelet/userInfo.vue';
import UserCenter from './pagelet/userCenter.vue';

export default {
	components: {
		UserInfo,
		UserCenter
	},
	methods: {
		...mapActions('userCenter', [
			// 'fetchAcountInfo',
			'fetchAccountBaseInfo'
		])
	},
	created () {
		// this.fetchAcountInfo();
		this.fetchAccountBaseInfo();
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

.m-user {
	.m-user-center  {
		margin-top: 10px;
		background: @white;

		.m-list-item {
			&:hover {
				background: @midGreen;
				color: @white;
			}

			&:active {
				background: @lightGreen;
			}
		}
	}
}
</style>
