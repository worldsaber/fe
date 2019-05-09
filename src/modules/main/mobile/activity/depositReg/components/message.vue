<template lang="html">
  <div>
		<h3 class="m-minfo-h3" v-if="contentData.msgTitle != ''">{{contentData.msgTitle}}</h3>
		<p class="m-minfo">
			{{contentData.msg}}
		</p>
	</div>
</template>
<script>
export default {

};
</script>

<style lang="less">
@import 'base/styles/variable.less';

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

.m-fm-dialog{
	padding-top:0;
	border-radius: 2/@rem;
	box-shadow: 0 0 24/@rem 0 rgba(0,0,0,.22), 0 24/@rem 24/@rem 0 rgba(0,0,0,.3);
	.es-dialog-head{
		height: 20/@rem;
	}

	.es-dialog-body{
		background: @white;
		.m-dialog-main{
			padding:0 8%;
			background: @white;
		}
	}

	.es-dialog-footer{
		background: @white;
		text-align: right;
		display: block;
		box-sizing:border-box;
		padding:8/@rem 2.85%;
		.es-dialog-btn{
			display: inline-block;
			min-width:74/@rem;
			padding:0 10/@rem;
			width:auto;
			box-sizing: border-box;
			height:36/@rem;
			line-height: 36/@rem;
			font-size: 14/@rem;
			border:none;
			background: @white;
			font-weight: bold;
			color:@green;
			&:not(:last-child){
				font-weight: normal;
				color:@darkGray;
				margin-right: 5/@rem;
			}
		}
	} 

}
</style>
