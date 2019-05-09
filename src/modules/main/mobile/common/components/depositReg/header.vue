<template>
	<div class="deposit-reg-header">
		<a :href="url" class="deposit-reg-home"></a>
	</div>
</template>
<script>
import { pagePath } from 'config/pageConfig';

export default {
	data() {
		return {
			url: pagePath.home
		};
	}
};
</script>

<style lang="less">
@import 'base/styles/icon.less';
@import 'base/styles/variable.less';

.deposit-reg-header{
	padding-left: 10/@rem;
	background-color: #e41827;
	text-align: left;
	.deposit-reg-home{
		display: block;
		height: 40/@rem;
		width: 100/@rem;
		line-height: 40/@rem;
		.m-icon-sportbet();
		color: #FFF;
	}
}
</style>

