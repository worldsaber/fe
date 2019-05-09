<template>
	<div class="m-redeem-panel">
		<div class="m-panel-title">Redeem your code</div>

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
				:disabled="submitStatus"
				:loading="loading"
				@click.prevent="submitHandler"
			>
				<template v-if="exchangeSuccess">
					<i class="m-icon--success"></i>Succeeded
				</template>
				<template v-else-if="!loading">Redeem</template>
			</AfButton>

			<p class="m-code-err">{{errorInfo}}</p>
		</form>

		<div class="m-panel-desc">
			<p>The “Gift Code” area is only to be used when a Gift Code is given to a customer by the SportyBet Team.</p>

			<p>Gift Codes are not related to promotions. If you believe you are missing a Gift, we highly recommend you to contact our Customer Service using our Live Chat.</p>
		</div>
	</div>
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
			loading: false,
			exchangeSuccess: false,  // 是否兑换成功
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
					this.exchangeSuccess = true;
					window.setTimeout(() => {
						window.location.reload();
					}, 2000);
				} else if (bizCode === 73100) {
					this.errorInfo = 'This code has already been redeemed.';
				} else if (bizCode === 73300) {
					this.$dialog();
					this.showMsgPop({
						msg: 'You have attempted too many times, please try later'
					});
				} else {
					this.errorInfo = 'Invalid Gift. Gift code cannot be found.';
				}
			}).catch(() => {
				this.loading = false;
				this.errorInfo = 'No internet connection, try again.';
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
@import 'base/style/variable.less';
@import 'base/style/icon.less';

.m-redeem-panel {
	padding: 24px 0 22px;

	.m-panel-title {
		font-size: 20px;
		font-weight: bold;
		line-height: 24px;
		text-align: center;
	}

	.m-gift-code-wrap {
		display: block;
		margin: 20px 0 40px 59px;
		position: relative;

		.m-input-wrapper {
			width: 200px;

			&.m-input-wrapper--active {
				.m-input {
					border: 1px solid @green;
				}
			}

			.m-input {
				border: 1px solid @darkGray;
				font-size: 14px;
				font-weight: 500;
				height: 38px;
			}

			.m-input-icon--clickable {
				&:hover {
					cursor: pointer;
					color: @green;

					& + .m-input {
						border-color: @green;
					}
				}
			}
		}

		.af-button--primary {
			min-width: 90px;
			height: 38px;
			background: @green;
			border: none;
			border-radius: 2px;
			font-size: 14px;
			font-weight: 600;
			vertical-align: top;

			&:focus,
			&:hover {
				background: @midGreen;
			}

			&:active {
				background: @darkGreen;
			}

			.m-icon--success {
				.m-icon-success();
				margin-right: 6px;
				&::before{
					font-size:12px;
					color:@white;
					font-weight: bold;
				}
			}
		}

		.m-code-err {
			position: absolute;
			font-size: 10px;
			color: @red;
			line-height: 24px;
		}
	}

	.m-panel-desc {
		font-size: 12px;
		margin: 0 42px;

		p {
			margin-bottom: 12px;
			line-height: 14px;
		}
	}
}
</style>
