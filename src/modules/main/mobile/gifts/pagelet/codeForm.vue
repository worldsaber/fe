<template>
	<form class="m-gift-code-wrap">
    	<AfInput
        placeholder="Enter your gift code"
        v-model="code"
        icon="delete"
        :maxlength="35"
        :error="isError"
        :iconClick="clearAllInput"
        @change="validatorCode">
		</AfInput>
		<AfButton
		extraType="primary"
		:disabled="submitStatus"
		:loading="loading"
		@click.prevent="submitHandler">
		<template v-if="loading"></template><template v-else>Redeem</template>
		</AfButton>
		<p class="m-code-err">{{errorInfo}}</p>
  	</form>
</template>

<script>
import AfButton from 'packages/button/button.vue';
import { AfInput } from 'packages/input';
import popMsg from '../../deposit/ke/js/popMsg';

import '../../mockData/gifts/index?debug';

export default {
	mixins: [popMsg],
	components: {
		AfButton,
		AfInput
	},
	computed: {
		submitStatus () {
			return !this.code || this.errorInfo !== '';
		},
		isError () {
			return this.errorInfo !== '';
		}
	},
	data () {
		return {
			code: '',
			errorInfo: '',
			loading: false
		};
	},
	methods: {
		validatorCode (data) {
			this.code = data.value.replace(/\s/g, '');
			if (this.code) {
				this.errorInfo = '';
			}
		},
		// submit button click
		submitHandler () {
			if (this.code === '') {
				this.errorInfo = 'Gift code is required.';
			} else if (!this.loading) {
				this.ajaxPost();
			}
		},
		ajaxPost () {
			this.loading = true;
			fetch('/promotion/v1/gifts/redeem', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					redeemCode: this.code
				})
			})
			.then(res => res.json())
			.then(data => {
				const bizCode = (data || {}).bizCode;
				this.loading = false;
				// 兑换成功
				if (bizCode === 10000) {
					this.showToast('Gift code was applied successfully.');
					window.setTimeout(() => {
						window.location.reload();
					}, 2000);
				} else if (bizCode === 73100) {
					this.errorInfo = 'This code has already been redeemed.';
				} else if (bizCode === 73300) {
					this.showMsgPop({
						msg: 'You have attempted too many times, please try later'
					});
				} else {
					this.errorInfo = 'Invalid Gift. Gift code cannot be found.';
				}
			}).catch(() => {
				this.loading = false;
				this.showToast('No internet connection, try again.');
			});
		},
		clearAllInput () {
			this.errorInfo = '';
			this.code = '';
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import '../../deposit/ke/style/button.less';
@import '../../deposit/ke/style/input.less';

.m-gift-code-wrap{
		width: 240/@rem;
		position: relative;
		margin: 30/@rem auto;
		height: 36/@rem;
		box-sizing: border-box;
		.m-input-wrapper{
			height: 100%;
			.m-input{
				height: 36/@rem;
				font-size: 14/@rem;
				border-color: #979797 !important;
			}
			&.m-input-wrapper--error,
			&.m-input-wrapper--active{
				.m-input{
					box-sizing: border-box;
				}
			}
			.m-input-icon.m-input-icon--clickable:hover+.m-input{
				border-color: @darkGray !important;
			}
			.m-input-icon{
				right: 31%;
				& + .m-input{
					padding-right: 35.8%;
				}
			}
			.m-input-icon::before{
				width: 18/@rem;
				height: 18/@rem;
				line-height: 18/@rem !important;
				font-size: 8/@rem !important;
			}
		}
		.af-button--primary{
			position: absolute!important;
			right: 0;
			top: 0;
			padding: 0;
			width: 67/@rem;
			float: right;
			height: 36/@rem;
			color: @white;
			font-weight: bold;
			font-size: 14/@rem;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			border: 1px solid #979797 !important;
			&.is-disabled{
				background: @midGray !important;
				color:#9CA0AB!important;
			}
		}
		.af-button.is-disabled, .af-button.is-disabled:focus, .af-button.is-disable:hover{
			border-color: #979797 !important;
		}
		.m-code-err{
			position: absolute;
			font-size: 12/@rem;
			line-height: 36/@rem;
			color: @red;
		}
	}
</style>
