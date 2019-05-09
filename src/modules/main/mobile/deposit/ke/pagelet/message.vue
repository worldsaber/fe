<template lang="html">
  <div>
		<h3 class="m-minfo-h3" v-if="contentData.msgTitle != ''">{{contentData.msgTitle}}</h3>
		<p class="m-minfo">
			{{contentData.msg}}
		</p>
	</div>
</template>

<style lang="less">
@import 'base/styles/variable.less';
@import '../style/dialog.less';

.m-minfo{
	font-size:16/@rem;
	line-height: 1.5;
	padding-top:14/@rem;
	word-break:break-word;
}
.m-minfo-h3{
	font-size:20/@rem;
	font-weight: bold;
	margin:0 -5% 0 0;
	.m-mpesa-long-tit  &{
		font-size:18/@rem;
	}
}
</style>
