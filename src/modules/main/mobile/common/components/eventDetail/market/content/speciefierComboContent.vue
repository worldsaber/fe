<template>
	<AfTable :class="['market-content', marketClass]" v-if="isShow">
		<AfTableRow >
			<AfTableCell v-for="title in showData.title"
			class="m-outcome-combo-title m-outcome-row-specifier-combo-title"
			:key="title">{{title}}</AfTableCell>
		</AfTableRow>
		<AfTableRow v-for="(content, index) in showData.content" :key="index">
			<template v-for="(one, i) in content">
				<AfTableCell v-if="i === 0"
				class="m-table-cell m-outcome-only-odds m-outcome-combo-title  m-specifier-colum-title"
				:key="one"><em>{{one}}</em><a :href="oddsBoostUrl" v-if="getIsBoost(content.market.id, content.market.specifier, content.market)"><img class="boost" src="../../image/boost-icon.svg" /></a></AfTableCell>
				<OutcomeCell v-else
				class="m-outcome-combo  m-outcome-only-odds"
				:data-one='one'
				:outcomeId="one.id"
				:market="content.market"
				:key="`${index}-${i}-${one.id}`">
					<em v-if="one && one.isActive === 1 && content.market.status === 0">{{one.odds}}</em>
					<em v-else class="m-icon-lock"></em>
				</OutcomeCell>
			</template>
		</AfTableRow>
	</AfTable>
</template>
<script>
import { AfTable, AfTableRow, AfTableCell } from 'packages/tableLayout';
import { oddsBoostActivity } from 'config/activity/activityConfig';
import OutcomeCell from './outcomeCell.vue';
import { getSpeciefierComboMarketContentData } from '../../js/commonFun';

export default {
	components: {
		AfTable,
		AfTableRow,
		OutcomeCell,
		AfTableCell
	},
	model: {
		prop: 'isShow',
		event: 'isShow'
	},
	props: {
		isShow: {
			type: Boolean,
			'default': true
		},
		market: {
			type: Array,
			required: true,
		},
		speciefierIndex: {
			type: Array,
			required: true
		}
	},
	data () {
		return {
			oddsBoostUrl: oddsBoostActivity
		};
	},
	created () {
		// 18 over under默认显示，其他的隐藏
		if (!(this.marketId === 18)) {
			this.$emit('isShow', false);
		}
	},
	methods: {
		getIsBoost(marketId, specifier) {
			// 在live的时候回有这个 getter，prematch没有
			const m = this.$store.getters['oddsBoost/isMarketBoost'];
			const event = this.$store.state.eventDetail.event;
			// 取不到 getter就不显示
			if (!m) {
				return false;
			}
			return m.call(this, {
				tournamentId: event.tournamentId,
				eventId: event.eventId,
				marketId,
				specifier,
			});
		}
	},
	computed: {
		showData() {
			return getSpeciefierComboMarketContentData(this.market, this.speciefierIndex);
		},
		// 代表这一组market的id
		marketId () {
			return this.market && this.market.length ? +this.market[0].id : null;
		},
		// 根据不同的类型动态注入class
		marketClass () {
			// desc包括&表示是组合market
			const id = this.marketId;
			if (id === 18) {
				return 'over-under-market-content';
			} else if (id === 775) {
				return 'player-goals-market-content';
			} else if (id === 770) {
				return 'player-assists-market-content';
			}
		}
	}
};
</script>

<style lang="less">
@import './outcome.less';
</style>
<style scoped lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';
.market-content {
	.m-outcome-row-specifier-combo-title{
		height: 25/@rem;
		line-height: 25/@rem;
		box-sizing: content-box;
		padding-left: 5/@rem;
	}
	.m-specifier-colum-title{
		margin-right: 5/@rem;
		flex: 1 1 auto;
		text-align: left;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.em, a{
			display: block;
		}
		.em{
			word-break: break-word;
		}
	}
}
.player-assists-market-content{
	.m-outcome-combo-title{
		&:first-child{
			flex:1;
			width: auto;
		}
		flex: 0 0 auto;
		width: 23.5%;
	}
	.m-outcome-combo{
		flex: 0 0 auto;
		width: 23.5%;
	}
}
.player-goals-market-content{
	.m-outcome-combo-title{
		&:first-child{
			flex:1;
			width: auto;
		}
		flex: 0 0 auto;
		width: 15.5%;
	}
	.m-outcome-combo{
		flex: 0 0 auto;
		width: 15.5%;
	}
}
.over-under-market-content{
	.m-outcome-combo{
		flex: 0 0 auto;
		width: 36%;
	}
}
</style>
