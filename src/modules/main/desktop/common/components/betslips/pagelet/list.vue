<template lang="html">
	<div class="m-item">
		<div
			class="m-lay-left"
			:style="getColorLumpStyle"
		>
			<i
				v-if="showCheckBox"
				:class="[
					'm-icon-check',
					{
						'm-icon-check--checked': checked,
						'm-icon-check--disabled': disabled
					}
				]"
				@click="toggleCheckStatus"
			></i>
		</div>
		<div
			class="m-lay-mid"
		>
			<div
				:class="[
					'm-lay-mid',
					{
						'm-lay-fix': showBankerBar
					}
				]"
			>
				<div class="m-item-play">
					<i :class="getIconType"></i>
					<span>{{slip.outcomeInfo.desc}}</span>
					<i
						class="m-icon-delete"
						@click="handleDelete"
					></i>
				</div>
				<div class="m-item-team" :title="getAgainst">
					<i class="m-icon-live" v-if="isLive">live</i>{{slip.gameId ? slip.gameId +' | ' : ''}}{{getAgainst}}
				</div>
				<div class="m-item-main">
					<span class="m-item-market">{{slip.marketInfo.desc}}</span>
					<div class="m-item-odds">
						<template
							v-if="slip.outcomeInfo.showOdds"
						>
							<span
								v-if="slip.outcomeInfo.statusDesc === 'up'"
								class="m-icon-up"
							></span>
							<span
								v-if="slip.outcomeInfo.statusDesc === 'down'"
								class="m-icon-down"
							></span>
							<span class="m-text-main">{{slip.outcomeInfo.odds}}</span>
						</template>
						<template v-else>
							<span class="m-text-min m-text-btn">{{slip.outcomeInfo.statusDesc}}</span>
						</template>
					</div>
				</div>
			</div>
			<div
				v-show="showBankerBar"
				class="m-banker-wrapper m-lay-right"
				@click="toggleBankerStatus"
			>
				<span
					:class="[
						'm-banker',
						{
							'm-banker--checked': isBanker,
							'm-banker--disabled': disabled
						}
					]"
				>B</span>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

import { EventBus } from 'kernel/js/eventBus.js';

import * as mutationTypes from 'store/betslip/mutationTypes';

import listEvent from 'config/eventConfig/listEvent.js';
import commonEvent from 'config/eventConfig/commonEvent.js';
import { colorLump } from 'config/stakeConfig';
import { getSportRoute } from 'config/sportsType';

export default {
	name: 'BetslipsList',

	props: {
		slip: {
			type: Object,
			default() {
				return {};
			}
		},
		checked: {
			type: Boolean,
			'default': false
		},
		showBankerBar: {
			type: Boolean,
			'default': false
		},
		isBanker: {
			type: Boolean,
			'default': false
		},
		showCheckBox: {
			type: Boolean,
			'default': false
		}
	},
	computed: {
		...mapState('betslip', [
			'getBankerCount',
			'getBetCount',
			'eventColorLump',
			'currentType',
			'suspendedKeys',
			'unavailableKeys',
		]),
		disabled() {
			const key = this.slip.key;
			return this.suspendedKeys.includes(key) || this.unavailableKeys.includes(key);
		},
		getIconType() {
			return [
				'm-icon-sport',
				`m-icon--${getSportRoute(this.slip.sportName)}`
			];
		},
		isMetuxItem() {
			let ret = false;
			if (this.currentType !== 'single') {
				const index = this.eventColorLump.indexOf(this.slip.eventId);
				if (index !== -1) {
					ret = true;
				}
			}
			return ret;
		},
		getColorLumpStyle() {
			let ret = '';
			if (this.isMetuxItem) {
				const index = this.eventColorLump.indexOf(this.slip.eventId);
				if (index !== -1) {
					ret = `border-color: ${colorLump[index]};`;
				}
			}
			return ret;
		},
		getAgainst() {
			return `${this.slip.home} v ${this.slip.away}`;
		},
		isLive() {
			const slip = this.slip || {},
				marketInfo = slip.marketInfo || {};

			return !slip.isFinish && marketInfo.product === 1;
		}
	},
	methods: {
		...mapActions('betslip', [
			'deleteBetSlip',
		]),
		...mapMutations('betslip', {
			changeCheckStatus: mutationTypes.UPDATECHECKSTATUS,
			updateBankerList: mutationTypes.UPDATEBANKERS
		}),
		handleDelete() {
			const key = this.slip.key;
			this.deleteBetSlip(key);

			// 通知其他列表，投注项删除
			EventBus.$emit(commonEvent.DELETE_BET_SLIPS_ITEM, key);
		},
		toggleCheckStatus() {
			if (this.disabled) {
				return;
			}

			this.changeCheckStatus({
				checked: !this.checked,
				key: this.slip.key
			});
		},
		toggleBankerStatus() {
			if (this.disabled) {
				return;
			}
			// 最多能选event项
			// if (this.getBankerCount === this.getBetCount) {
			//
			// }

			// 更新store banker列表
			this.updateBankerList(this.slip.key);
		},
	},
	mounted() {
		EventBus.$on(listEvent.LIST_ITEM_DELETE, this.deleteBetSlip);
	}
};
</script>

<style lang="css">
</style>
