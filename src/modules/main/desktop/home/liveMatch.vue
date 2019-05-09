<template>
	<div class="live-match">
		<div class="banner">
			<span class="circle"></span>
			<span class="text">Live Betting</span>
			<div class="config"  v-show="!loading">
				<span class="printer" @click="print" v-show="sportSize && sportSize.length">Print</span>
				<span @click="fetchData" class="refresh">Refresh</span>
			</div>
		</div>
		<div id="print-container-live">
			<div class="sport-name" v-if="sportSize && sportSize.length">
				<div
					:class="['sport-name-item', {
						active: currentSportId === sport.id
					}]"
					v-for="sport in preSportSize"
					:key="sport.id"
					@click="onChangeSport(sport.id)">
					<div class="text">{{sport.name}}</div>
				</div>
				<SimpleSelect v-if="postSportSize.length > 0" :class="['sport-simple-select', isSelectedActive ? 'sport-simple-select-active' : '' ]" 
					:data="postSportSize" placeholder="More Games" 
					@selected="onSelectedSport" ref="select"></SimpleSelect>
			</div>
			<div v-loading:fetchData.dark="loading">
				<template v-if="!loading">
					<div v-if="liveProductStatus === 1" class="m-sport-bet-error">
						Failed to load game data. An error occurred while connecting to server.
					</div>
					<div class="match" v-else-if="live && live.tournamentOrder && live.tournamentOrder.length">
						<template v-for="tournamentId in live.tournamentOrder">
							<AfTable class="match-table live-table" v-if="tournamentId && live.map[tournamentId] && hasEvent(live.map[tournamentId])" :key="tournamentId">
								<!-- 循环title -->
								<AfTableRow class="league-row">
									<!-- 日期 -->
									<AfTableCell class="league">{{live.map[tournamentId].categoryName}} {{live.map[tournamentId].name}}</AfTableCell>
									<!-- 这里title不好取，就直接用自己生成的 -->
									<AfTableCell :class="['each-module-wrap', {
										'each-module-two-line': true
									}]">
										<div class="market-desc-wrap clearfix" v-if="true">
											<div class="market-desc" v-for="marketId in currentMarketIds" :key="marketId">
												{{currentMarketName[marketId]}}
											</div>
										</div>
										<div>
											<div v-for="marketId in currentMarketIds" :key="marketId" :class="[
												'each-module-table',
												{'two-markets': currentMarketIds.length === 2}
											]">
												<div v-for="(title, index) in getTitle(marketId)" :key="index" class="each-module">{{title}}</div>
											</div>
										</div>
									</AfTableCell>
									<!-- 打印:补充table元素 -->
									<div class="print-element p-table-th">
										<div class="id">Status</div>
										<div class="time">time</div>
										<div class="event">Event</div>
										<div class="score">Score</div>
									</div>
									<!-- ie9站位 -->
									<AfTableCell></AfTableCell>
								</AfTableRow>
								<template v-for="(eventIds, date) in live.map[tournamentId].eventOrder">
									<!-- 循环event -->
									<LiveEvent v-for="(eventId, index) in eventIds"
										:event="live.map[tournamentId].events[eventId]"
										:key="eventId"
										:currentMarketIds="currentMarketIds"
										:sportId="currentSportId"
										:productId="productId"
									>
									</LiveEvent>
								</template>
							</AfTable>
						</template>
						<div class="view-all"
							v-if="live && live.showViewAll"
							@click="viewAllImportant()">
							View All
						</div>
						<div class="print-footer"> Footer </div>
					</div>
					<div v-else class="m-sport-bet-no-data">
						<p>There are no games currently available.</p>
						<p>Please try later. Thank you.</p>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import LiveEvent from 'components/eventList/liveEvent.vue';
import { mapState, mapActions } from 'vuex';
import { isEmptyObject } from 'utils';
import { sportConfigLowerCase } from 'config/sportsType'; // sportConfigOrder
import { baseUrl } from 'config/pageConfig';
import { marketsTtile, marketNameForLive } from 'components/eventList/marketConst';
import SimpleSelect from 'components/simpleSelect';
import 'components/loading';
import 'lib/print';
import printStyles from 'lib/print/style/print-styles-list.js';

export default {
	name: 'LiveMatch',
	components: {
		LiveEvent,
		SimpleSelect
	},
	computed: {
		...mapState('home', [
			'live',
			'isViewAllLive',
			'liveMarketIds',
			'liveProductStatus'
		]),
		...mapState('liveSportSize', [
			'sportSize'
		]),
		currentMarketIds () {
			return this.liveMarketIds[this.currentSportId];
		},
		currentMarketName () {
			return marketNameForLive[this.currentSportId];
		},
		sportSizeByOrder() {
			// const sizes = this.sportSize || [];
			// return sizes.sort((sa, sb) => sportConfigOrder[sa.id] - sportConfigOrder[sb.id]);
			return this.sportSize;
		},
		sportLen() {
			return this.sportSizeByOrder.length;
		},
		preSportSize() {
			return this.sportLen > 7 ? this.sportSizeByOrder.slice(0, 6) : this.sportSizeByOrder;
		},
		postSportSize() {
			const sizes = this.sportLen > 7 ? this.sportSizeByOrder.slice(6) : [];
			return sizes.map(item => ({
				...item,
				label: item.name
			}));
		},
		postSportId() {
			return this.postSportSize.map(item => item.id);
		},
		isSelectedActive() {
			return this.postSportId.includes(this.currentSportId);
		}
	},
	data() {
		return {
			productId: 1,
			timeline: 24,
			// 当前运动类型
			currentSportId: '',
			loading: false,
		};
	},
	created () {
		this.fetchData();
	},
	methods: {
		...mapActions('liveSportSize', ['fetchSportSize']),
		...mapActions('home', [
			'fetchLiveOrPrematchEvents',
		]),
		hasEvent(res) {
			if (!res) {
				return false;
			}
			return !isEmptyObject(res.events);
		},
		changeSport (id) {
			this.currentSportId = id;
			this.fetchData();
		},
		// importantMatch -- 请求不同的 sportId 下的比赛
		fetchData() {
			this.loading = true;
			return this.fetchSportSize({
				timeline: this.timeline,
				productId: this.productId,
				option: 1
			})
			// 默认选中第一个
			.then(data => {
				// 拦截 运动
				// data = data.filter(sport => limitSportId.includes(sport.id));
				if (data && data.length) {
					if (!this.currentSportId || !data.find(cur => cur.id === this.currentSportId)) {
						this.currentSportId = data[0].id;
					}
				} else {
					this.currentSportId = null;
				}
			})
			.then(() => {
				if (this.currentSportId) {
					return this.fetchLiveOrPrematchEvents({
						sportId: this.currentSportId
					});
				}
			})
			// 如果请求被打断，则不处理成加载完成
			.then(res => {
				if (!res || !res.abort) {
					this.loading = false;
				}
			})
			.catch(res => {
				if (!res || !res.abort) {
					this.loading = -1;
				}
			});
		},
		// 跳到 Sports -- Game List页面
		viewAllImportant() {
			location.href = `${baseUrl}sport/${sportConfigLowerCase[this.currentSportId.slice(9)]}/live_list/`;
		},
		print() {
			window.printJS({
				printable: 'print-container-live',
				documentTitle: 'SportyBet',
				styles: printStyles
			});
		},
		/**
		 * title并不是每个market都由，title只在列表页面中有用，title就是desc的另外一种描述形式
		 * 目前已经有的title
		 */
		getTitle(marketId, originTitle = '') {
			originTitle = originTitle.split(',');
			if (originTitle.length > 1) {
				return originTitle;
			}
			if (marketsTtile[this.currentSportId][marketId]) {
				return marketsTtile[this.currentSportId][marketId];
			}
			return [];
		},
		onSelectedSport(payload) {
			const id = payload.item.id;
			this.changeSport(id);
		},
		onChangeSport(id) {
			this.changeSport(id);
			const $select = this.$refs.select;
			$select && $select.clear();
		}
	}
};
</script>

<style lang="less">
.print-element {
	display: none;
}
#print-container-live{
	.sport-name{
		display: flex;
		width: 725px;
		box-sizing: border-box;
		
		// justify-content: space-around;
		.sport-simple-select{
			height: 48px;
			line-height: 48px;
			color: #FFF;
			width: 148px;
			font-size: 14px;
			text-align: left;
			margin-bottom: -1px;
			background-color: #1B1E25;
			&:hover{
				border-bottom: 4px solid rgba(13, 151, 55, 0.7);
			}
			.select-title{
				padding: 0 20px;
				.arrow-icon{
					background-color: #1B1E25;
				}
				background-color: #1B1E25;
			}
			.select-list{
				background-color: #1B1E25;
			}
			.select-item{
				padding: 0 20px;
			}
		}
		.sport-simple-select-active{
			border-bottom: 4px solid #0D9737;
		}
	}
}
</style>
