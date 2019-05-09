<template>
  <AfTableCell @click="handleClick"  :class="cls">
	  <slot></slot>
  </AfTableCell>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { AfTableCell } from 'packages/tableLayout';
import { sportsConfigById } from 'config/sports';

// active 用css实现
export default {
	components: {
		AfTableCell
	},
	name: 'AFOutcome',
	props: {
		outcomeId: {
			'default': ''
		},
		market: {
			default () {
				return {};
			}
		},
	},
	computed: {
		// 带speciefier id
		marketId () {
			if (this.market) {
				return this.market.id + (this.market.specifier ? '?' + this.market.specifier : '');
			}
		},
		outcome () {
			if (this.outcomeId) {
				return this.market.outcomes[this.outcomeId];
			}
		},
		cls () {
			return {
				'm-outcome': true,
				'm-detail-outcome-default': true,
				'm-outcome--checked': this.checked,
				'm-outcome--disabled': this.dis
			};
		},
		checked () {
			return this.betslipsMap[this.betKey] >= 0;
		},
		dis () {
			if (!this.outcome.id) {
				return true;
			}
			return !(this.outcome.isActive === 1 && this.market.status === 0);
		},
		betKey () {
			return `${this.currentSportId}_${this.currentEventId}_${this.marketId}_${this.outcome.id}`;
		},
		...mapState('eventDetail', ['currentEventId', 'currentSportId', 'event']),
		...mapGetters('eventDetail', ['marketOrder']),
		...mapGetters('betslip', ['betslipsMap'])
	},
	methods: {
		...mapActions('betslip', ['addBetSlip', 'deleteBetSlip']),
		handleClick () {
			if (!this.disabled) {
				this.toggleOutcome();
				this.$emit('click', this.checked);
			}
		},
		// 根据outcomeId选择
		toggleOutcome () {
			if (!this.dis && this.outcome.id) {
				if (!this.checked) {
					const market = this.market;
					// 获取当前sport的一些本地配置，如icon, text文本等
					const sport = sportsConfigById[this.currentSportId];

					this.addBetSlip({
						key: this.betKey,
						betInfo: {
							home: this.event.homeTeamName,
							away: this.event.awayTeamName,
							gameId: this.event.gameId || '',
							eventId: this.currentEventId,
							sportId: this.currentSportId,
							sportName: sport.name,
							icon: sport.icon,
							categoryId: this.event.categoryId,
							tournamentId: this.event.tournamentId,
							outcomeInfo: {
								...this.outcome
							},
							marketInfo: {
								id: this.marketId,
								marketId: this.market.id,
								desc: market.desc,
								specifier: market.specifier || '',
								product: market.product,
								group: market.group,
								status: market.status,
								pushtime: market.pushtime || ''
							}
						}
					});
				} else {
					this.deleteBetSlip(this.betKey);
				}
			}
		}
	}
};
</script>
