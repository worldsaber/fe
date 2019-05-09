<template>
  	<div v-loading:fetchTodaySports="todaySportsLoading">
		<template v-if="todaySportsLoading === false">
			<div v-if="sportProductStatus === 1" class="m-sport-bet-error">
				Failed to load game data. An error occurred while connecting to server.
			</div>
			<template v-else>
				<div class="m-bet-content">
					<template>
						<!-- 根据当前玩法取到当前玩法的数据 -->
						<div v-if="!hasData" class="no-data">
							<p>Sorry, there are no games currently </p>
							<p>available in this category. Please try later.</p>
							<p>Thank you.</p>
						</div>
						<template v-else>
							<OrderEventsList
								:events="events"
								:currentMarketIds="[marketIds[currentSportId]]"
								:sportId="currentSportId"
								:productId="productId"
								:isShowEventLeagueName="true">
							</OrderEventsList>
							<div class="view-all">
								<a :href="viewAllLink">View More</a>
							</div>
						</template>
					</template>
				</div>
			</template>
		</template>
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import OrderEventsList from 'components/eventsList/orderEventsList';
import { pagePath } from 'config/pageConfig';

export default {
	name: 'TodaySports',
	components: {
		OrderEventsList
	},
	props: {
		// 当前组件是否可见，用于控制动态加载数据
		visible: {
			type: Boolean,
			'default': false
		}
	},
	data () {
		return {
			productId: 3,
			isOnceRequested: false // 是否请求过数据
		};
	},
	computed: {
		...mapState('home', ['homeCfg', 'todaySports',
			'todaySportsLoading', 'marketIds', 'currentSportId',
			'sportProductStatus'
		]),
		// ...mapGetters('home', [
		// 	'currentSportName',
		//  'currentSportNameUpper'
		// ]),
		viewAllLink() {
			return URL.addPara(pagePath.preFootball, {
				source: 'home_list',
				time: 'all'
			});
		},
		events () {
			const data = [...this.todaySports];
			// 每隔20个event，插一条广告，最多两条
			if (this.homeCfg && Array.isArray(this.homeCfg.eventInner)) {
				const ads = this.homeCfg && this.homeCfg.eventInner;
				const step = 20;
				for (let i = 0; i < data.length; i++) {
					if (data.length > step && i % step === 0) {
						const adIndex = (i / step) - 1;
						if (adIndex >= 2) break;
						if (ads[adIndex]) {
							// 打标记
							ads[adIndex].isAd = true;
							// 插广告
							data.splice(i + (i / step) - 1, 0, ads[adIndex]);
						}
					}
				}
			}
			return data;
		},
		hasData() {
			return this.events && this.events.length;
		}
	},
	watch: {
		visible: {
			immediate: true,
			handler(val) {
				if (val) {
					if (!this.isOnceRequested) {
						this.fetchTodaySports();
						this.isOnceRequested = true;
					}
				}
			}
		}
	},
	methods: {
		...mapActions('home', ['fetchTodaySports'])
	}
};
</script>
