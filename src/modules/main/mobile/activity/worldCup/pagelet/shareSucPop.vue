<template lang="html">
	<div class="m-cup-pop m-cup--suc">
		<i
			class="m-icon-close"
			data-action="close"
			data-ret="closeBtn"
		></i>
		<div class="m-pop-header">
			<i class="m-icon-suc"></i>
			<span>Successfully Shared!</span>
		</div>
		<div class="m-pop-main">
			<div :class="['m-t-small', {'emphasize':isEmphasize1}]">{{textLine1}}</div>
			<div :class="['m-t-small', {'emphasize':isEmphasize2}]">{{textLine2}}</div>
			<div class="m-btn-wrapper">
				<a :href="buttonUrl">{{buttonText}}</a>
			</div>
		</div>
		<!-- <div class="m-pop-aid">
			<a :href="promtUrl">Check more World Cup promotions ></a>
		</div> -->
	</div>
</template>

<script>
export default {
	data() {
		return {
			textLine1: '',
			textLine2: '',
			buttonText: '',
			buttonUrl: '',
			isEmphasize1: false,
			isEmphasize2: false,
		};
	},
	created() {
		const actConfig = this.contentData.actConfig || {};
		let config = actConfig.default || {};
		if (this.contentData.isFromFb) {
			config = actConfig.fb || {};
		}
		if (this.contentData.isReg) {
			const registered = config.registered;
			if (!registered) {
				return;
			}
			this.textLine1 = registered.registeredTextLine1.text;
			this.textLine2 = registered.registeredTextLine2.text;
			this.isEmphasize1 = registered.registeredTextLine1.strong;
			this.isEmphasize2 = registered.registeredTextLine2.strong;
			this.buttonText = registered.registeredButtonText;
			this.buttonUrl = registered.registeredButtonUrl;
		} else {
			const unregistered = config.unregistered || config.unRegistered;
			if (!unregistered) {
				return;
			}
			this.textLine1 = unregistered.unRegisteredTextLine1.text;
			this.textLine2 = unregistered.unRegisteredTextLine2.text;
			this.isEmphasize1 = unregistered.unRegisteredTextLine1.strong;
			this.isEmphasize2 = unregistered.unRegisteredTextLine2.strong;
			this.buttonText = unregistered.unRegisteredButtonText;
			this.buttonUrl = unregistered.unRegisteredButtonUrl;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable';
@import 'base/styles/icon.less';

.m-cup-pop.m-cup--suc {
	padding: 26/@rem 5/@rem 20/@rem;
	box-sizing: border-box;
	font-family: AvenirNext;
	text-align: center;

	.m-icon-close {
		position: absolute;
		right: 10/@rem;
		top: 10/@rem;
		line-height: 16/@rem;
		color: @dark;
		.m-icon-close();
		&::before {
			font-size: 15/@rem;
			line-height: 1;
		}
	}

	.m-pop-header {
		line-height: 21/@rem;
		font-size: 20/@rem;
		font-weight: 600;
		letter-spacing: -1/@rem;

		.m-icon-suc {
			.m-icon-success-bg();
			color: #2842bb;
			margin-right: 7/@rem;

			&:before {
				font-size: 20/@rem;
				line-height: 21/@rem;
			}
		}
	}
	.m-pop-main {
		padding-top: 8/@rem;
		box-sizing: border-box;
	}

	.m-t-small {
		height: 1;
		font-size: 12/@rem;
		letter-spacing: -0.6/@rem;
		text-align: center;
		color: #010101;
		margin-bottom: 6/@rem;
	}
	.emphasize {
		font-weight: 600;
	}
	.m-t-big {
		height: 1;
		font-size: 15/@rem;
		font-weight: 600;
		letter-spacing: -0.7/@rem;
		color: #010101;
	}

	.m-btn-wrapper {
		margin-top: 10/@rem;

		a {
			display: inline-block;
			width: 105/@rem;
			height: 40/@rem;
			line-height: 40/@rem;
			border-radius: 2/@rem;
			background: #ffc900;
			color: @white;

			&:active,
			&:hover {
				color: @white;
			}
		}
	}

	.m-pop-aid {
		margin-top: 10/@rem;
		line-height: 1;
		font-size: 10/@rem;
		font-weight: 600;
		letter-spacing: -0.5/@rem;

		a,
		a:active,
		a:hover {
			color: #2842bb;
		}
	}
}
</style>
