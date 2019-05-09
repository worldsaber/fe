<template lang="html">
	<div class="m-nobet-wrap">
		<div class="m-order-none">
			<span class="no-bet-txt"><i class="m-icon--pageques"></i>No bets available.</span>
		</div>
		<adConfig />
	</div>
</template>

<script>
import adConfig from './bottomAd';

export default {
	components: {
		adConfig
	}
};
</script>

<style lang="less">
@import 'base/style/icon.less';
@import 'base/style/variable.less';

.m-order-none{
	margin: 6px auto 39px;
	padding:45px 0;
	text-align: center;
}
.m-nobet-wrap {
	background-color: @white;
	padding-bottom: 45px;
}
.no-bet-txt{
	font-size: 16px;
	color: @darkGray;
	.m-icon--pageques{
		.m-icon-pageques();
		display: inline-block;
		vertical-align: middle;
		margin-right: 10px;
		&::before{
			font-size: 23px;
		}
	}
}
.m-bet-adimg{
	text-align: center;
	margin: 39px auto 31px;
}
</style>
