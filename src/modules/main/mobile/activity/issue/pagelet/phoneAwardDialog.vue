<template>
	<div class="m-issue-award-dialog">
		<div class="m-toast-phone">
			<img class="m-toast-ad-image" :src="toastAdUrl"  v-show="toastAdUrl"/>
		</div>
		<div class="m-toast-content">
			<div class="m-toast-title">You won a </div>
			<div class="m-toast-ad-text">{{toastAdText}}</div>
			<div class="m-toast-desc" v-if="contentData.gift">& {{showCurrency}}{{contentData.gift}} in Gifts !</div>
			<div class="m-toast-footer">To Redeem your super prize, we'll send you an SMS with further guides, or contact us at {{servicePhone}}.</div>
		</div>
		<div class="m-toast-close" @click="close"><i class="icon-close"/></div>
	</div>
</template>

<script>
import { showCurrency, showCurrencyOrigin } from 'config/currencyConfig';
import { getPhone } from '../js/config';

export default {
	data() {
		return {
			showCurrency,
			showCurrencyOrigin
		};
	},
	computed: {
		toastAdUrl() {
			return this.contentData.adUrl;
		},
		toastAdText() {
			return this.contentData.text;
		},
		servicePhone() {
			return getPhone();
		}

	},
	methods: {
		setPosition() {
			this.$parent.setPosition(true);
		},
		close() {
			this.$dialog();
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-issue-toast {
	&.es-dialog {
		background-color: transparent;
		box-shadow: none;
		.es-dialog-body .es-dialog-main {
			background-color: transparent;
			padding: 0;
		}
	}
	.es-dialog-body {
		background-color: transparent;
	}
}

.m-issue-award-dialog {
	width: 100%;
	min-height: 200/@rem;
	position: relative;
	// background-image: url('../image/toast.png');
	// background-repeat: no-repeat;
	// background-size: contain;
	// height: 345/@rem;
	color: @white;

	.m-toast-icon {
		width: 100%;

	}
	.m-toast-congratulate{
		display: block;
		width: 242/@rem;
		height: 56/@rem;
		margin: 0 auto;
	}
	.m-toast-phone{
		min-height: 200/@rem;
	}
	.m-toast-ad-image{
		width: 100%;
	}
	.m-toast-content{
		position: relative;
		z-index: 5;
		margin: 0 40/@rem;
		padding: 16/@rem;
		border-radius: 6px;
		background-image: radial-gradient(circle at 50% 42%, rgba(254, 0, 215, 0.6), #fe00bc 78%, #9900fe);
	}
	.m-toast-title{
		padding-left: 12/@rem;
		margin-bottom: 5/@rem;
		font-size: 18/@rem;
		font-weight: bold;
	}
	.m-toast-ad-text{
		padding-left: 12/@rem;
		font-size: 28/@rem;
		font-weight: bold;
		line-height: 1;
	}
	.m-toast-desc{
		padding-left: 12/@rem;
		font-size: 22/@rem;
		font-weight: bold;
		line-height: 1;
	}
	.m-toast-footer{
		margin-top: 12px;
		font-size: 12/@rem;
		line-height: 1.5;
	}

	.m-toast-close {
		position: absolute;
		right: 30/@rem;
		top: 5/@rem;
		width: 30/@rem;
		height: 30/@rem;
		text-align: center;
		border-radius: 50%;
		background-color: @white;
		.icon-close {
			.m-icon-close();
			color: @dark;
			line-height: 2.5rem;
		}
	}
}
</style>
