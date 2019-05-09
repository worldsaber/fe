<template>
	<div class="bingo-hisParti-wrap">
		<NavBar :backClick="handleBack">
			<homeNav slot="right"/>
		</NavBar>
		<af-tabs class="list-wrap" :value="currentTab" @change="handleTabChange" v-if="params.mode === 'both'">
			<af-tab-pane label="Participants" name="participant">
				<MoreList :fetchData="getPartiList" :params="listParams">
					<template slot="list" slot-scope="{ list }">
						<div class="m-list" v-if="list.length > 0">
							<template v-for="(item, index) in list">
								<participant :key="index" :data="item" @click.native="goParti(item)"/>
							</template>
						</div>
						<div class="m-goods-empty" v-else>
							You don't have any items in this category.
						</div>
					</template>
					<span slot="noMore">No More Participants</span>
				</MoreList>
			</af-tab-pane>
			<af-tab-pane label="History" name="history">
				<MoreList :fetchData="getHistory" :params="historyParams">
					<template slot="list" slot-scope="{ list }">
						<div class="m-goods-list" v-if="list.length > 0">
							<template v-for="(item, index) in list">
								<history :key="index" :data="item" @click.native="goRound(item)"/>
							</template>
						</div>
						<div class="m-goods-empty" v-else>
							You don't have any items in this category.
						</div>
					</template>
				</MoreList>
			</af-tab-pane>
		</af-tabs>
		<template v-else-if="params.mode === 'participant'">
			<div class="tab-title">Participants</div>
			<MoreList :fetchData="getPartiList" :params="listParams">
				<template slot="list" slot-scope="{ list }">
					<div class="m-list" v-if="list.length > 0">
						<template v-for="(item, index) in list">
							<participant :key="index" :data="item" @click.native="goParti(item)"/>
						</template>
					</div>
					<div class="m-goods-empty" v-else>
						You don't have any items in this category.
					</div>
				</template>
				<span slot="noMore">No More Participants</span>
			</MoreList>
		</template>
		<template v-else-if="params.mode === 'history'">
			<div class="tab-title">History</div>
			<MoreList :fetchData="getHistory" :params="historyParams">
				<template slot="list" slot-scope="{ list }">
					<div class="m-goods-list" v-if="list.length > 0">
						<template v-for="(item, index) in list">
							<history :key="index" :data="item" @click.native="goRound(item)"/>
						</template>
					</div>
					<div class="m-goods-empty" v-else>
						You don't have any items in this category.
					</div>
				</template>
			</MoreList>
		</template>
	</div>
</template>
<script>
import { AfTabs, AfTabPane } from 'packages/tabs';
// import dateFormat from 'kernel/js/dateFormat';
import { formatNumber } from 'utils';
import NavBar from 'components/navbar';
import homeNav from 'components/homeNav';
import MoreList from '../../../components/moreList';
import participant from '../../../components/participant.vue';
import history from './history.vue';
import { UTCToServer } from '../../../js/utils.js';

export default {
	components: {
		AfTabs,
		AfTabPane,
		MoreList,
		participant,
		history,
		NavBar,
		homeNav
	},
	props: ['roundInfo', 'params'],
	data() {
		return {
			currentTab: 'participant',
			listParams: {
				roundId: this.roundInfo.roundId
			},
			historyParams: {
				goodsId: this.roundInfo.goodsId
			}
		};
	},
	created() {
		this.currentTab = this.params.tab || 'participant';
	},
	methods: {
		handleBack() {
			this.$emit('back');
		},
		handleTabChange(val) {
			this.currentTab = val;
		},
		goParti(item) {
			const userId = item ? item.userId : '';
			this.$router.push({
				path: `/participation/${this.roundInfo.roundId}`,
				query: {
					userId,
					goodsId: this.roundInfo.goodsId
				}
			});
		},
		goRound(item) {
			this.$emit('back');
			this.$router.push({
				path: `/detail/${item.roundId}`,
				query: {
					status: 4
				}
			});
		},
		getHistory(params) {
			return fetch('/bingowin/goods/history', {
				body: params,
				method: 'GET',
				headers: new Headers({
					'Content-Type': 'application/json'
				})
			}).then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					const data = res.data;
					const extra = data.extra || {};
					const list = this.formatHistory(data.entityList || []);
					// hasMore
					const hasMore = extra.hasNext;
					// last
					const last = extra.lastId;
					return {
						list,
						hasMore,
						lastId: last
					};
				}
			});
		},
		formatHistory(history) {
			history && history.forEach(item => {
				// item.showPublishedTime = dateFormat.format(item.publishedTime, 'DD/MM/YYYY HH:mm:ss');
				item.showPublishedTime = UTCToServer(item.publishedTime);
				item.showBoughtFee = `${window.currency} ${formatNumber(item.boughtFee / 10000, 0)}`;
			});
			return history;
		},
		getPartiList(params) {
			return fetch('/bingowin/goods/round/participants', {
				body: params,
				method: 'GET',
				headers: new Headers({
					'Content-Type': 'application/json'
				})
			}).then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					const data = res.data;
					const extra = data.extra || {};
					const list = this.formatEntity(data.entityList || []);
					// hasMore
					const hasMore = extra.hasNext;
					// last
					const last = extra.lastId;
					return {
						list,
						hasMore,
						lastId: last
					};
				}
			});
		},
		formatEntity(entityList) {
			entityList && entityList.forEach(item => {
				item.showTime = UTCToServer(item.createTime, true);
				item.showBoughtFee = formatNumber(item.boughtFee / 10000, 0);
			});
			return entityList;
		},
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';

.bingo-hisParti-wrap {
	.list-wrap {
		.m-tabs-nav .m-tabs-tab {
			padding: 15/@rem 16/@rem;
			line-height: 16/@rem;
			font-size: 14/@rem;
		}
		.m-tabs-nav .m-tabs-tab-active {
			color: @green;
		}
		.m-tabs-ink-bar {
			background-color: @green;
		}
	}
	.tab-title {
		padding: 0 16/@rem;
		font-size: 14/@rem;
		line-height: 48/@rem;
	}
}
</style>
