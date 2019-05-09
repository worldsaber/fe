<template>
  	<!-- 国家选择下拉列表 -->
	<div class="m-countries" v-if="sportSize.length">
		<!-- <div class="m-country-title">{{sportId === 'sr:sport:1' ? 'COUNTRIES' : 'CATEGORIES'}}</div> -->
		<div class="m-country-title">{{countryTitle}}</div>
		<template v-for="sport in sportSize">
			<template v-if="sport.categories && sport.categories.length > 0">
				<template v-for="(category, index) in sport.categories">
					<league v-if="category.tournaments && category.tournaments.length > 0" :isShowContent="false" :key="index" class="league" :name="category.name">
						<ul class="tournament-list" v-if="category.tournaments">
							<li v-for="(tournament, index) in category.tournaments" :key="index" @click="jumpTournament(category.id, tournament.id)">
								<span>{{tournament.name}}</span><span>{{tournament.eventSize}}</span>
							</li>
						</ul>
					</league>
				</template>
			</template>
		</template>
	</div>
</template>

<script>
	// 数据等同于 chooseBar里面的数据用sportysize去取
	import { mapState } from 'vuex';
	import { sportsConfigById } from 'config/sports';
	import League from 'components/eventsList/league.vue';

	export default {
		components: {
			League,
		},
		props: {
			sportId: {
				type: String
			}
		},
		computed: {
			sportName () {
				const sport = sportsConfigById[this.sportId];
				if (sport) {
					return sport.name;
				}
				return '';
			},
			// 国家下拉列表标题
			countryTitle () {
				let title = this.sportId === 'sr:sport:1' ? 'COUNTRIES' : 'CATEGORIES';

				// Today 选项 文案优化
				const { name } = this.$route;
				const sportNameUpper = sportsConfigById[this.sportId].text;
				if (name === 'eventListToday') {
					title = `All Today ${sportNameUpper}`;
				}
				return title;
			},
			...mapState('sportSize', ['sportSize']),
		},
		methods: {
			jumpTournament (categoryId, tournamentId) {
				this.$router.push({
					name: 'eventList',
					params: {
						categoryId,
						tournamentId,
						sportName: this.sportName
					},
					query: {
						change_game: 1
					}
				});
			},
		}
	};
</script>

<style lang="less">
	@import '~base/styles/variable.less';
	@import 'base/styles/icon.less';
	.m-countries{
		padding: 10/@rem;
		.m-country-title{
			height: 50/@rem;
			line-height: 50/@rem;
			font-size: 18/@rem;
		}
		.tournament-list{
			li{
				line-height: 36/@rem;
				height: 36/@rem;
				padding-left: 28/@rem;
				overflow: hidden;
				&>span{
					float: left;
					&:first-child {
						width: 69%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					&:last-child{
						width: 29%;
						text-align: right;
					}
				}
			}
		}
	}
</style>
