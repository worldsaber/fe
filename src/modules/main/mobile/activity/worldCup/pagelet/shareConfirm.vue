<template lang="html">
	<div class="m-cup-pop m-cup-confirm">
		<i
			class="icon-close"
			data-action="close"
			data-ret="closeBtn"
		></i>
		<div class="m-pop-header">
			<span class="m-t-big">Your Prediction</span>
		</div>
		<div class="m-pop-main">
			<div class="m-t-small">Current Match</div>
			<div class="m-team-name">{{contentData.homeTeamName}} - {{contentData.awayTeamName}}</div>
			<div class="m-t-small">Predicted Score</div>
			<div class="m-team-score"> {{contentData.sharedScore}}</div>
		</div>
		<div class="m-btn-wrapper">

			<a href="javascript: void(0)" data-action="btn" data-ret="okBtn">
				<!-- <i class="m-icon-fb"></i> -->
				Share to WIN NOW!
			</a>
		</div>

		<!-- <div class="m-pop-aid">
			<div class="guess-button view-now" @click="goHistory">My Previous Predictions</div>
		</div> -->
	</div>
</template>

<script>
export default {
	computed: {
		promtUrl() {
			return this.contentData.promotions;
		},
		bonusUrl() {
			return this.contentData.bonus;
		}
	},
	methods: {
		goHistory() {
			window.v_router.push({
				name: 'history',
				query: {
					phone: this.contentData.phone
				}
			});
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable';
@import 'base/styles/icon.less';
.m-cup-pop.m-cup-confirm {
	padding: 10/@rem 0 20/@rem 0;

	.icon-close {
		position: absolute;
		top: 10/@rem;
		right: 10/@rem;
		line-height: 16/@rem;
		.m-icon-close();
		&::before {
			font-size: 16/@rem;
		}
	}
	.m-pop-header {
		margin-bottom: 10/@rem;
		font-weight: 600;
		text-align: center;
	}
	.m-t-small {
		font-size: 14/@rem;
		font-weight: 600;
		text-align: center;
		color: #9ca0ab;
	}
	.m-t-big {
		font-size: 28/@rem;
		margin-bottom: 12/@rem;
		font-weight: 600;
		text-align: center;
		color: #010101;
	}
	.m-team-name{
		font-size: 18/@rem;
		margin: 5/@rem 0;
		text-align: center;
	}
	.m-team-score{
		color: #010101;
		font-weight: bold;
		font-size: 20/@rem;
		text-align: center;
	}
	.m-t-gray {
		color: fadeout(@dark, 50%);
	}
	.m-btn-wrapper {
		margin-top: 10/@rem;
		text-align: center;
		a {
			display: block;
			width: 180/@rem;
			height: 48/@rem;
			margin: 20/@rem auto 0;
			padding: 0 15/@rem;
			line-height: 48/@rem;
			border-radius: 24/@rem;
			background: #2036a7;
			color: @white;

			&:active,
			&:hover {
				color: @white;
			}
		}
		.m-icon-fb {
			display: inline-block;
			vertical-align: middle;

			width: 21/@rem;
			height: 21/@rem;
			border-radius: 4/@rem;
			background: @white;
			margin-right: 15/@rem;
			cursor: pointer;

			.m-icon-facebook();

			&:before {
				font-size: 20/@rem;
				color: #2036a7;
				line-height: 1;
				display: inline-block;
				vertical-align: top;
				margin-top: 3/@rem;
				margin-left: 2/@rem;
			}
		}
	}

	.m-pop-aid {
		margin-top: 16/@rem;
		font-size: 12/@rem;
		line-height: 12/@rem;
		text-align: center;
		color: @linkBlue;
	}
}
.m-dialog--confirm{
	&.es-dialog {
		.es-dialog-body {
			.es-dialog-main{
				padding: 0 0;
			}
		}
	}
}

</style>
