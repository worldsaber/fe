<template>
	<div class="m-roulette-select-round">
		<div class="select-round-header">Rounds to Play</div>
		<div class="close-wrap" @click="close"><i class="icon-close"/></div>
		<template v-if="list.length > 0">
		<div class="line-1">
			<div class="plan-item">
				<div class="item-header">
					<div class="rounds-wrap">
						<div class="rounds-label">{{list[0].count}}</div>
						<div class="rounds-text">Rounds</div>
					</div>
					<template v-if="list[0].percent !== 0">
						<img v-if="list[0].percent < 3" class="icon-reward" src="../images/litte-reward.png"/>
						<img v-if="list[0].percent >= 3" class="icon-reward" src="../images/huge-reward.png"/>
					</template>
				</div>
				<p class="item-desc" v-if="list[0].percent !== 0">{{list[0].percent}}% of your<br>stake returned</p>
				<button class="play-now" @click="play(list[0])">Play Now</button>
			</div>
			<div class="plan-item">
				<div class="item-header">
					<div class="rounds-wrap">
						<div class="rounds-label">{{list[1].count}}</div>
						<div class="rounds-text">Rounds</div>
					</div>
					<template v-if="list[1].percent !== 0">
						<img v-if="list[1].percent < 3" class="icon-reward" src="../images/litte-reward.png"/>
						<img v-if="list[1].percent >= 3" class="icon-reward" src="../images/huge-reward.png"/>
					</template>
				</div>
				<p class="item-desc" v-if="list[1].percent !== 0">{{list[1].percent}}% of your<br>stake returned</p>
				<button class="play-now" @click="play(list[1])">Play Now</button>
			</div>
		</div>
		<div class="line-2">
			<div class="plan-item">
				<div class="item-header">
					<div class="rounds-wrap">
						<div class="rounds-label">{{list[2].count}}</div>
						<div class="rounds-text">Rounds</div>
					</div>
					<template v-if="list[2].percent !== 0">
						<img v-if="list[2].percent < 3" class="icon-reward" src="../images/litte-reward.png"/>
						<img v-if="list[2].percent >= 3" class="icon-reward" src="../images/huge-reward.png"/>
					</template>
				</div>
				<p class="item-desc" v-if="list[2].percent !== 0">{{list[2].percent}}% of your<br>stake returned</p>
				<button class="play-now" @click="play(list[2])">Play Now</button>
			</div>
			<div class="plan-item">
				<div class="item-header">
					<div class="rounds-wrap">
						<div class="rounds-label">{{list[3].count}}</div>
						<div class="rounds-text">Rounds</div>
					</div>
					<template v-if="list[3].percent !== 0">
						<img v-if="list[3].percent < 3" class="icon-reward" src="../images/litte-reward.png"/>
						<img v-if="list[3].percent >= 3" class="icon-reward" src="../images/huge-reward.png"/>
					</template>
				</div>
				<p class="item-desc" v-if="list[3].percent !== 0">{{list[3].percent}}% of your<br>stake returned</p>
				<button class="play-now" @click="play(list[3])">Play Now</button>
			</div>
		</div>
		</template>
		<p class="note-wrap">Note: If you drop out, these rewards will not apply.</p>
	</div>
</template>

<script>
export default {
	data() {
		return {
			list: []
		};
	},
	created() {
		this.list = this.contentData.plans;
		// this.getConfig();
	},
	methods: {
		play(plan) {
			this.close();
			this.$emit('autoplay', {
				count: plan.count,
				percent: plan.percent
			});
		},
		close() {
			this.$dialog();
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

.m-roulette-select-round {
	position: relative;
	padding: 8/@rem;
	background-image: url('../images/plan-bgd.png');
	background-repeat: no-repeat;
	background-size: 100% 100%;
	.select-round-header {
		padding: 13/@rem 0;
		font-size: 22/@rem;
		line-height: 24/@rem;
		text-align: center;
		font-weight: 600;
		color: @white;
		border-bottom: 2px solid #6D44C1;
	}
	.close-wrap {
		position: absolute;
		right: 4/@rem;
		top: 4/@rem;
		width: 20/@rem;
		height: 20/@rem;
		line-height: 20/@rem;
		text-align: center;
		border-radius: 50%;
		border: 1px solid #A186D5;
		.icon-close {
			.m-icon-close();
			&::before {
				color: @white;
				font-size: 12/@rem;
			}
		}
	}
	.line-1 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 10/@rem;
		margin-bottom: 10/@rem;
	}
	.line-2 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10/@rem;
	}
	.plan-item {
		padding: 8/@rem;
		box-sizing: border-box;
		flex: 0 0 48%;
		border: 2px solid @white;
		color: @white;
		text-align: center;
		.item-header {
			display: flex;
			align-items: center;
			justify-content: center;
			.rounds-wrap {
				flex: 1 1 auto;
				text-align: center;
				margin-bottom: 10/@rem;
				.rounds-label {
					line-height: 28/@rem;
					font-size: 28/@rem;
					color: @white;
				}
				.rounds-text {
					white-space: nowrap;
					line-height: 12/@rem;
					font-size: 12/@rem;
					font-weight: 600;
				}
			}
			.icon-reward {
				flex: 1 1 auto;
			}
		}
		.item-desc {
			margin-bottom: 10/@rem;
			text-align: center;
			font-size: 14/@rem;
			line-height: 14/@rem;
		}
		.play-now {
			padding: 0 12/@rem;
			border: none;
			color: @white;
			background: linear-gradient(to bottom, #E8AEE9, #BE51DB, #E8AEE9);
			border-radius: 6/@rem;
			line-height: 25/@rem;
			font-size: 16/@rem;
		}
	}
	.note-wrap {
		padding: 14/@rem 0;
		border-top: 2px solid #6D44C1;
		color: @white;
		font-size: 12/@rem;
		line-height: 12/@rem;
	}
}
</style>
