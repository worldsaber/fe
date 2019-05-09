<template>
	<div class="m-issue-toast-dialog-wrap">
		<img class="m-toast-icon" src="../image/gift-dialog.png" @load="setPosition">
		<div class="m-toast-title">{{showCurrencyOrigin}}</div>
		<div class="m-toast-value">{{contentData.gift}}</div>
		<div class="m-toast-congratulate">Congratulations!</div>
		<div class="m-toast-desc"><p>Yon won {{showCurrency}}{{contentData.gift}} in Gifts.</p></div>
		<div class="m-toast-close" @click="close"><i class="icon-close"/></div>
	</div>
</template>

<script>
import { showCurrency, showCurrencyOrigin } from 'config/currencyConfig';

export default {
	data() {
		return {
			showCurrency,
			showCurrencyOrigin
		};
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

.m-issue-toast-dialog-wrap {
	width: 100%;
	min-height: 200/@rem;
	position: relative;
	// background-image: url('../image/toast.png');
	// background-repeat: no-repeat;
	// background-size: contain;
	// height: 345/@rem;
	text-align: center;
	color: @white;

	.m-toast-icon {
		width: 100%;
	}
	.m-toast-title {
		position: absolute;
		width: 100%;
		top: 32%;
		margin-top: -3/@rem;
		line-height: 28/@rem;
		opacity: 0.4;
 		font-size: 24/@rem;
		font-weight: 500;
	}
	.m-toast-value {
		position: absolute;
		width: 100%;
		top: 40%;
		line-height: 70/@rem;
		font-size: 68/@rem;
		font-weight: 900;
	}
	.m-toast-congratulate {
		position: absolute;
		width: 100%;
		top: 66%;
		margin-top: 6/@rem;
		margin-bottom: 6/@rem;
		line-height: 25/@rem;
		font-size: 22/@rem;
		font-weight: bold;
	}
	.m-toast-desc {
		position: absolute;
		top: 76%;
		width: 100%;
		margin: auto;
		font-size: 12/@rem;
		line-height: 12/@rem;
		font-weight: bold;
		p {
			width: 50%;
			margin: auto;
		}
		span {
			font-size: 20/@rem;
			line-height: 20/@rem;
		}
	}

	.m-toast-close {
		position: absolute;
		right: 8%;
		top: 8%;
		width: 30/@rem;
		height: 30/@rem;
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
