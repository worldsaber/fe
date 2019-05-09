<template lang="html">
	<Layout :isHaveBottomNav="false" :isHaveNavBar="true" :isHasFooter="false">
		<div :class="['m-sportBets', {'m-sportBets-fix': !isOpenBet}]" slot="mid">
			<topNavBar v-if="!hideBackBar" />
			<Nav v-if="!hideTab" class="m-bets--nav" />
			<router-view @resetStatus="handleReset"></router-view>
			<Pagination
  				v-if="hasMorePage && isOpenBet"
  				:total="pageCount"
  				:current="pageIndex"
  				@changePage="handleChangePage"
			/>
		</div>
    </Layout>
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex';
import 'utils/class';
import 'components/login/popupLogin';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Layout from 'components/layout/main.vue';
import topNavBar from 'components/navbar';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus.js';
import { UPDATELOGINSTATUS, UPDATECURRENTPAGE } from 'store/openBet/mutationTypes';

import Nav from './pagelet/nav.vue';
import Pagination from './pagelet/pagination.vue';

export default {
	components: {
		Layout,
		topNavBar,
		Nav,
		Pagination,
	},
	data() {
		return {
			hideBackBar: true,
			hideTab: true,
			isOpenBet: true,
			hasFixed: false
		};
	},
	computed: {
		...mapState('openBet', [
			'pageIndex',
			'isLogin'
		]),
		...mapGetters('openBet', [
			'hasData',
			'pageCount'
		]),
		...mapState('order', [
			'ticketList',
			'isLoading',
		]),
		hasMorePage() {
			return this.pageCount > 1;
		}
	},
	watch: {
		$route(val, oldVal) {
			this.hasFixed = false;

			const meta = val.meta || {};

			if (meta.tabName === 'openBet') {
				this.isOpenBet = true;
			} else {
				this.isOpenBet = false;
			}

			this.syncLoginstatus();

			this.chgTabVisibility();

			const scrollDom = document.querySelector('.m-main-mid');
			if (scrollDom.hasClass('m-main-mid--fix')) {
				scrollDom.removeClass('m-main-mid--fix');
			}
		},
		pageIndex(val) {
			this.hasFixed = false;
		},
		hideTab(val) {
			if (!val) {
				this.$nextTick(() => {
					this.initEvent();
				});
			}
		},
		hasFixed(val) {
			const scrollDom = document.querySelector('.m-main-mid');

			this.$nextTick(() => {
				if (val) {
					scrollDom.addClass('m-main-mid--fix');
				} else {
					scrollDom.removeClass('m-main-mid--fix');
				}
			});
		},
		isLogin(val) {
			if (!val) {
				this.hideTab = false;
			} else {
				this.chgTabVisibility();
			}
		},
		isLoading(val) {
			const route = this.$route;
			if (route.name === 'sixMonthsAgo' && !val && !this.ticketList.length) {
				this.hideTab = true;
			}
		}
	},
	methods: {
		...mapMutations('layout', {
			setLoading: CHANGE_LOADING,
		}),
		...mapMutations('openBet', {
			updateLoginStatus: UPDATELOGINSTATUS,
			changeCurrentpage: UPDATECURRENTPAGE
		}),
		handleLoginStatus() {
			this.$popupLogin && this.$popupLogin.close();
			this.updateLoginStatus(true);
		},
		syncLoginstatus() {
			if (window.loginStatus !== this.isLogin) {
				this.updateLoginStatus(window.loginStatus);
			}
		},
		chgTabVisibility() {
			const route = this.$route;

			this.hideTab = route.name !== 'sports' && route.name !== 'openBet';
			this.hideBackBar = route.name === 'matchTraker';
		},
		handleChangePage(val) {
			this.changeCurrentpage(val);
		},
		handleReset() {
			this.hasFixed = false;
		},
		toggleSticky(event) {
			if (this.hideTab) {
				return;
			}

			this.timerId = setTimeout(() => {
				if (this.timerId) {
					clearTimeout(this.timerId);
					this.timerId = null;
					return;
				}

				const scrollDom = document.querySelector('.m-main-mid'),
					scrollTop = scrollDom.scrollTop || 0;

				let tempScrollTop = this.scrollBase;
				if (!this.isOpenBet) {
					const orderWrapDom = scrollDom.querySelector('.m-bethistory'),
						paddingTop = orderWrapDom && window.getComputedStyle(orderWrapDom, null).getPropertyValue('padding-top') || 0;

					tempScrollTop += parseFloat(paddingTop);
				}

				if (!this.hasFixed && scrollTop >= tempScrollTop) {
					this.hasFixed = true;
				}

				if (this.hasFixed && scrollTop < Math.floor(this.scrollBase)) {
					this.hasFixed = false;
				}
			}, 320);
		},
		initEvent() {
			if (this.hasInit) {
				return;
			}

			const scrollDom = document.querySelector('.m-main-mid');

			if (scrollDom) {
				const headerDom = document.querySelector('.mobile-navbar'),
					backDom = document.querySelector('.m-sportBets .m-navbar');

				this.scrollBase = headerDom.scrollHeight + backDom.scrollHeight;

				scrollDom.addEventListener('scroll', this.toggleSticky, false);

				this.hasInit = true;
			}
		}
	},
	mounted() {
		const route = this.$route,
			meta = route.meta || {};

		if (meta.tabName === 'openBet') {
			this.isOpenBet = true;
		} else {
			this.isOpenBet = false;
		}

		this.chgTabVisibility();

		this.setLoading(false);
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		EventBus.$on(commonEvent.UPDATE_POP_LOGIN_BACK, this.syncLoginstatus);

		EventBus.$on('openbet-reset-scroll', this.handleReset);
	},
	destroyed() {
		EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, this.handleLoginStatus);
		entBus.$off(commonEvent.UPDATE_POP_LOGIN_BACK, this.syncLoginstatus);
		EventBus.$off('openbet-reset-scroll', this.handleReset);

		const scrollDom = document.querySelector('.m-main-mid');

		if (scrollDom) {
			scrollDom.removeEventListener('scroll', this.toggleSticky, false);
		}
	}
};
</script>
<style media="screen" lang="less">
@import 'base/styles/variable.less';

.m-main-mid--fix {
	.m-bets--nav {
		position: fixed;
		top: 0;
		z-index: 999;
	}

	.m-openbet {
		padding-top: 60/@rem;
	}

	.m-bethistory {
		padding-top: 98/@rem;

		.tabs-wrapper {
			position: fixed;
			top: 48/@rem;
			z-index: 999;
		}
	}
}
</style>
