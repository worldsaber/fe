<template>
	<article class="m-betting">
		<!-- 期次 -->
		<header class="match-dec">
			Round No. {{periodData.periodNumber}}
		</header>
		<!-- 投注项选择列表 -->
		<section :class="['match-list',{'disable': isDisable}]">
			<div class="list-head">
				<ul>
					<li class="no"></li>
					<li class="date-matche">Date/Match</li>
					<li class="odds">
						<div class="outcome">
							<span class="home">1(Home)</span>
							<span class="draw">X(Draw)</span>
							<span class="away">2(Away)</span>
						</div>
					</li>
				</ul>
			</div>
			<div class="list-body" v-for="(item, i) in periodData.elements" :key="item.eventId">
				<match-item :ref="`match-${i}`" :matchData="item" :index = "i" :disable="isDisable" :selectItems="selectItems" />
			</div>
		</section>
		<control @rush="rush"/>
	</article>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import * as mutationTypes from 'store/jackpot/mutationTypes';
import 'components/dialog';
import { LS } from 'storage';
import matchItem from './matchItem.vue';
import control from './controlCom.vue';

export default {
	components: {
		matchItem,
		control
	},
	computed: {
		...mapState('jackpot', ['periodData', 'selections', 'orderData', 'gameSize']),
		...mapGetters('jackpot', ['combinations', 'status']),
		itemsSize() {
			return this.selections.itemsSize;
		},
		// 是否可投
		isDisable() {
			return this.periodData.status !== 1;
		},
	},
	watch: {
		itemsSize(newVal, oldVal) {
			// 选择后清空缓存选项
			if (this.haveLS && oldVal > 0) {
				LS.remove(this.lsKey);
				this.haveLS = false;
			}
			// 吸底弹出出现后，增加页脚高度，确保页脚能完全显示
			const foot = this.$root.$el.querySelector('.m-footer');
			if (oldVal === 0 && newVal > 0) {
				foot.style.marginBottom = '13rem';
			} else if (newVal === 0) {
				foot.style.marginBottom = '0';
			}
		}
	},
	data() {
		return {
			selectItems: {},
			haveLS: false,
			pageType: '',
			lsKey: 'jackpot_selected',
		};
	},
	methods: {
		...mapMutations('jackpot', {
			updateSelections: mutationTypes.UPDATE_SELECTIONS,
		}),

		// 获取在余额不足时缓存的选择项
		getDefaultSelect() {
			const cacheSelect = JSON.parse(LS.get(this.lsKey) || '{}');
			if (cacheSelect.itemsSize) {
				this.haveLS = true;
				this.selectItems = cacheSelect.selectList || {};
				this.updateSelections({
					type: 'allData',
					allData: cacheSelect
				});
			}
		},
		rush() {
			let matchEle;
			const selectKeys = Object.keys(this.selections.selectList);
			console.log(selectKeys);
			for (let i = 0; i < this.gameSize; i++) {
				if (selectKeys.indexOf(i.toString()) < 0) {
					matchEle = this.$refs[`match-${i}`];
					if (matchEle && matchEle[0]) {
						matchEle[0].randomPick();
					}
				}
			}
		}
	},
	mounted() {
		this.getDefaultSelect();
	},
};
</script>
<style lang="less">
@import "~base/styles/mixin.less";
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";
.m-betting {
	background-color: @blueBlack;

	.match-dec {
	height: 25/@rem;
	text-align: center;
	font-size: 14/@rem;
	line-height: 25/@rem;
	background-color: fade(@lightGray, 15%);
	color: @darkGray;
	}
	.match-list {
		margin: 0 10/@rem 0 0;
	.list-head {
		height: 30/@rem;
		background-color: @blueBlack;
		color: @midGray;

		ul {
		display: table;
		width: 100%;
		height: 100%;
		li {
			display: table-cell;
			vertical-align: middle;
			text-align: center;
			&.date-matche {
			text-align: left;
			}
		}
		}
	}
	.no {
		width: 33/@rem;
	}
	.date-matche {
		text-align: left;
	}
	.odds{
		width: 55%;
		.outcome{
			display: table;
			width: 100%;
			span{
				display: table-cell;
				width: 33%;
				border-right: 1px solid @blueBlack;
			}
		}
	}
	}
	&.showControlCom{
		padding-bottom: 180/@rem;
	}
	.list-body:last-child .match-item dd {
		border-bottom: none;
	}
}

</style>
