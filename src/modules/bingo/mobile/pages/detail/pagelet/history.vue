<template>
	<div class="bingo-history">
		<div class="item-wrap round-no">
			<span class="left">Round No. {{data.roundNo}}</span>
			<span class="right">{{data.showPublishedTime}}</span>
		</div>
		<div class="item-wrap phone">
			<span class="left">{{data.winner}}</span>
			<span class="right"> Bought {{data.boughtAmount}} {{data.boughtAmount === 1 ? 'Share' : 'Shares'}}</span>
		</div>
		<div class="item-wrap">
			<div class="left">Winning No. <span>{{data.winnerNumber}}</span></div>
			<span class="right">{{data.showBoughtFee}}</span>
		</div>
	</div>
</template>
<script>
export default {
	props: ['data'],
	data() {
		return {

		};
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';

.bingo-history {
	padding: 20/@rem 14/@rem;
	border-bottom: 1px solid @lightGray;
	background-color: @white;
	
	&:first-child {
		border-top: 1px solid @lightGray;
	}
	.item-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 14/@rem;
		font-size: 12/@rem;
		color: @darkGray;
		
		.left {
			flex: 0 0 auto;
			span {
				color: @green;
			}
		}
		
		.right {
			flex: 1 1 auto;
			text-align: right;
		}
		
		&.round-no {
			margin-bottom: 12/@rem;
			.left {
				color: @dark;
				width: 50%;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
		&.phone {
			.left {
				font-size: 14/@rem;
				line-height: 16/@rem;
				color: @darker;
			}
			.right {
				font-size: 12/@rem;
				line-height: 16/@rem;
				color: @green;
			}
		}
	}
}
</style>
