<template lang="html">
	<div>
		<ul class="m-withdraw-cfm">
			<li>
				<i>Withdrawal Amount  ({{showCurrencyOrigin}})</i>
				<em>{{contentData.amount}}</em>
			</li>
			<li>
				<i>Additional Fee</i>
				<em>{{contentData.additionalFee}}</em>
			</li>
			<li>
				<i>Remaining Amount</i>
				<em>{{contentData.remainAmount}}</em>
			</li>
		</ul>
	</div>
</template>
<script>
import { showCurrencyOrigin } from 'config/currencyConfig';
import { showFee } from '../js/config';

export default {
	data() {
		return {
			showFee,
			showCurrencyOrigin
		};
	}
};

</script>
<style lang="less" scoped>
@import 'base/styles/mixin.less';
@import 'base/styles/variable.less';

.m-withdraw-cfm{
	line-height: 37/@rem;
	padding-bottom: 10/@rem;
	li{
		width: 100%;
		.clearfix();
		i{
			float:left;
			font-size:14/@rem;
		}
		&:first-child{
			em{
				font-size: 22/@rem;
				font-weight: bold;
			}
		}
		em{
			font-size:16/@rem;
			float: right;
		}
	}
}
</style>
