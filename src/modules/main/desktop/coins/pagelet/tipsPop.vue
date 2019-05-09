<template lang="html">
  <div class="m-coins-tips">
	  <div class="m-pop-header">
		  <span class="f-alg-side-item">{{contentData.title}}</span>
		  <i
			  class="m-icon-close"
			  data-action="close"
			  data-ret="close"
		  ></i>
	  </div>
	  <div class="m-pop-main">
		  <ul class="m-l-top">
		  	<li v-for="(item, index) in contentData.infos">{{item}}</li>
		  </ul>
		  <ul class="m-l-mid f-count">
		  	<li v-for="(item, index) in contentData.rules" class="f-count-item">{{item}}</li>
		  </ul>
		  <div class="m-btn-wrapper">
			  <button
      			type="button"
      			class="m-btn"
      			data-action="close"
      			data-ret="close">OK</button>
		  </div>
	  </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="less">
@import '../style/popTips.less';
</style>
