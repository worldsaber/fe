<template>
	<div class="m-top-leagues" v-loading:fetchTopLeagues="topLeaguesLoading">
		<template v-if="topLeaguesLoading === false">
			<div v-if="sportProductStatus === 1" class="m-sport-bet-error">
				Failed to load game data. An error occurred while connecting to server.
			</div>
			<template v-else>
				<LeagueList
					:leagues="topLeagues"
					:productId="productId"
					:showLeaguesIndex="[0]"
					@updateLeagues="updateLeagues"
					@deleteTournament="deleteTournament">
				</LeagueList>

				<div class="view-all">
					<a @click="jumpViewAll">View All {{currentSportNameUpper}}</a>
				</div>
			</template>
		</template>
  	</div>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';
import * as mutationsTypes from 'store/home/mutationTypes';
import { pagePath } from 'config/pageConfig';
import LeagueList from './leagueList.vue';

export default {
	name: 'TopLeagues',
	components: {
		LeagueList
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
		...mapState('home', [
			'topLeagues',
			'topLeaguesLoading',
			'currentSportId',
			'sportProductStatus'
		]),
		...mapGetters('home', [
			'currentSportName',
			'currentSportNameUpper'
		])
	},
	watch: {
		visible: {
			immediate: true,
			handler(val) {
				if (val) {
					if (!this.isOnceRequested) {
						this.fetchTopLeagues();
						this.isOnceRequested = true;
					}
				}
			}
		}
	},
	methods: {
		...mapActions('home', ['fetchTopLeagues', 'fetchLeagueEvents']),
		...mapMutations('home', {
			deleteTournament: mutationsTypes.DELETE_TOURNAMENT,
			updateLeagues: mutationsTypes.UPDATE_TOURNAMENT
		}),
		jumpViewAll () {
			location.href = URL.addPara(pagePath.sports, {
				source: 'home_list',
				sport: this.currentSportName
			});
		}
	}
};
</script>
