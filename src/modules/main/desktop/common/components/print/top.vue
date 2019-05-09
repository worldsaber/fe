<template>
  <div class="print-logo print-item">
    <img :src="logoPng" alt="sportbet" height="29">
  </div>
</template>
<script>
import logoPng from 'images/sportybet.svg';

export default {
	data () {
		return {
			logoPng
		};
	}
};
</script>
<style lang="less">
	.print-item{
		display: none;
	}
	@media print {
		.print-logo{
			margin:0 auto;
			padding-bottom: 15px;
			border-bottom:2px solid #000;
			display: block;
		}
		
	}
</style>

