<template>
  <div @click.stop="handleClick"  :class="cls">
	  <slot></slot>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { sportsConfigById } from 'config/sports';

// active 用css实现
export default {
	name: 'AFOutcome',
	props: {
		// outcome不存在则表示不是一个可投注的 outcome
		outcome: {
			default () {
				return {};
			},
			type: Object
		},
		sportId: {
			required: true,
			type: String
		},
		market: {
			type: Object,
			default () {
				return {};
			}
		},
		event: {
			type: Object
		},
		disabled: {
			type: Boolean,
			'default': false
		}
	},
	data () {
		return {
			// -1 表示下降 0表示不变， 1表示上升
			oddsChange: 0
		};
	},
	created () {
		this.$watch('outcome.id', (newVal, old) => {
			this.$nextTick(() => {
				this.oddsChange = 0;
			});
		});
		this.$watch('market.specifier', (newVal, old) => {
			this.$nextTick(() => {
				this.oddsChange = 0;
			});
		});
		this.$watch('outcome.odds', (newVal, old) => {
			newVal = +newVal;
			old = +old;
			if (newVal > 0 && old > 0) {
				if (newVal > old) {
					this.oddsChange = 1;
				} else if (old > newVal) {
					this.oddsChange = -1;
				} else {
					// this.oddsChange = 0;
				}
			}
		});
	},
	computed: {
		...mapGetters('betslip', ['betslipsMap']),
		cls () {
			return {
				'm-outcome': true,
				'm-event-outcome-default': true,
				'm-outcome--checked': this.checked,
				'm-outcome--disabled': this.dis,
				// 赔率上升
				'm-outcome--up': this.oddsChange === 1,
				// 赔率下降
				'm-outcome--down': this.oddsChange === -1,
			};
		},
		// 如果marketStatus 0: active, 1: suspened, 2: deactivated, 3: setted
		marketStatus () {
			return this.market.status;
		},
		marketId () {
			return this.market.id + (this.market.specifier ? '?' + this.market.specifier : '');
		},
		betKey () {
			return `${this.sportId}_${this.event.eventId}_${this.marketId}_${this.outcome.id}`;
		},
		checked () {
			return this.betslipsMap[this.betKey] >= 0;
		},
		dis () {
			if (!this.outcome.id) {
				return true;
			}
			return this.disabled && !(this.outcome.isActive === 1 && this.marketStatus === 0);
		},
	},
	methods: {
		...mapActions('betslip', ['addBetSlip', 'deleteBetSlip']),
		handleClick (e) {
			if (!this.dis) {
				this.toggleOutcome();
				this.$emit('click', this.checked);
			}
			e.preventDefault();
		},
		// 根据outcomeId选择
		toggleOutcome () {
			if (!this.dis && this.outcome.id) {
				if (!this.checked) {
					// 获取当前sport的一些本地配置，如icon, text文本等
					const sport = sportsConfigById[this.sportId];

					this.addBetSlip({
						key: this.betKey,
						betInfo: {
							home: this.event.homeTeamName,
							away: this.event.awayTeamName,
							gameId: this.event.gameId || '',
							eventId: this.event.eventId,
							sportId: this.sportId,
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
								desc: this.market.desc,
								specifier: this.market.specifier || '',
								product: this.market.product,
								group: this.market.group,
								status: this.market.status,
								pushtime: this.market.pushtime || ''
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

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

// 注意这里用 m-event-outcome-default 作默认样式， m-outcome 可用于外部覆盖
.m-event-outcome-default{
	background-color: @green;
	color:@white;
	font-size: 14/@rem;
	font-weight: bold;
	text-align: center;
	height: 34/@rem;
	line-height: 34/@rem;
	flex:1;
	display: block;
	min-width: 1%;
	text-align: center;
	margin-right: 1px;
	overflow: hidden;
	position: relative;
	&:last-child{
		margin-right: 0px;
	}
	&.m-outcome--up{
		.m-icon-up2();
	}
	&.m-outcome--down{
		.m-icon-down2();
	}
	&.m-outcome--up,&.m-outcome--down{
		&:before{
			color: @white;
			display: block;
			position: absolute;
			top: 2px;
			right: 2px;
			line-height: 1;
			font-size: 12px;
			transform: scale(0.83);
		}
	}
	&.m-outcome--checked {
		background: @lightGreen;
		color: @black;
		&:before{
			color: @dark;
		}
	}
	&:active{
		background: @lightGreen;
		color: @black;
	}
	&.m-outcome--disabled{
		background: @whiteGray;
		color: @darkGray;
		&:before{
			font-size: 0;
		}
		.m-icon-lock{
			.m-icon-locked();
			&:before{
				font-size: 16/@rem;
			}
			vertical-align: middle;
		}
	}
}
</style>

