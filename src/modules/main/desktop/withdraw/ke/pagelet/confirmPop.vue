<template>
	<div>
		<ul class="m-withdraw-cfm">
			<li>
				<i>Withdrawal Amount  ({{showCurrencyOrigin}})</i>
				<em>{{contentData.amount}}</em>
			</li>
			<li>
				<i>Additional Fee</i>
				<em>{{contentData.additionalFee}}</em>
			</li>
			<li>
				<i>Remaining Amount</i>
				<em>{{contentData.remainAmount}}</em>
			</li>
		</ul>
		<div class="m-btnBar">
			<span class="m-btn-wrapper" v-for='(btn, index) in buttonList' :key="index">
				<AfButton v-if="index == 0"
					:extraType="btn.type"
					@click.prevent="btnClick(index)"
					>{{btn.text}}</AfButton>
				<AfButton v-else
					:extraType="btn.type"
					:loading="loading"
					@click.prevent="btnClick(index)"
					><template v-if='!loading'>{{btn.text}}</template><template v-else>Loading...</template></AfButton>
			</span>
		</div>
	</div>
</template>

<script>
import { EventBus } from 'kernel/js/eventBus.js';
import AfButton from 'packages/button/button.vue';
import { showCurrencyOrigin } from 'config/currencyConfig';
import { showFee } from '../js/config';

export default {
	name: 'msg',
	components: {
		AfButton
	},
	data () {
		return {
			loading: false,
			lock: false,  // 锁，如果点击cofirm按钮，则如果没有返回之前关闭和取消都不可点击
			buttonList: [
				{
					type: 'text',
					text: 'Cancel'
				},
				{
					type: 'primary',
					text: 'Confirm'
				}
			],
			showCurrencyOrigin,
			showFee
		};
	},
	mounted() {
		EventBus.$on('loadingChange', status => {
			this.loading = status; // 修改loading状态
			if (!status) {
				this.lock = false; // 解锁
			}
		});
	},
	methods: {
		btnClick (index) {
			if (!this.lock) {
				this.lock = true;
				this.contentData.callback(index);
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import 'base/style/mixin.less';
@import 'base/style/variable.less';

.m-withdraw-cfm{
	line-height: 44px;
	li{
		width: 100%;
		.clearfix();
		i{
			float:left;
			font-size:20px;
		}
		em{
			font-size: 22px;
			float: right;
		}
	}
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
	margin-top:20px;
	text-align: right;
}
</style>
