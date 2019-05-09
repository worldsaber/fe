<template>
<Layout class="m-best-odds-wrap" :isHaveRightPagelet="true">
	<div class="m-best-odds" slot="mid">
		<BackBar></BackBar>
		<OddsBoostBanner
			v-if="isDuringClaim"
			:periodId="periodId"
			source="bestOdds">
		</OddsBoostBanner>
		<Navs @change="changeCurrentMarket"></Navs>

		<div class="m-best-odds-list" v-loading:fetchData="loading">
			<template v-if="loading === false">
				<div v-if="productStatus === 1" class="m-sport-bet-error">
					Failed to load game data. An error occurred while connecting to server.
				</div>

				<div v-else-if="!hasData" class="no-data">
					<p>Sorry, there are no games currently</p>
					<p>available in this category. Please try later.</p>
					<p>Thank you.</p>
				</div>

				<template v-else>
					<League
						v-for="(id, index) in bestOdds.tournamentOrder"
						:key="index"
						:isShowContent="true"
						:name="getLeagueName(id)"
						:eventSize="bestOdds.map[id].eventSize">
						<EventsList
							v-if="hasEvents(bestOdds.map[id].events)"
							:eventOrder="bestOdds.map[id].eventOrder"
							:events="bestOdds.map[id].events"
							:currentMarketIds="[currentMarketId]"
							:sportId="currentSportId"
							:isShowNextGoalTitle="false"
							:isEventBoost="isLiveBoost"
							:isShowLiveMark="true">
						</EventsList>
					</League>
				</template>
			</template>
	  	</div>
	</div>
</Layout>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import { isEmptyObject } from 'utils';
import Layout from 'components/layout/main.vue';
import BackBar from 'components/navbar';
import League from 'components/eventsList/league.vue';
import EventsList from 'components/eventsList/normalEventsList.vue';
import OddsBoostBanner from 'components/oddsBoost/banner.vue';
import Navs from './pagelet/Navs.vue';

export default{
	name: 'BestOdds',
	components: {
		Layout,
		BackBar,
		League,
		EventsList,
		OddsBoostBanner,
		Navs
	},
	data() {
		return {
			loading: false,
			currentSportId: 'sr:sport:1',
			currentMarketId: '',
			params: {}
		};
	},
	computed: {
		...mapState('bestOdds', ['bestOdds', 'productStatus']),
		...mapState('oddsBoost', ['periodId']),
		...mapGetters('oddsBoost', ['isDuringClaim', 'isLiveBoostWithMarket']),
		hasData() {
			const { bestOdds } = this;
			return bestOdds && bestOdds.tournamentOrder && bestOdds.tournamentOrder.length;
		},
		isLiveBoost() {
			return this.isLiveBoostWithMarket({
				marketId: this.currentMarketId,
				productId: 1
			});
		}
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		...mapActions('bestOdds', [
			'getBestOddsList',
			'subBestOdds',
			'unsubBestOdds',
			'subProductStatus',
			'unSubProductStatus'
		]),
		...mapActions('oddsBoost', [
			'getOddsBoost'
		]),
		changeCurrentMarket(val) {
			this.currentMarketId = val;
		},
		parseParams() {
			const tournamentId = window.URL.getPara('tournamentId');

			if (tournamentId) {
				this.params.tournamentIds = tournamentId.split(',');
			}
		},
		async fetchData() {
			this.loading = true;
			const { tournamentIds } = this.params;
			try {
				const params = {};

				if (this.params.tournamentIds) {
					params.tournamentId = [tournamentIds];
				}

				await this.getBestOddsList(params);

				this.loading = false;
				this.subBestOdds();
			} catch (err) {
				this.loading = -1;
			}
		},
		getLeagueName(id) {
			if (this.bestOdds && this.bestOdds.map && this.bestOdds.map[id]) {
				return (this.bestOdds.map[id].categoryName || '') +
				' - ' + this.bestOdds.map[id].name;
			}
			return '';
		},
		hasEvents (events) {
			return !isEmptyObject(events);
		}
	},
	created() {
		this.pageLoading(false);
		this.parseParams();
		this.getOddsBoost();
		this.fetchData();
		this.subProductStatus();
	},
	beforeDestroy() {
		this.unsubBestOdds();
		this.unSubProductStatus();
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

.m-best-odds-wrap {
	.m-sport-bet-error{
		padding: 30/@rem 10/@rem;
		color: @dark;
	}

	.no-data{
		margin-top: 15%;
		margin-bottom: 15%;
		text-align: center;
		.m-icon-exclamation();
		padding: 28/@rem;
		color: @darkGray;
		&:before{
			color: @midGray;
			font-size: 30/@rem;
		}
	}

	.m-footer {
		padding-top: 20/@rem;
		margin-top: 0;
	}
}

.m-best-odds-list {
	.m-league {
		&:first-child {
			.m-league-title {
				border-top: 0;
			}
		}
	}
}
</style>
