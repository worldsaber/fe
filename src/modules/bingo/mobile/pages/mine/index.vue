<template>
	<div class="bingo-mine-wrap">
		<MoreList :fetchData="getGoodsList" :params="params">
			<template slot="list" slot-scope="{ list }">
				<div class="m-goods-list" v-if="list.length > 0">
					<template v-for="(item, index) in list">
						<MineGoods :key="index" :item="item" />
					</template>
				</div>
				<div class="m-goods-empty" v-else>
					You don't have any items in this category.
				</div>
			</template>
		</MoreList>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
import * as mutationTypes from 'store/layout/mutationTypes';
import { EventBus } from 'kernel/js/eventBus';
import commonEvent from 'config/eventConfig/commonEvent';
import MineGoods from '../../components/mineGoods.vue';
import MoreList from '../../components/moreList.vue';
import { getMineGoodListByStatus } from '../../js/utils.js';

export default {
	name: 'Mine',
	components: {
		MineGoods,
		MoreList
	},
	data() {
		return {
			params: {
				status: -1
			}
		};
	},
	created() {
		this.checkLoginStatus();
		this.updateShareConfig({
			shareUrl: `${location.origin}/${window.country}/m/sportybingo/home/popular`
		});
	},
	watch: {
		$route: {
			immediate: true,
			handler(route) {
				// 个人页
				if (route.name !== 'mine') {
					return;
				}
				this.checkLoginStatus();
				const status = this.$route.query.tab || 'all';
				const map = {
					all: -1,
					ongoing: 1,
					published: -2,
				};
				this.params = {
					status: map[status] || -1
				};
			}
		}
	},
	methods: {
		...mapMutations('layout', {
			updateShareConfig: mutationTypes.UPDATE_SHARE_CONFIG
		}),
		getGoodsList(params) {
			return getMineGoodListByStatus(params)
			.catch(err => {
				if (err.login === false) {
					window.loginStatus = false;
					this.checkLoginStatus();
				}
			});
		},
		checkLoginStatus() {
			// 判断是否登录
			if (!window.loginStatus) {
				window.login.show();
				EventBus.$once(commonEvent.UPDATE_LOGIN_STATUS, () => {
					// 重新加载
					this.params = {
						...this.params
					};
				});
				EventBus.$once(commonEvent.UPDATE_POP_LOGIN_BACK, () => {
					this.$router.push({
						name: 'popular'
					});
				});
			}
		}
	}
};
</script>

<style lang='less'>
@import 'base/styles/variable.less';
@import '~base/styles/icon.less';

.bingo-mine-wrap{
	background-color: @lightGray;
	margin-top: -1/@rem;
	padding-top: 1/@rem;
}
.m-goods-list {
	background: @lightGray;
	overflow: hidden;

	.m-goods {
		margin-top: 6/@rem;
	}
}
.m-goods-empty{
	font-size: 12/@rem;
	text-align: center;
	margin-top: 6/@rem;
	background-color: #FFF;
	color: #9ca0ab;
	padding: 40/@rem 20/@rem;
	.m-icon-exclamation();
	&:before{
		display: block;
		margin-bottom: 10/@rem;
		font-size: 36/@rem;
		line-height: 42/@rem;
		padding-right: 15/@rem;
		color: @midGray;
	}
}
</style>

