<template lang="html">
	<div class="m-error-wrapper">
		<div v-if="loading">
			<i class="m-icon-load"></i>
			<p class="m-text-msg">Loading…</p>
		</div>

		<!-- 加载cashout列表失败 -->
		<div v-else-if="loadError">
			<p class="m-text-msg">Data failed loading. Please reload.</p>
		</div>

		<!-- 没有cashout列表 -->
		<div v-else-if="isEmpty">
			<p class="m-text-msg">You have no available gifts at this time.</p>
		</div>

		<!-- 没有登录的情况 -->
		<div v-else-if="loginError">
			<p class="m-text-msg">Please <span class="m-text-highlight" @click="handleLogin">Log in</span> to check available gifts.</p>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { pagePath } from 'config/pageConfig';

export default {
	name: 'couponsError',

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
			if (window.login) {
				window.login({ activeTab: 'Log In' });
			} else {
				location.href = pagePath.login;
			}
		}
	}
};
</script>
