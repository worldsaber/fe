<template>
	<div :class="['m-recommend-events', {
		multiple: isMultiple
	}]"
		v-if="recommendProductStatus !== 1"
		v-loading:fetchRecommendEvents="recommendLoading">

		<!-- 横向滚动比赛列表 -->
		<AFSnapNav v-model="currentEventId" ref="recommendList">
			<template v-for="eventId in recommendEvents.eventOrder">
				<AFSnapNavItem :key="eventId" :name="eventId">
					<EventRecommend :event="recommendEvents.events[eventId]" />
				</AFSnapNavItem>
			</template>
		</AFSnapNav>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import EventRecommend from './eventRecommend.vue';

export default {
	name: 'RecommendEvents',
	components: {
		EventRecommend
	},
	data() {
		return {
			currentEventId: ''
		};
	},
	computed: {
		...mapState('home', [
			'recommendEvents',
			'recommendLoading',
			'recommendProductStatus'
		]),
		// 是否返回了多场比赛
		isMultiple() {
			return Object.keys(this.recommendEvents.events).length > 1;
		}
	},
	watch: {
		recommendEvents: {
			deep: true,
			handler (val, oldVal) {
				if (val) {
					if (oldVal && Object.keys(val).length !== Object.keys(oldVal).length) {
						// 重新计算ul容器的宽度及定位
						this.$nextTick(() => {
							this.$refs.recommendList.$emit('computeWidth');
						});
					}
				}
			}
		}
	},
	methods: {
		...mapActions('home', [
			'fetchRecommendEvents',
			'subRecommendEvents',
			'unsubRecommendEvents'
		])
	},
	mounted () {
		this.subRecommendEvents();
	},
	beforeDestroy () {
		this.unsubRecommendEvents();
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';

.m-recommend-events {
	.m-snap-nav-wrap {
		margin-top: -3/@rem; // 用于处理 boost icon 跃出边界样式

		.m-snap-nav {
			.m-snap-nav-item {
				width: 100vw;
				padding: 0;
				border-top: 3/@rem solid transparent; // 用于处理 boost icon 跃出边界样式

				.m-event-recommend {
					.m-recommend-header {
						.m-title-img {
							margin-left: -19/@rem;
						}
					}
				}
			}
		}
	}

	&.multiple {
		.m-snap-nav-wrap {
			.m-snap-nav {
				.m-snap-nav-item {
					width: 77.2vw;
					border-right: 1px solid @fogGrayBorder;
					padding: 0;

					&:last-child {
						border-right: 0;
					}

					.m-event-recommend {
						.m-recommend-header {
							.m-title-img {
								margin-left: -15/@rem;
							}
						}
					}
				}
			}
		}

		.m-event-recommend {
			.m-event-info {
				.m-team {
					font-size: 10/@rem;
					line-height: 1;
				}

				.m-mid {
					margin: 0 6/@rem;
				}
			}
		}
	}
}

</style>
