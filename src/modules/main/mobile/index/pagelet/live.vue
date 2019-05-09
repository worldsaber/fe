<template>
	<!-- 或者sportSize 大于0才显示 -->
  <div class="m-live" v-if="liveLoading !== false || liveSportSize.length !== 0">
			<!-- 只有在分类和默认数据加载成功的时候才能出发 -->
			<div class="m-live-title m-title">
				<span>Live Betting</span>
			</div>
			<div class="m-bet-tab">
				<AFSnapNav :value="currentLiveId" @change="changeLiveId" class="m-sport-type" v-if="liveSportSize && liveSportSize.length && currentLiveId">
					<AFSnapNavItem class="m-sport-type-item" v-for="(one, index) in liveSportSize" v-if="one.eventSize > 0" :key="index" :name="one.id">{{one.name}}</AFSnapNavItem>
				</AFSnapNav>
				<div  v-loading:reloadingLive.dark="liveLoading">
					<template v-if="liveLoading === false">
						<div v-if="liveProductStatus === 1" class="m-sport-bet-error">
							Failed to load game data. An error occurred while connecting to server.
						</div>
						<template v-else>
							<div class="m-bet-content">
								<template>
									<!-- 根据当前玩法取到当前玩法的数据 -->
									<div v-if="!isHaveEvent" class="no-data">
										<p>Sorry, there are no games currently </p>
										<p>available in this category. Please try later.</p>
										<p>Thank you.</p>
									</div>
									<template v-else>
										<!-- proudctId写死就是1 -->
										<EventsList
											:eventOrder="live.eventOrder"
											:events="live.events"
											:currentMarketIds="[liveMarketIds[currentLiveId]]"
											:sportId="currentLiveId"
											:productId="productId"
											:isShowEventLeagueName="true"
											:isEventBoost="isEventBoost">
										</EventsList>
										<div class="view-all" v-if="liveMatchSize > 0"><a :href="currentLiveHomeUrl">All Live Events {{liveMatchSize}}</a></div>
									</template>
								</template>
							</div>
						</template>
					</template>
				</div>
			</div>
		</div>
</template>

<script>
	import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
	import { isEmptyObject } from 'utils';
	import EventsList from 'components/eventsList';
	import 'components/sanpNav';
	import { CHANGE_LIVE_ID } from 'store/home/mutationTypes';
	import { baseUrl } from 'config/pageConfig';
	import { sportsConfigById } from 'config/sports';

	export default {
		components: {
			EventsList
		},
		created () {
			this.fetchLive();
		},
		data () {
			return {
				productId: 1,
			};
		},
		watch: {
			// id可能是index或者name
			currentLiveId (id, oldId) {
				// 没有oldId证明是初始化
				if (!id || !oldId) {
					return;
				}
				if (id === oldId) {
					return;
				}
				if (this.liveSportSize[oldId] && this.liveSportSize[oldId].id === id) {
					return;
				}
				// 只获取比赛不更新sportSize
				this.fetchLiveMatch(id);
			},
		},
		computed: {
			isHaveEvent () {
				return this.live && this.live.eventOrder && !isEmptyObject(this.live.eventOrder);
			},
			currentLiveName () {
				if (this.currentLiveId) {
					return sportsConfigById[this.currentLiveId].name;
				}
				return 'football';
			},
			currentLiveHomeUrl () {
				return `${baseUrl}sport/${this.currentLiveName}/live_list?source=home_list`;
			},
			// liveloading整个模块加载种
			...mapState('home', [
				'live', 'liveLoading', 'liveMarketIds', 'currentLiveId', 'liveProductStatus']),
			...mapState('liveSportSize', {
				liveSportSize: state => state.sportSize
			}),
			...mapGetters('oddsBoost', ['isEventBoost']),
			// 这里展示的是所有的体育类型的可投注的和
			liveMatchSize () {
				return (this.liveSportSize || []).reduce((res, cur) => {
					if (cur && cur.eventSize) {
						res += cur.eventSize;
					}
					return res;
				}, 0);
			}
		},
		methods: {
			reloadingLive () {
				this.fetchLive(this.currentLiveId);
			},
			...mapActions(['fetchLive', 'changeLive']),
			...mapActions('home', {
				fetchLiveMatch: 'fetchLive'
			}),
			...mapMutations('home', [CHANGE_LIVE_ID])
		}
	};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-live {
	padding: 27/@rem 0 0;
	background-color: @darker;
	color:@white;
	.m-bet-tab{
		margin-top: 7/@rem;
		background-color: @darker; // 添加以解决低端手机色差bug, 实例可见 A12 测试机

		.m-sport-type{
			.m-sport-type-item{
				font-size: 12/@rem;
				padding: 16/@rem 15/@rem 13/@rem;
				line-height: 1;
				font-weight: bold;
				&.active{
					border-bottom: 3px solid @green;
				}
			}
		}

		.m-bet-content{
			.m-live-table{
				.m-name-row{
					display:flex;
					.m-name-cell{
						display: flex;
						justify-content: flex-end;
						background: fade(@lightGray, 15%);
						color: @darkGray;

						.m-name {
							width: 55%;
							display:flex;
							&>div{
								height: 24/@rem;
								line-height: 24/@rem;
								text-align: center;
								flex: 1
							}
						}
					}
				}

				&.tennis {
					.m-info-cell {
						width: 26%;
						padding-right: 10/@rem;
						box-sizing: border-box;
					}
				}
			}
			.view-all{
				a, a:hover,a:visited,a:active, a:after {
					color: @midGreen;
					text-decoration: none;
				}
			}
		}
	}

	.no-data{
		&:before{
			color: fade(@lightGray, 15%);
		}
	}

	.m-loading.dark {
		background: @darker;
	}
}
</style>
