<template>
	<div :class="['m-tab-navs-wrap', {
		'has-nav-fixed': isFixed
	}]">
		<ul class="m-tab-navs"  :class="{
				fixed: isFixed
			}" ref="tabNavs" v-fixed>
			<template v-for="(nav, index) in navs">
				<li :class="['m-nav-item', {
					active: nav.tab === currentTab
				}]" :key="index" @click="changeTab(nav.tab)">
					<i :class="['m-icon', nav.icon ]"></i>
					<span class="m-text">{{nav.text}}</span>
					<div class="m-count-badge" v-if="nav.badge && nav.commentCount > 0">
						{{nav.commentCount > 999 ? '999+' : nav.commentCount}}
					</div>
				</li>
			</template>
		</ul>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { RESET_SCROLL } from 'store/layout/mutationTypes';
import getFixed from 'directives/fixed';

export default {
	name: 'SubTabNav',
	directives: {
		fixed: getFixed(),
	},
	props: {
		navs: {
			required: true,
			type: Array
		},
		currentTab: {
			type: String
		},
		isScrollNavFixed: {
			type: Boolean,
			'default': false
		}
	},
	data() {
		return {
			offsetTop: 0, // tab的偏移顶部的距离
		};
	},
	computed: {
		...mapState('layout', [
			'scrollPayload'
		]),
		isFixed() {
			return false;
			// if (!this.isScrollNavFixed) return false;
			// const payload = this.scrollPayload || { top: 0 };
			// const top = payload.scrollTop;
			// return this.offsetTop > 0 && top >= this.offsetTop;  // 需要等待mounted后的计算才算有效
		},
	},
	watch: {
		$route: {
			immediate: true,
			handler(to, from) {
				if (this.isFixed) {
					this.resetScroll({
						top: this.offsetTop
					});
				}
			}
		}
	},
	methods: {
		...mapMutations('layout', {
			resetScroll: RESET_SCROLL
		}),
		changeTab(value) {
			if (this.isFixed) {
				this.resetScroll({
					top: this.offsetTop
				});
			}
			this.$emit('change', value);
		},
		calcNavFixedPosition () {
			const $tab = this.$refs.tabNavs;
			if ($tab) {
				const offset = $tab.offsetTop + (this.scrollPayload.scrollTop || 0);
				this.offsetTop = offset;
			}
		},
	},
	mounted() {
		if (this.isScrollNavFixed) {
			this.calcNavFixedPosition();
		}
	}
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';

.m-tab-navs-wrap {
	width: 100%;

	&.has-nav-fixed {
		padding-top: 58/@rem;
	}
}

.m-tab-navs {
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
	padding: 15/@rem 10/@rem;
	box-sizing: border-box;
	background-color: #fff;

	&.fixed {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;
		width: 100%;
		background-color: #fff;
	}

	& > li {
		flex: auto;
		width: 33.33%;
		border-radius: 2/@rem;
		background: @lightGray;
		color: @darker;
		height: 28/@rem;
		font-size: 12/@rem;
		line-height: 28/@rem;
		text-align: center;
		margin-right: 1px;
		position: relative;

		&:last-child {
			margin-right: 0;
		}

		&.active {
			background: @darker;
			color: @white;

			.m-icon {
				&:before {
					color: @white;
				}
			}
		}
	}

	.m-icon {
		&:before {
			color: @darker;
			font-size: 12/@rem;
			line-height: 28/@rem;
		}
	}

	.m-text {
		vertical-align: top;
	}

	.m-count-badge {
		position: absolute;
		top: -6.5/@rem;
		right: 5/@rem;
		background: @red;
		color: @white;
		min-width: 11/@rem;
		line-height: 11/@rem;
		border-radius: 6.5/@rem;
		font-size: 10/@rem;
		font-weight: bold;
		text-align: center;
		padding: 0 2/@rem;
		border: 1px solid @white;
	}
}
</style>
