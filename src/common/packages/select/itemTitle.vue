<template>
  <span class="af-select-item-title">{{data}}</span>
</template>

<script>
	/**
	 * 分组时候的标题
	 */
	export default {
		mounted () {
	
		},
		props: {
			data: {
				type: String,
				required: true
			}
		}
	};
</script>

<style lang="less">
	.af-select-item-title{
		display: block;
		width: 100%;
		text-align: center;
		background: gray;
	}
</style>
