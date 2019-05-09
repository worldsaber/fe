<template lang="html">
	<div class="m-cup-pop m-cup--expire">
		<i
			class="icon-close"
			data-action="close"
			data-ret="closeBtn"
		></i>
		<div class="m-pop-header">
			<span>Current Prediction Ended</span>
		</div>
		<p class="m-pop-main">Refresh to check the latest Match!</p>
		<div class="m-btn-wrapper" @click="refresh">OK</div>
	</div>
</template>

<script>
export default {
	methods: {
		refresh() {
			window.location.reload();
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable';
@import 'base/styles/icon.less';

.m-cup-pop.m-cup--expire {
	padding-bottom: 28/@rem;
	.icon-close {
		position: absolute;
		right: 4/@rem;
		top: 4/@rem;
		line-height: 16/@rem;
		.m-icon-close();
		&::before {
			font-size: 16/@rem;
		}
	}

	.m-pop-header {
		padding-top: 20/@rem;
		font-size: 18/@rem;
		line-height: 18/@rem;
		font-weight: 600;
		text-align: center;
	}
	.m-pop-main {
		margin-top: 12/@rem;
		margin-bottom: 14/@rem;
		font-size: 12/@rem;
		font-weight: 600;
		line-height: 12/@rem;
		letter-spacing: -0.72/@rem;
	}
	.m-btn-wrapper {
		font-size: 12/@rem;
		height: 36/@rem;
		text-align: center;
		line-height: 36/@rem;
		font-weight: 600;
  		border-radius: 4/@rem;
		color: @white;
  		background-color: #ffc900;
	}
}
</style>
