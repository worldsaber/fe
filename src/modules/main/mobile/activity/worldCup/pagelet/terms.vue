<template>
	<div class="terms-wrap">
		<div class="predict-logo">Sporty Predict & Win</div>
		<Rulers />
	</div>
</template>
<script>
import Rulers from './rulers.vue';

export default {
	components: {
		Rulers
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.terms-wrap{
	.predict-logo{
		border-radius: 14.5px;
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5), inset 2px 1px 5px 0 rgba(0, 0, 0, 0.34);
		background-image: linear-gradient(to bottom, #4d00b5, #ff00fb);
		font-size: 12px;
		padding: 5/@rem 15/@rem;
		width: 150/@rem;
		margin: 0 auto;
		color: #FFF;
		text-align: center;
	}
}
</style>

