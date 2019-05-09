<template>
	<div class="bingo-participant">
			<div class="item-wrap">
				<span class="left phone">{{data.userName}}</span>
				<span class="right num">Bought {{data.boughtAmount}} {{data.boughtAmount === 1 ? 'Share' : 'Shares'}}</span>
			</div>
			<div class="item-wrap bottom">
				<span class="left">{{data.showTime}}</span>
				<span class="right">{{currency}} {{data.showBoughtFee}}</span>
			</div>
	</div>
</template>
<script>
export default {
	props: ['data'],
	data() {
		return {
			currency: window.currency || 'KES'
		};
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
.bingo-participant {
	border-bottom: 1px solid @lightGray;
	padding: 20/@rem 16/@rem;
	
	&:first-of-type {
		border-top: 1px solid @lightGray;
	}
	.item-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12/@rem;
		color: @darkGray;
		.left {
			flex: 1 1 auto;
			&.phone {
				font-size: 14/@rem;
				line-height: 16/@rem;
				color: @darker;
			}
		}
		.right {
			flex: 0 0 auto;
			&.num {
				font-size: 12/@rem;
				line-height: 16/@rem;
				color: @green;
			}
		}
		&.bottom {
			margin-top: 4/@rem;
		}
	}
}

</style>
