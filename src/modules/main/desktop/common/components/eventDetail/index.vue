<template lang="html">
	<div class="m-detail-wrapper">
		<template v-if="loading && showLoading">
			<div class="m-detail-loading">
				<div>
					<i class="m-icon-loading"></i>
					<span class="m-text-msg">Loading...</span>
				</div>
			</div>
		</template>

		<template v-else-if="loadError && showLoading">
			<div class="m-detail-error">
				<div>
					<div class="m-error-title">Oops!</div>
					<span class="m-error-msg">Failed to load game data.Please refresh the page.</span>
					<af-Button @click="refresh">Refresh</af-Button>
				</div>
			</div>
		</template>

		<template v-else-if="isProductOff">
			<div class="m-detail-error m-detail-error-fix">
				<div>
					<span class="m-error-msg">Failed to load game data. An error occurred while connecting to server. </span>
				</div>
			</div>
		</template>

		<template v-else-if="!eventFinished">
			<nav class="m-nav">
				<div
					v-for="item in getMarketGroup"
					@click="handleChangeGroup(item)"
					:class="getGroupItemStyle(item)"
				>
					<div>{{item}}</div>
				</div>
			</nav>
			<template v-if="getRenderList.length">
				<BetTable
					v-for="item in getRenderList"
					:key="item.marketId"
					:tableConfig="item"
				></BetTable>
			</template>

			<template v-else>
				<div class="m-detail-error">
					<div>
						<span class="m-error-msg">There are no markets currently available in this category. Please try later. Thank you.</span>
					</div>
				</div>
			</template>
		</template>

	</div>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import { EventBus } from 'kernel/js/eventBus.js';

import commonEvent from 'config/eventConfig/commonEvent.js';
import { sportType2Id } from 'config/sportsType';

import * as mutationTypes from 'store/eventDetail/mutationTypes';

import BetTable from './betTable.vue';

export default {
	props: {
		showLoading: {
			type: Boolean,
			'default': true
		}
	},
	components: {
		BetTable
	},
	computed: {
		...mapGetters('eventDetail', [
			'getRenderList',
			'getMarketGroup',
			'getPackMarket',
			'formatOutcomeKey',
		]),
		...mapState('eventDetail', [
			'currentMarketGroup',
			'loading',
			'loadError',
			'eventFinished',
			'isProductOff'
		]),
		...mapState('betslip', [
			'betslipsKeys'
		]),
	},
	methods: {
		...mapActions('eventDetail', [
			'fetchMarketGroup',
			'fetchEventDetail',
			'resetEventData'
		]),
		...mapMutations('eventDetail', {
			changeMarketGroup: mutationTypes.UPDATE_MARKETGROUP,
			updateCheckList: mutationTypes.UPDATE_SELECT_LIST,
			resetOutComeList: mutationTypes.RESET_OUTCOMECHECKED_STATUS
		}),
		getGroupItemStyle(type) {
			return [
				'm-nav-item',
				{
					'm-nav-item--active': this.currentMarketGroup === type
				}
			];
		},
		handleChangeGroup(type) {
			this.changeMarketGroup(type);
		},
		loadDetail(sportId, eventId) {
			eventId && this.resetEventData({
				eventId,
				sportId
			});

			this.fetchEventDetail().then(data => {
				// 获取market 分类
				this.fetchMarketGroup();
			}).catch(err => {}); // eslint-disable-line
		},
		refresh() {
			const params = this.$route && this.$route.params || {},
				eventId = params.eventId || '',
				sportName = params.sportName || '',
				sportId = sportName ? `sr:sport:${sportType2Id[sportName]}` : '';

			this.loadDetail(sportId, eventId);
		}
	},
	mounted() {
		this.updateCheckList(this.betslipsKeys);
		EventBus.$on(commonEvent.NOTIFY_BETSLIPS_CHANGE, this.updateCheckList);

		// betslips 相关的
		EventBus.$on(commonEvent.DELETE_BET_SLIPS_ITEM, key => {
			const keyMap = this.formatOutcomeKey(key);

			if (keyMap) {
				this.updateCheckList({
					checked: false,
					marketId: keyMap.marketId,
					outcomeId: keyMap.outcomeId
				});
			}
		});
		EventBus.$on(commonEvent.RESET_BET_SLIPS, this.resetOutComeList);
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';
@import 'base/style/logoLoading.less';
@import 'components/login/style/buttonMixin.less';

.m-detail-wrapper {
	width: 100%;
	padding: 20px 10px 0;
	box-sizing: border-box;

	.m-nav {
		border-bottom: 1px solid fadeout(@grayBorder, 50%);

		width: 100%;

		.m-nav-item {
			display: inline-block;
			vertical-align: top;
			border-bottom: 3px solid transparent;
			padding: 6px 14px;
			box-sizing: border-box;

			&:hover {
				border-bottom: 3px solid fadeout(@green, 30%);
			}

			div {
				color: @white;
				font-size: 14px;
				line-height: 18px;
				text-transform: capitalize;
			}
		}

		.m-nav-item--active {
			border-bottom: 3px solid @green !important;
			font-weight: bold;
		}
	}

	.m-detail-loading {
		height: 200px;
		box-sizing: border-box;

		display: table;
		display: flex;

		align-items: center;
		justify-content: center;
		flex-direction: column;

		> div {
			display: table-cell;
			text-align: center;
			vertical-align: middle;
		}

		.m-icon-loading {
			.m-icon-logo();
			display: block;
			width: 60px;
			height: 60px;
			line-height: 60px;
			color: @dark;
			background: fadeout(@lightGray, 85%);
			border-radius: 50%;
			margin-bottom: 10px;
			animation: logoLoading 1s infinite cubic-bezier(0.4, 0, 1, 1) alternate;

			&:before {
				font-size: 32px;
			}
		}

		.m-text-msg {
			color: @darkGray;
			font-size: 12px;
			line-height: 16px;
		}
	}

	.m-detail-error {
		display: table;
		display: flex;

		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;

		> div {
			text-align: left;
			vertical-align: top;

			padding: 30px 40px;
			box-sizing: border-box;
		}

		.m-error-title {
			font-size: 64px;
			color: @darkGray;
			line-height: 87px;
		}

		.m-error-msg {
			display: block;
			font-size: 14px;
			line-height: 19px;
			color: @midGray;
			margin: 4px 0 18px;
		}

		.af-button {
			border-radius: 2px;
			.button--primary();
			width: 65px;
			height: 32px;
			font-size: 12px;
			border: none;
			padding: 0 !important;
		}
	}

	.m-detail-error-fix {
		> div {
			padding: 50px 40px;
		}
	}
}
</style>
