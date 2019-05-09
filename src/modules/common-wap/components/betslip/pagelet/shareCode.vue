<template>
	<div class="m-default">
		<p class="m-default-info">Please insert booking code<span @click="showTip" class="m-dialog-tip"></span></p>
		<div class="m-code-wrapper">
			<AfInput
				class="m-default-code"
				v-model="shareCode"
				placeholder="Booking Code"
				icon="delete"
				:error="!!shareCodeErr"
				:iconClick="iconClick"/>
				<p class="code-error-info" v-if="shareCodeErr">{{shareCodeErr}}</p>
		</div>
		<div :class="shareCodeBtnCls" @click="booking"><span>{{shareBtnText}}</span></div>
		<p class="m-tip">To place a bet, click on the odds.</p>
		<div class="bottom-link">
			<a :href="`${baseUrl}sport/football/today/?source=betslip`">
				<span class="sport-icon m-today-icon"></span>
				<span class="sport-text">Today's<br>Football</span>
			</a>
			<a :href="addSourcePara(pagePath.preFootball)">
				<span class="sport-icon m-sport-icon"></span>
				<span class="sport-text">Sports</span>
			</a>
			<a :href="addSourcePara(pagePath.liveList)">
				<span class="sport-icon m-live-icon"></span>
				<span class="sport-text">Live</span>
			</a>
			<a :href="addSourcePara(pagePath.home)">
				<span class="sport-icon m-home-icon"></span>
				<span class="sport-text">Home</span>
			</a>
		</div>
	</div>
</template>

<script>
	import {
		AfInput
	} from 'components/input/index';
	import { pagePath, baseUrl } from 'config/pageConfig';
	import { mapActions } from 'vuex';

	export default {
		components: {
			AfInput
		},
		data () {
			return {
				shareCode: '',
				shareCodeErr: '',
				shareCodeBtnCls: {
					'share-code-btn': true,
					'share-code-btn--loading': false,
					'share-code-btn--disabled': true,
				},
				pagePath,
				baseUrl
			};
		},
		watch: {
			shareCode: {
				immediate: true,
				handler (val) {
					if (val === '') {
						this.shareCodeErr = '';
					}
					this.shareCodeBtnCls['share-code-btn--disabled'] = !val;
				}
			}
		},
		computed: {
			shareBtnText () {
				return this.shareCodeBtnCls['share-code-btn--loading'] ? 'Loading' : 'Load';
			}
		},
		methods: {
			...mapActions('betslip', ['loadBetslip', 'subscription']),
			iconClick () {
				this.shareCode = '';
			},
			booking () {
				if (this.shareCode) {
					this.shareCodeBtnCls['share-code-btn--loading'] = true;
					this.loadBetslip({
						betCode: this.shareCode
					})
					.then(() => {
						this.shareCodeBtnCls['share-code-btn--loading'] = false;
						this.subscription();
					})
					.catch(msg => {
						this.shareCodeErr = msg;
						this.shareCodeBtnCls['share-code-btn--loading'] = false;
					});
				}
			},
			showTip () {
				this.$dialog({
					content: 'A booking code enables you to book or transfer a bet. Odds or availabilities may change.',
					css: 'booking-code-tip',
					title: 'What is Booking Code ?',
					button: ['OK']
				});
			},
			addSourcePara (url) {
				return URL.addPara(url, {
					source: 'betslip'
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '~base/styles/variable.less';
	@import 'base/styles/icon.less';
	@import '~base/styles/animate.less';
	.booking-code-tip{
		.m-dialog-head{
			h1{
				white-space: nowrap;
			}
		}
		.m-dialog-body{
			font-size: 16/@rem;
		}
	}
	.m-default{
		.m-default-info{
			font-size: 16/@rem;
			color: @dark;
			font-weight: 700;
			padding: 20/@rem 0 0 20/@rem;
			text-align: left;
			.m-dialog-tip{
				.m-icon-tips();
				display: inline-block;
				padding-left: 5/@rem;
				&::before{
					vertical-align: middle;
					color: @darkGray;
				}
			}
		}
		.m-code-wrapper{
			padding: 10/@rem 20/@rem 11/@rem;
			.m-input-wap-wrapper{
				display: block;
				border-color: @midGray;
				border-radius: 2px;
				.m-input-wap {
					line-height: 38/@rem;
					height: 38/@rem;
				}
				&--active{
					border-color: @green;
				}
				&--error{
					border-color: @red;
				}
				.m-icon-delete{
					.m-icon-close();
					&:before{
						background-color: @fogGray;
						color: @dark;
						display: inline-block;
						height: 20/@rem;
						width: 20/@rem;
						line-height: 20/@rem;
						font-size: 12/@rem;
						border-radius: 20/@rem;
						text-align: center;
					}
				}
			}
			.code-error-info{
				line-height: 1.3;
				color: @red;
				padding-top: 4/@rem;
			}
		}
		.share-code-btn{
			height: 48/@rem;
			line-height: 48/@rem;
			flex: 1;
			margin: 0 20/@rem;
			background-color: @green;
			text-align:center;
			color: #fff;
			display: block;
			color: @white;
			font-size: 14/@rem;
			border-radius: 2px;
			&:active {
				background: @lightGreen;
			}
			// 禁止使用状态
			&--disabled {
				background-color: @midGray;
				color: @darkGray;
				&:active {
					background: @midGray;
				}
			}
			// 提交状态
			&--loading{
				.m-icon-loading-circle();
				&:before{
					animation: circles 1s infinite;
					animation-timing-function: linear;
					display: inline-block;
					vertical-align: top;
				}
				>span{
					display: inline-block;
					padding-left: 10/@rem;
				}
				background-color: @green;
				color: @white;
			}
		}
		.m-tip{
			margin-top: 54%;
			font-size: 12/@rem;
			color: @darkGray;
			text-align: center;
		}
		.bottom-link{
			position: absolute;
			// bottom: 24/@rem;
			top: 85%;
			display: flex;
			width: 100%;
			&>a{
				&:link,&,&:active,&:visited{
					text-decoration: none;
				}
			}
			&>a{
				display: block;
				flex: 1;
				span{
					display: block;
					text-align: center;
				}
				.sport-text{
					font-size: 10/@rem;
					color: @dark;
					padding-top: 4/@rem;
				}
				.m-today-icon {
					.m-icon-logo();
				}
				.m-home-icon{
					.m-icon-home();
				}
				.m-sport-icon{
					.m-icon-sports();
				}
				.m-live-icon{
					.m-icon-tv();
				}
				.sport-icon {
					width: auto;
					padding: 0;
					&:before{
						color: @dark;
						font-size: 2rem;
						width: 2rem;
						height: 2rem;
						display: inline-block;
						font-weight: 500;
					}
				}
			}
		}
	}
</style>
