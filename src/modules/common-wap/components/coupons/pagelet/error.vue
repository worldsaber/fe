<template lang="html">
	<div class="m-error-wrapper">
		<div v-if="loading">
			<i class="m-icon-load"></i>
			<p class="m-text-msg">Loading</p>
		</div>

		<!-- 加载红包列表失败 -->
		<div v-else-if="loadError">
			<i class="m-icon-warn"></i>
			<p class="m-text-msg">Data failed loading. Please reload.</p>
			<div class="reload-btn" ><span @click="reloadFun">Reload</span></div>
		</div>

		<!-- 没有红包列表 -->
		<div v-else-if="isEmpty">
			<i class="m-icon-warn"></i>
			<p class="m-text-msg">You have no available gifts at this time.</p>
		</div>

		<!-- 没有登录的情况 -->
		<div v-else-if="loginError">
			<i class="m-icon-warn"></i>
			<p class="m-text-msg">Please <span class="m-text-highlight" @click="handleLogin">Log in</span> to check available gifts.</p>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { pagePath } from 'config/pageConfig';
import { EventBus } from 'kernel/js/eventBus';
import commonEvent from 'config/eventConfig/commonEvent';

export default {
	name: 'couponsError',
	props: {
		// 返回图标自定义点击事件
		reloadFun: {
			type: Function
		}
	},
	computed: {
		...mapState('coupons', [
			'loading',
			'errorInfo'
		]),
		loginError() {
			return this.errorInfo && this.errorInfo.type === 'login';
		},
		isEmpty() {
			return this.errorInfo && this.errorInfo.type === 'empty';
		},
		loadError() {
			return this.errorInfo && this.errorInfo.type === 'load';
		}
	},
	methods: {
		handleLogin() {
			if (this.$popupLogin) {
				this.$popupLogin.show();
			} else {
				// location.href = '/ke/m/registion?type=login';
				// let url = '/ke/m/independent_login';
				// url += `?okUrl=${encodeURIComponent(location.href)}`;
				location.href = `${pagePath.login}?okUrl=${encodeURIComponent(location.href)}`;
			}
		},
		handleLoginStatus() {
			this.$popupLogin && this.$popupLogin.close();
		}
	},
	mounted() {
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	},
	destoryed() {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
	}
};
</script>
