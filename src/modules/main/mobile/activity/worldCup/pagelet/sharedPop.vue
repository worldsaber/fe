<template lang="html">
	<div class="m-cup-pop m-cup-shared">
		<i
			class="icon-close"
			data-action="close"
			data-ret="closeBtn"
		></i>
		<div class="m-pop-header">
			<span>You have {{ isShared ? 'shared': 'submitted' }} your prediction!</span>
		</div>
		<div class="m-pop-main">
			<div :class="['m-t-small', {'emphasize':isEmphasize1}]">{{textLine1}}</div>
			<div :class="['m-t-small', {'emphasize':isEmphasize2}]">{{textLine2}}</div>
		</div>
		<div class="m-btn-wrapper">
			<template v-if="!isShared">
				<a href="javascript: void(0)" data-action="btn" data-ret="okBtn" class="guess-button share-again">
					<!-- <i class="m-icon-fb"></i> -->
					Share to WIN NOW!
				</a>
			</template>
			<template v-else>
				<a href="javascript: void(0)" data-action="btn" data-ret="okBtn" class="guess-button share-again">Share Again</a>
				<a :href="buttonUrl" class="guess-button view-now">{{buttonText}}</a>
			</template>
		</div>
		<div class="m-pop-aid">
			<!-- <a :href="promtUrl" class="check-more-promotions">Check more World Cup promotions ></a> -->
			<p class="m-share-tip">
				<i class="m-icon-tips"></i>
				<span>Only your first prediction is valid!</span>
			</p>
		</div>
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
	computed: {
		isShared() {
			return this.contentData.isShared;
		}
	},
	created() {
		const actConfig = this.contentData.actConfig || {};
		let config = actConfig.default || {};
		if (this.contentData.isFromFb) {
			config = actConfig.fb || {};
		}
		if (this.contentData.isReg) {
			const registered = config.registered;
			if (registered) {
				this.textLine1 = registered.registeredTextLine1.text;
				this.textLine2 = registered.registeredTextLine2.text;
				this.isEmphasize1 = registered.registeredTextLine1.strong;
				this.isEmphasize2 = registered.registeredTextLine2.strong;
				this.buttonText = registered.registeredButtonText;
				this.buttonUrl = registered.registeredButtonUrl;
			}
		} else {
			const unregistered = config.unregistered || config.unRegistered;
			if (unregistered) {
				this.textLine1 = unregistered.unRegisteredTextLine1.text;
				this.textLine2 = unregistered.unRegisteredTextLine2.text;
				this.isEmphasize1 = unregistered.unRegisteredTextLine1.strong;
				this.isEmphasize2 = unregistered.unRegisteredTextLine2.strong;
				this.buttonText = unregistered.unRegisteredButtonText;
				this.buttonUrl = unregistered.unRegisteredButtonUrl;
			}
		}

		if (!this.contentData.isShared) {
			this.textLine1 = actConfig.didNotShare.text;
			this.isEmphasize1 = actConfig.didNotShare.strong;
			this.textLine2 = '';
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable';
@import 'base/styles/icon.less';
.m-cup-pop.m-cup-shared {
	padding: 0 0 20/@rem 0;

	.icon-close {
		position: absolute;
		top: 10/@rem;
		right: 10/@rem;
		line-height: 16/@rem;
		.m-icon-close();
		&::before {
			font-size: 16/@rem;
		}
	}
	.m-pop-header {
		font-size: 18/@rem;
		line-height: 18/@rem;
		margin-bottom: 12/@rem;
		font-weight: 600;
		text-align: center;
	}
	.m-pop-main {
		.m-t-small {
			font-size: 14/@rem;
			line-height: 14/@rem;
			margin: 16/@rem 0;
			text-align: center;
		}
		.m-t-big {
			font-size: 18/@rem;
			line-height: 18/@rem;
			margin-bottom: 12/@rem;
			text-align: center;
		}
		.emphasize {
			font-weight: 600;
		}
	}
	.m-btn-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin: 20/@rem 0;
		.guess-button {
			text-decoration: none;
			line-height: 40/@rem;
			padding: 0 12/@rem;
			font-size: 14/@rem;
			font-weight: 600;
			color: @white;
			border-radius: 4/@rem;
			&.share-again {
				background-color: #2842bb;
			}
			&.view-now {
				background-color: #ffc900;
			}
		}
		.m-icon-fb {
			display: inline-block;
			vertical-align: middle;

			width: 21/@rem;
			height: 21/@rem;
			border-radius: 4/@rem;
			background: @white;
			margin-right: 15/@rem;
			cursor: pointer;

			.m-icon-facebook();

			&:before {
				font-size: 20/@rem;
				color: #2036a7;
				line-height: 1;
				display: inline-block;
				vertical-align: top;
				margin-top: 3/@rem;
				margin-left: 2/@rem;
			}
		}
	}
	.m-pop-aid {
		margin-top: 10/@rem;
		font-size: 12/@rem;
		line-height: 12/@rem;
		text-align: center;

		.check-more-promotions {
			color: @linkBlue;
			text-decoration: none;
		}

		.m-share-tip {
			margin-top: 8/@rem;
			.m-icon-tips {
				line-height: 12/@rem;
				.m-icon-tips();
				&::before {
					font-size: 12/@rem;
				}
			}
			color: @darkGray;
		}
	}
}

</style>
