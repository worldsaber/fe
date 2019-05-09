<template lang="html">
	<div class="m-main m-layout-main" v-pageLoading="isLoading">
		<!-- 加载winning奖杯，以优化winning弹窗显示奖杯 -->
		<img src="../popDialog/image/winBg.png" style="display: none;" />
		 <transition name="fade" v-if="isHaveLeftPagelet">
			<div class="m-main-left" v-show="showLeft" @click="toggleLeft">
				<slot name="left">
					<LeftPagelet/>
				</slot>
			</div>
		 </transition>
		<div :class="['m-main-mid', {
			'm-has-bottom-nav': isHaveBottomNav && showBottom
		}]" @scroll.self="onMainScroll" ref="mid">
			<slot name="beforeNav"></slot>
			<NavBar v-if="isHaveNavBar"/>
			<slot name="afterNav"></slot>
			<slot name="mid">
				<router-view></router-view>
			</slot>
			<slot name="beforeFooter"></slot>
			<template v-if="isHasFooter">
				<FooterBar v-show="showFooter" />
			</template>
			<slot name="afterFooter"></slot>
			<!-- 为了保证顶部的me菜单展开样式的正确性，这里只能将bottomNav移动到内部 -->
			<template v-if="isHaveBottomNav">
				<BottomNav v-show="showBottom"/>
			</template>
		</div>
		<slot name="afterMid"></slot>
		 <transition name="fade" v-if="isHaveRightPagelet">
			<div class="m-main-right" v-show="showRight" @click="toggleRight">
				<slot name="right">
					<RightPagelet/>
				</slot>
			</div>
		</transition>

		 <transition name="fade" v-if="isHaveShare">
		 	<Share :shareCfg="shareCfg" v-show="showShare" @close-share="toggleShare(false)"/>
		 </transition>
	</div>
</template>

<script>
import Vuex, { mapState, mapMutations, mapActions } from 'vuex';
import Vue from 'vue';
import { TOGGLE_LEFT, TOGGLE_RIGHT, CHANGE_LOADING, UPDATE_SCROLL, TOGGLE_SHARE, TOGGLE_BOTTOM } from 'store/layout/mutationTypes';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus.js';
import layout from 'store/layout/modules';
import assetsInfo from 'store/assetsInfo/modules';
import me from 'store/me/modules';
import message from 'store/message/modules';
import throttle from 'utils/throttle';
import Share from 'components/share/index.vue';
import RightPagelet from './pagelate/right.vue';
import LeftPagelet from './pagelate/left.vue';
import NavBar from './pagelate/navBar/navbar.vue';
import BottomNav from './pagelate/bottomNav.vue';
import FooterBar from './pagelate/footer/index.vue';

Vue.use(Vuex);

export default {
	name: 'MainPagelet',
	componentName: 'MainPagelet',
	props: {
		isHaveBottomNav: {
			'default': true,
			type: Boolean
		},
		// 是否有nav
		isHaveNavBar: {
			'default': true,
			type: Boolean
		},
		// 是否默认显示全屏loading
		isHaveLoading: {
			'default': true,
			type: Boolean
		},
		// 是否有footer
		isHasFooter: {
			type: Boolean,
			'default': true
		},
		isNeedScroll: {
			type: Boolean,
			'default': false
		},
		isHaveRightPagelet: {
			type: Boolean,
			'default': false
		},
		// 收否有分享浮窗
		isHaveShare: {
			type: Boolean,
			'default': false
		}
	},
	components: {
		RightPagelet,
		LeftPagelet,
		NavBar,
		FooterBar,
		BottomNav,
		Share
	},
	beforeCreate () {
		// 找不到根的store，自己动态注入一个空的store
		if (!this.$store) {
			// 取不到store，自己注册store
			this.$store = new Vuex.Store({});
		}
		// 没有注册layout模块
		if (!this.$store._modulesNamespaceMap['layout/']) {
			// 没有注入store，动态取消加载种的状态
			this.$store.registerModule('layout', layout);
			// this.$store.commit('layout/' + CHANGE_LOADING, this.isHaveLoading);
		}
		// 没有注册assetsInfo模块
		if (!this.$store._modulesNamespaceMap['assetsInfo/']) {
			// 没有注入store，动态取消加载种的状态
			this.$store.registerModule('assetsInfo', assetsInfo);
		}
		// 没有注册me模块
		if (!this.$store._modulesNamespaceMap['me/']) {
			// 没有注入store，动态取消加载种的状态
			this.$store.registerModule('me', me);
		}

		// 没有注册message模块
		if (!this.$store._modulesNamespaceMap['message/']) {
			// 没有注入store，动态取消加载种的状态
			this.$store.registerModule('message', message);
		}
	},
	computed: {
		...mapState('layout', [
			'showLeft',
			'showRight',
			'showBottom',
			'isLoading',
			'resetScroll',
			'showShare',
			'shareCfg',
			'showFooter'
		]),
		isHaveLeftPagelet() {
			return this.isHaveNavBar;
		}
	},
	created () {
		// 登录状态发生变化刷新余额
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, status => {
			if (window.loginStatus) {
				this.$popupLogin.close();
			}
			this.fetchAcountInfo();
		});
		// 主动发起同步账户余额
		EventBus.$on(commonEvent.UPDATE_ACCOUNT_BALANCE, () => {
			this.fetchAcountInfo();
		});
		// 默认值是true，所以ture不做任何处理，因为子组件created事件先调用，如果这里做处理可能有问题
		// fase情况处理如果子组件也调用changeLoading 必须在mounted调用，或者用nextTick中调用
		if (!this.isHaveLoading) {
			this.changeLoading(this.isHaveLoading);
		}
		this.fetchAcountInfo();
	},
	mounted() {
		const $mid = this.$refs.mid;
		this.$watch('resetScroll', value => {
			if ($mid) {
				$mid.scrollTop = value.top || 0;
			}
		});
		// 初始状态
		if (this.isNeedScroll && $mid) {
			this[UPDATE_SCROLL]({
				clientHeight: $mid.clientHeight,
				scrollTop: $mid.scrollTop,
				scrollHeight: $mid.scrollHeight
			});
		}
	},
	methods: {
		...mapMutations('layout', [TOGGLE_LEFT, TOGGLE_RIGHT, TOGGLE_BOTTOM, CHANGE_LOADING, UPDATE_SCROLL, TOGGLE_SHARE]),
		...mapActions('assetsInfo', ['fetchAcountInfo']),
		onMainScroll: throttle(function(event) {
			if (!this.isNeedScroll) {
				return;
			}

			const target = event.target; // currentTarget 异步trail 有时会被重置null, 导致错误

			const clientHeight = target.clientHeight;
			const scrollTop = target.scrollTop;
			const scrollHeight = target.scrollHeight;

			this[UPDATE_SCROLL]({
				clientHeight,
				scrollTop,
				scrollHeight
			});
		}, 150)
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
html,body{
	width: 100%;
}
.m-layout-main{
	.fade-enter-active, .fade-leave-active {
		transition: opacity .3s
	}
	.fade-enter, .fade-leave-to  {
		opacity: 0
	}
	box-sizing: border-box;
	display: flex;
	> *{
		min-height: 100%;
	}
	.m-main-left,.m-main-right {
		position: fixed;
		width: 100%;
		z-index: 888;
		background: rgba(0, 0, 0, 0.7);
		left: 0px;
		top: 0px;
	}
	.m-main-mid{
		width: 100%;
		position: absolute;
		top: 0px;
		left: 0px;
		height: 100%;
		overflow: auto;
		z-index: 2;
		&.m-has-bottom-nav {
			.m-footer {
				padding-bottom: 50/@rem;
			}
		}
	}
}
</style>
