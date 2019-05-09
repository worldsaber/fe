<template>
	<div class="m-vote">
		<div class="m-vote-title">{{hasVoted ? 'Voting Result' : 'Vote for Your Choice'}}</div>
		<div class="m-vote-options-group">
			<template v-for="(item, index) in voteOptions">
				<div class="m-vote-option" :key="index">
					<div class="m-bar-wrap">
						<div :class="['m-bar', `m-bar-${item.label}`, {
							'is-zero': item.percent === 0
						}]">
							<div class="m-bar--inner-wrap">
								<div class="m-bar--inner" :style="{
									height: `${item.percent}%`
								}" @click="handleVote(item.selectType)">
									<div class="m-percent-num">{{item.percent}}%</div>
								</div>
							</div>
							<div class="m-bar--base" @click="handleVote(item.selectType)"></div>
						</div>
					</div>
					<div :class="['m-vote-btn', {
						voted: item.selectType === selectedType,
						disabled: hasVoted && item.selectType !== selectedType
					}]" @click="handleVote(item.selectType)">
						<i class="m-icon-vote"></i>
						<span class="m-text">{{item.selectType === selectedType ? 'Voted' : 'Vote' }}</span>
					</div>
					<div class="m-label">{{item.label}}</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import loginMixin from 'base/js/loginMixin';
import { mapState, mapActions } from 'vuex';

export default {
	name: 'Vote',
	mixins: [loginMixin],
	props: {
		topicId: {
			type: [Number, String],
			'default': ''
		}
	},
	computed: {
		...mapState('comment', ['voteStats', 'selectedType']),
		...mapState('eventDetail', [
			'currentSportId'
		]),
		hasVoted() {
			return !!this.selectedType;
		},
		voteOptions() {
			// Football和Rugby是胜平负，其他的都是胜负
			const { total, winSupp, drawSupp, loseSupp } = this.voteStats;

			const getPercent = (num, total) => parseInt(num / total * 100, 10);

			const win = total > 0 ? getPercent(winSupp, total) : 0;
			const draw = total > 0 ? getPercent(drawSupp, total) : 0;
			const lose = total > 0 ? getPercent(loseSupp, total) : 0;

			if (['sr:sport:1', 'sr:sport:12'].includes(this.currentSportId)) {
				return [{
					label: 'Home',
					selectType: '3',
					percent: win
				}, {
					label: 'Draw',
					selectType: '1',
					percent: draw
				}, {
					label: 'Away',
					selectType: '0',
					percent: lose
				}];
			}

			return [{
				label: 'Home',
				selectType: '3',
				percent: win
			}, {
				label: 'Away',
				selectType: '0',
				percent: lose
			}];
		}
	},
	methods: {
		...mapActions('comment', ['vote']),
		async handleVote(selectType) {
			// 校验及登录
			if (!this.checkLogin()) return false;
			// 已投票
			if (this.hasVoted) {
				return this.$toast('You have already voted');
			}

			try {
				await this.vote({
					postId: this.topicId,
					selectType
				});
				this.$toast('Voted Successfully');
			} catch (err) {
				this.$toast(err.message || 'Voted failed, please try again');
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';


.red() {
	background: #e41827;
}

.brown() {
	background: #cf7a25;
}

.m-vote {
	padding: 2/@rem 20/@rem 11/@rem;
	border-bottom: 6/@rem solid @fogGray;
}

.m-vote-title {
	text-align: center;
	font-size: 12/@rem;
	line-height: 14/@rem;
	color: @darker;
}

.m-vote-options-group {
	display: flex;
	align-items: stretch;
	justify-content: center;
	width: 100%;
	overflow: hidden;
}

.m-vote-option {
	flex: auto;
	width: 100/@rem;
	text-align: center;
	color: @darker;
	margin-right: 11/@rem;

	&:last-child {
		margin-right: 0;
	}

	@barMaxHeight: 64/@rem;
	@barMinHeight: 14/@rem;

	.m-bar-wrap {
		margin-top: 7/@rem;
		width: 100%;
		height: @barMaxHeight;
		position: relative;

		.m-bar {
			position: absolute;
			bottom: 0;
			width: 100%;

			&.is-zero {
				.m-bar--base {
					border-radius: 2/@rem;
				}
				.m-bar--inner-wrap {
					.m-bar--inner {
						.m-percent-num {
							top: 0;
						}
					}
				}
			}

			&.m-bar-Away {
				.m-bar--inner-wrap .m-bar--inner,
				.m-bar--base {
					.red();
				}
			}

			&.m-bar-Draw {
				.m-bar--inner-wrap .m-bar--inner,
				.m-bar--base {
					.brown();
				}
			}

			&--base {
				height: @barMinHeight;
				background: #32ce62;
				border-radius: 0 0 2/@rem 2/@rem;
			}

			&--inner-wrap {
				height: @barMaxHeight - @barMinHeight;
				position: relative;

				.m-bar--inner {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					border-radius: 2/@rem 2/@rem 0 0;
					background: #32ce62;

					&.red {
						.red();
					}

					&.brown {
						.brown();
					}

					.m-percent-num {
						position: absolute;
						top: 2/@rem;
						left: 0;
						width: 100%;
						color: @white;
						font-size: 12/@rem;
						text-align: center;
						font-weight: bold;
						line-height: 14/@rem;
					}
				}

			}
		}
	}

	.m-vote-btn {
		flex: auto;
		width: 100%;
		box-sizing: border-box;
		height: 28/@rem;
		line-height: 28/@rem;
		border: 1px solid @darkGray;
		border-radius: 1/@rem;
		font-size: 10/@rem;
		margin: 3/@rem 0;

		&.voted {
			.m-icon-vote {
				.m-icon-voted();

				&:before {
					font-size: 16/@rem;
				}
			}
		}

		&.disabled {
			background: @lightGray;
			color: @darkGray;
		}


		.m-icon-vote {
			.m-icon-vote-up();
			&:before {
				font-size: 16/@rem;
			}
		}

		.m-text {
			vertical-align: top;
		}
	}

	.m-label {
		margin-top: 3/@rem;
		font-size: 12/@rem;
		line-height: 14/@rem;
	}
}
</style>
