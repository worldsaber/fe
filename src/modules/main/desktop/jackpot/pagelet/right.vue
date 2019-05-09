<template>
  <section>
	  <div class="helloImg">
			<AdBar />
	  </div>
  </section>
</template>
<script>
import AdBar from 'components/adBar';

export default {
	name: 'right',
	components: {
		AdBar
	}
};
</script>
<style lang="less">
@import '~base/style/variable.less';
.helloImg{
	height: 208px;
	width: 236px;
	.m-ad-wrapper{
		background: @blueBlack;
		color: @darkGray;
	}
}
</style>
