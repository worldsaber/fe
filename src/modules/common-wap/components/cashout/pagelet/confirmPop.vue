<template>
	<div class="m-comfirm-wrapper">
		<div
			class="m-text-wrapper m-text-wrapper-fix"
			v-if="contentData.isSupportPartial">
			<p>
				<div class="m-label"> Partial Cashout Amount</div>
				<div class="m-value">{{contentData.showCashoutVal}}</div>
			</p>
			<p>
				<div class="m-label">Remain Stake Amount:</div>
				<div 
					:class="[
						'm-value',
						{
						'm-value-highlight': contentData.highlight
						}
					]"
				><span>{{contentData.remainStakeShowVal}}</span></div>
			</p>
		</div>

		<div
			class="m-text-wrapper"
			v-else>
			<p>
				<div class="m-label">Latest Cashout Amount:</div>
				<div
					:class="[
						'm-value',
						{
						'm-value-highlight': contentData.highlight
						}
					]"
				><span>{{contentData.showCashoutVal}}</span></div>
			</p>
		</div>
	</div>

</template>
<script>
export default {
	created () {
		this.$watch('contentData.highlight', val => {
			if (val) {
				window.setTimeout(() => this.contentData.highlight = false, 500);
			}
		});
	}
};
</script>


<style lang="less">
@import 'base/styles/variable.less';
.m-comfirm-wrapper{
	font-size: 14/@rem;
	padding: 18/@rem 0;
	.m-value-highlight{
		span{
			display: inline-block;
			padding: 0 3/@rem;
			background-color: @cyan;
		}
	}
}
</style>
