<template>
	<div :class="['m-live-stat', {
		'has-nav-fixed': isFixed
	}]">
		<AFSnapNav
			v-model="currentType"
			:class="['m-type-list', {
				fixed: isFixed
			}]">>
			<template v-for="(item, index) in typeList[currentSportName]">
				<AFSnapNavItem class="m-type-item" :key="index" :name="item.type">
					{{item.label}}
				</AFSnapNavItem>
			</template>
		</AFSnapNav>

		<LiveMatchTracker :type="currentType" :eventId="eventId"></LiveMatchTracker>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { RESET_SCROLL } from 'store/layout/mutationTypes';
import LiveMatchTracker from 'packages/liveMatchTracker/liveMatchTracker.vue';
import { typeList } from 'packages/liveMatchTracker/widgetsConfig.js';
import 'components/sanpNav';
import { sportsConfigById } from 'config/sports';

export default {
	name: 'LiveStat',
	components: {
		LiveMatchTracker
	},
	props: {
		// 默认为football
		sportId: {
			type: String,
			'default': 'sr:sport:1'
		},
		eventId: {
			type: String,
			'default': ''
		},
		isScrollNavFixed: {
			type: Boolean,
			'default': false
		}
	},
	data() {
		return {
			typeList,
			currentType: 'h2h',
			offsetTop: 0 // tab的偏移顶部的距离
		};
	},
	computed: {
		...mapState('layout', [
			'scrollPayload'
		]),
		currentSportName() {
			return sportsConfigById[this.sportId].name;
		},
		isFixed() {
			if (!this.isScrollNavFixed) return false;
			const payload = this.scrollPayload || { top: 0 };
			const top = payload.scrollTop;
			return this.offsetTop > 0 && top >= this.offsetTop;  // 需要等待mounted后的计算才算有效
		}
	},
	watch: {
		currentType (val) {
			if (this.isFixed) {
				this.resetScroll({
					top: this.offsetTop
				});
			}
		}
	},
	methods: {
		...mapMutations('layout', {
			resetScroll: RESET_SCROLL
		}),
		calcNavFixedPosition () {
			const $tab = document.querySelector('.m-prematch-detail .m-tab-navs') || document.querySelector('.m-live-stat .m-snap-nav-wrap');
			if ($tab) {
				const offset = $tab.offsetTop + (this.scrollPayload.scrollTop || 0);
				this.offsetTop = offset;
			}
		}
	},
	mounted() {
		if (this.isScrollNavFixed) {
			this.calcNavFixedPosition();
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';
@import 'base/styles/icon.less';

.m-live-stat {
	width: 100%;
	overflow: hidden;

	&.has-nav-fixed {
		// 具体计算根据 .m-tab-navs 受元素影响
		padding-top: (33 - 10)/@rem;
	}

	.m-type-list {
		padding: 0 4/@rem;
		border-bottom: 1px solid @lightGray;
		margin-bottom: 8/@rem;

		&.fixed {
			position: fixed;
			top: 58/@rem;
			left: 0;
			z-index: 99;
			width: 100%;
			background-color: #fff;
		}

		.m-type-item {
			cursor: pointer;
			height: 30/@rem;
			line-height: 30/@rem;
			padding: 0 11/@rem;
			margin-bottom: -1px;
			font-weight: 700;
			.text {
				font-size: 12/@rem;
				color: @dark;
			}
			&.active {
				border-bottom: 4px solid @green;
			}
		}
	}
}
</style>
