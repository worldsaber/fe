<template lang="html">
  <div>
		<p class="m-minfo" style="margin: 24px 0 50px;">
			{{contentData.msg}}
		</p>
		<div class="m-btnBar">
			<span class="m-btn-wrapper" v-for='(btn,index) in contentData.buttonList'>
				<AfButton
					:extraType="btn.type"
					@click.prevent="contentData.btnClick(index)"
					>{{btn.text}}</AfButton>
				</span>
		</div>
	</div>
</template>

<script>
import AfButton from 'packages/button/button.vue';

export default {
	name: 'msg',
	components: {
		AfButton
	}
};
</script>

<style lang="less" scoped>
@import 'base/style/variable.less';

.m-minfo{
	font-size:20px;
	line-height: 33px;
}

.m-minfo-h3{
	font-size:22px;
	margin: 0 0 20px;
}

.m-btn-wrapper{
	width:160px;
	height:38px;
	margin-left:16px;
	display: inline-block;
	.af-button--primary{
		font-size:16px;
	}
}
.greenTxtBtn{
	color:@green;
	font-size:16px;
	line-height: 38px;
}
.m-btnBar{
	text-align: right;
}
</style>
