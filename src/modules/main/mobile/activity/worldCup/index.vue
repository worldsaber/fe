<template lang="html">
	<div class="m-cup">
		<div class="m-title-bar">
			<i class="m-icon-back" @click.stop="jmpHome"></i>
			<TitleBar v-if="pageModule === 'home'"/>
		</div>
		<div class="m-cup-header" v-if="pageModule === 'home'">
			<div class="m-jump-wrap" @click="goWinners">Winners Information<i class="m-icon-right"/></div>
			<div class="m-jump-wrap" @click="goHistory">My Previous Predictions<i class="m-icon-right"/></div>
		</div>
		<router-view></router-view>

		<!-- <img src="./image/homeBg-ke.jpg" alt="" style="display: none;"> -->
		<!-- <img src="./image/history-bg.png" alt="" style="display: none;"> -->
	</div>
</template>

<script>
import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';
import {
	UPDATE_PAGE_MODULE
} from 'store/worldCup/mutationTypes';
import appCore from 'appCore';
import {
	pagePath
} from 'config/pageConfig';
import {
	appPath
} from 'config/appPagePath';

import Home from './pagelet/home.vue';
import TitleBar from './pagelet/titleBar.vue';

export default {
	components: {
		Home,
		TitleBar
	},
	computed: {
		...mapState('worldCup', [
			'pageModule',
			'actConfig'
		])
	},
	watch: {
		$route(val, oldVal) {
			this.chgShowPage(val.name);
			this.$dialog();
		}
	},
	methods: {
		...mapMutations('worldCup', {
			chgShowPage: UPDATE_PAGE_MODULE
		}),
		...mapActions('worldCup', [
			'getconfig'
		]),
		jmpHome() {
			if (this.pageModule === 'home') {
				if (appCore.getAppName() === 'sportybet') {
					return appCore.sendCmd(appPath.home);
				}

				location.href = pagePath.home;
			} else {
				this.$router.go(-1);
			}
		},
		goWinners() {
			this.$router.push({
				name: 'winners'
			});
		},
		goHistory() {
			this.$router.push({
				path: '/history'
			});
		}
	},
	created() {
		if (this.$route.name !== 'home') {
			this.$router.replace({ name: 'home' });
		}

		this.getconfig();
	},
	mounted() {
		// 基础信息加载完毕后，去掉loading
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
	}
};
</script>

<style lang="less">
@import "./style/layout.less";
</style>
