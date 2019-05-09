<template>
	<div class="important-match">
		<div class="banner">
			<span class="circle"></span>
			<span class="text">Highlights</span>
			<div class="config" v-show="!loading">
				<span class="printer" @click="print" v-show="sportSize && sportSize.length">Print</span>
				<span @click="fetchData" class="refresh">Refresh</span>
			</div>
		</div>
		<div id="print-container">
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
			<div v-loading:fetchData="loading">
				<template v-if="!loading">
					<div v-if="sportProductStatus === 1" class="m-sport-bet-error">
						Failed to load game data. An error occurred while connecting to server.
					</div>
					<div class="match" v-else-if="sport && sport.tournamentOrder && sport.tournamentOrder.length">
						<!-- 循环输出当前联赛 -->
						<div class="tour-name-wrap">
							<div :class="['tour-item', {
									active: currentTournamentId === order
								}]"
								v-for="order in sport.tournamentOrder"
								@click="changeTournament(order)"
								:key="order">
								<!-- <PopOver title="test title" content="test message" position="top"></PopOver> -->
								<div class="category-name">{{sport.map[order].categoryName}}</div>
								<div class="tour-name">{{sport.map[order].name}}</div>
								<PopOver
									position="bottom"
									:isCenter="false"
									:arrowCenter="true"
									width="120px">
									<p>{{sport.map[order].categoryName}}<br />{{sport.map[order].name}}</p>
								</PopOver>
							</div>
						</div>
						<AfTable class="important-table match-table" v-if="currentTournamentId && sport.map[currentTournamentId]">
							<template v-for="(eventIds, date) in sport.map[currentTournamentId].eventOrder">
								<!-- 循环title -->
								<AfTableRow :key="date" class="date-row">
									<!-- 日期 -->
									<AfTableCell class="date">{{date}}</AfTableCell>
									<!-- 这里title不好取，就直接用自己生成的 -->
									<AfTableCell class="each-module-wrap">
										<div v-for="marketId in currentMarketIds" :key="marketId" :class="[
											'each-module-table',
											{'two-markets': currentMarketIds.length === 2}
										]">
											<div v-for="(title, index) in getTitle(marketId)" :key="index" class="each-module">{{title}}</div>
										</div>
									</AfTableCell>
									<!-- 打印:补充table元素 -->
									<div class="print-element p-table-th">
										<div class="id">ID</div>
										<div class="time">Time</div>
										<div class="event">Event</div>
									</div>
									<!-- ie9站位 -->
									<AfTableCell></AfTableCell>
								</AfTableRow>
								<!-- 循环event -->
								<template v-for="(eventId, index) in eventIds">
									<SportEvent
										:event="sport.map[currentTournamentId].events[eventId]"
										:key="eventId"
										:currentMarketIds="currentMarketIds"
										:sportId="currentSportId"
										:productId="productId"
										:eventId="eventId"
										@toggleH2h="toggleH2h"
										:class="{
											'active-h2h': !!h2hStatus[eventId]
										}"
									>
									</SportEvent>
									<LiveMatchTracker
										v-if="h2hStatus[eventId]"
										type="h2h"
										:eventId="eventId"
										:key="`tracker-${eventId}`"
									>
									</LiveMatchTracker>
								</template>
							</template>
						</AfTable>
						<div class="view-all"
							v-if="currentTournamentId && sport.map[currentTournamentId] && sport.map[currentTournamentId].showViewAll"
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
import SportEvent from 'components/eventList/sportEvent.vue';
import LiveMatchTracker from 'packages/liveMatchTracker/liveMatchTracker';
import { mapState, mapActions } from 'vuex';
import { sportConfigLowerCase } from 'config/sportsType'; // sportConfigOrder
import { baseUrl } from 'config/pageConfig';
import { marketsTtile } from 'components/eventList/marketConst';
import SimpleSelect from 'components/simpleSelect';

import 'components/loading';
import 'components/popOver';
import 'lib/print';
import printStyles from 'lib/print/style/print-styles-list.js';

export default {
	name: 'importantMatch',
	components: {
		SportEvent,
		LiveMatchTracker,
		SimpleSelect
	},
	computed: {
		...mapState('home', [
			'sport',
			'sportMarketIds',
			'sportProductStatus'
		]),
		...mapState('sportSize', [
			'sportSize'
		]),
		currentMarketIds () {
			return this.sportMarketIds[this.currentSportId];
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
			productId: 3,
			timeline: 24,
			// 当前联赛
			currentTournamentId: null,
			// 当前运动类型
			currentSportId: '',
			loading: false,
			h2hStatus: {}
		};
	},
	created () {
		this.fetchData();
	},
	methods: {
		...mapActions('sportSize', ['fetchSportSize']),
		...mapActions('home', [
			'fetchPcImportantEvents',
		]),
		toggleH2h(eventId) {
			this.h2hStatus = {
				[eventId]: !this.h2hStatus[eventId]
			};
		},
		changeSport (id) {
			this.currentSportId = id;
			this.fetchData();
		},
		changeTournament (id) {
			this.currentTournamentId = id;
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
				// data = data.filter(sport => limitSportId.includes(sport.id));

				// 如果tab更新，正好选中的那个被干掉了，就切换到第一个去
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
					return this.fetchPcImportantEvents({
						sportId: this.currentSportId
					})
					.then(() => {
						if (this.sport && this.sport.tournamentOrder &&
							this.sport.tournamentOrder.length) {
							this.currentTournamentId = this.sport.tournamentOrder[0];
						}
					});
				}
			})
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
			if (this.currentTournamentId) {
				const categoryId = this.sport.map[this.currentTournamentId].categoryName;
				const url = `${baseUrl}sport/${sportConfigLowerCase[this.currentSportId.slice(9)]}/${categoryId}/${this.currentTournamentId}`;
				window.location.href = url;
			}
		},
		print() {
			window.printJS({
				printable: 'print-container',
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
#print-container{
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
			background-color: #FFF;
			color: #353A45;

			&:hover{
				border-bottom: 4px solid rgba(13, 151, 55, 0.7);
			}
			.select-title{
				padding: 0 20px;
				.arrow-icon{
					background-color: #FFF;
				}
				background-color: #FFF;
			}
			.select-list{
				background-color: #FFF;
			}
			.select-item{
				padding: 0 20px;
				&:hover{
					color: #FFF;
				}
			}
			.select-item-active{
				color: #FFF;
			}
		}
		.sport-simple-select-active{
			border-bottom: 4px solid #0D9737;
		}
	}
}
</style>
