<template>
	<div class="m-unsettled-item">
		<div class="m-outcome-desc-wrapper">
			<div :class="[selection.icon, 'm-outcome-desc']">{{selection.outcomeDesc}}</div>
			<div class="m-outcome-odds">{{selection.odds}}</div>
		</div>

		<div class="m-vs-wrapper">
			<div v-if="selection.gameId">{{selection.gameId}}</div>
			<div>{{selection.home}} vs {{selection.away}}</div>
		</div>

		<div class="m-market-desc">{{selection.marketDesc}}</div>
	</div>
</template>

<script>
export default {
	name: 'UnsettledItem',
	props: {
		selection: {
			type: Object,
			required: true
		},
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';

.m-unsettled-item {
	overflow: hidden;
	flex: 1 0 0%;
	position: relative;
	padding: 16/@rem 12/@rem;
	color: @dark;

	.m-outcome-desc-wrapper,
	.m-vs-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
	}
	.m-outcome-desc-wrapper{
		font-size: 16/@rem;
		line-height: 1.05;
		font-weight: bold;

		.m-outcome-desc{
			flex: 1 1 0%;
			padding-right: 10/@rem;
			&:before{
				padding-right: 5/@rem;
				display: inline-block;
			}
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	.m-vs-wrapper{
		margin: 8/@rem 0 6/@rem;
		font-size: 14/@rem;
		line-height: 1.2;

		&>div{
			&:nth-of-type(1){
				flex: 0 0 auto;
				padding-right: 10/@rem;
			}
			&:last-child{
				flex: 1;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}

	.m-market-desc {
		font-size: 14/@rem;
		line-height: 1.2;
	}
}
</style>
