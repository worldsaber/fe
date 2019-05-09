<template>
	<div class="container">
		<topNavBar backText="Back" id="top-navbar"/>
		<div class="wrapper">
			<h1>Manual Reconciliation</h1>
			<p class="explian">Please enter the Transaction Code which Operators sent to your Mobile Phone via SMS.</p>
			<form class="m-gift-code-wrap">
				<AfInput
					placeholder="Enter Code"
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
					<template v-if="loading"></template>
					<template v-else>Confirm</template>
				</AfButton>
				<p class="m-code-err">{{errorInfo}}</p>
			</form>
			<section>
				<p class="situation">Manual Reconciliation is to be used in situations such as:</p>
				<ul>
					<li>Deposit is displayed as "Failed";</li>
					<li>Deposit is displayed as "Pending";</li>
					<li>Paybill was used to Deposit, but no records exist;</li>
				</ul>
				<p class="all">In all of these situations, you might still have received an SMS from Operators informing that this transaction was successful.</p>
			</section>
		</div>
	</div>
</template>
<script>
import AfButton from 'packages/button/button.vue';
import { AfInput } from 'packages/input';
import topNavBar from 'components/navbar/index.vue';
import cookie from 'storage/cookie';
import { pagePath } from 'config/pageConfig';
import popMsg from '../../deposit/ke/js/popMsg';

import '../../mockData/gifts/index?debug';

export default {
	mixins: [popMsg],
	components: {
		topNavBar,
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
			loading: false,
			transaction: `${pagePath.myCenter}/transactions`
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
			fetch('/pocket/v1/paych/front/manualClaim', {
				method: 'POST',
				headers: new Headers({
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					userId: cookie('userId'),
					chTxId: this.code
				})
			})
			.then(res => res.json())
			.then(data => {
				const bizCode = (data || {}).bizCode;
				this.loading = false;
				// 兑换成功
				if (bizCode === 10000) {
					this.showMsgPop({
						msg: data.data.reason
					}).onBtnClick(this.clearAllInput);
				} else {
					this.showToast = 'Sorry，something went wrong. Please try again later.';
				}
			}).catch(() => {
				this.loading = false;
				this.showToast('Sorry，something went wrong. Please try again later.');
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
.wrapper {
	padding: 0 30/@rem;
}
h1 {
	margin-top: 24/@rem;
	margin-bottom: 35/@rem;
	  font-size: 22/@rem;
  font-weight: bold;
  line-height: 0.77;
  text-align: center;
  color: #353a45;
}
.explian {
	font-size: 14px;
  text-align: center;
  color: #353a45;
}
section {
	font-size: 14px;
  color: #9ca0ab;
  ul {
	  margin-top: 4/@rem;
	  margin-bottom: 12/@rem;
  }
  li {
	  &:before {
		  margin-right: 12/@rem;
	  }
	  &:nth-child(1):before {
		  content: 'a)';
	  };
	  &:nth-child(2):before {
		  content: 'b)';
	  };
	  &:nth-child(3):before {
		  content: 'c)';
	  };
	  &:nth-child(3) {
		  display: inline-flex;
	  }
  }
}
.m-gift-code-wrap{
		margin-top: 14/@rem;
		margin-bottom: 36/@rem;
		width:100%;
		height: 38/@rem;
		.m-input-wrapper{
			height: 38/@rem !important;
			width:67%;
			.m-input{
				font-size: 14/@rem;
				border: 1px solid #979797 !important;
				border-radius: 2px;
				width:100% !important;
				height: 38/@rem !important;
				max-width: 100% !important;
				padding-right:0 !important;
			}
			&.m-input-wrapper--error{
				.m-input{
					box-sizing: border-box;
					border: 1px solid @red !important;
				}
			}
			&.m-input-wrapper--active{
				.m-input{
					box-sizing: border-box;
					border: 1px solid @green !important;
				}
			}
			.m-input-icon.m-input-icon--clickable:hover+.m-input{
				border-color: @darkGray !important;
			}
			.m-input-icon::before{
				width: 18/@rem;
				font-size: 8/@rem !important;
			}
		}
		.m-input-wrapper .m-input-icon:hover {
			color: @darkGray !important;
		}
		.af-button--primary{
			width: 30%;
			height: 38/@rem !important;
			float: right;
			color: @white;
			font-weight: bold;
			font-size: 14/@rem;
			border-radius: 2px;
			border: 1px solid #979797 !important;
			background: @green;
			&.is-disabled, &:focus, &:hover{
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
