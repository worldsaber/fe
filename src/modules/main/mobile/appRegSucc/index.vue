<template lang="html">
<div id="j_appReg">
 	<Layout :isHaveBottomNav="false" :isHaveNavBar="false">
		<div class="m-page m-page--success" slot="mid">
			<section class="m-page-main">
				<div class="m-right-icon"></div>
				<p class="m-text-tips--thank">Registration Successful</p>
				<template v-if="!from || from === 'sportybet' || from === 'wap'">
					<template v-if="hasCode && isConfirm">
						<p class="text">Referral Code</p>
						<p class="text">{{code}}</p>
					</template>
					<template v-else>
						<div>
						<p class="m-text-tips">Have a referral code?</p>
						<div class="m-page-opt">
							<div class="m-opt-wrapper m-code-wrapper">
								<div class="m-opt-code">
									<AfInput
										v-model="code"
										placeholder="Referral Code (OPTIONAL)"
										icon="delete"
										:error="!!showError"
										@change="validatorCode"
										:iconClick="iconClick"/>
									<AfButton extraType="info" :class="{
										'af-button--loading': this.loading,
										'af-button--success': this.success
									}" @click="apply">Apply</AfButton>
								</div>
								<p v-if="!!showError" class="m-error-tips">{{showError}}</p>
							</div>
							<div class="m-opt-wrapper">
								<AfButton extraType="text" @click="goHome">Back to Home<i class="m-icon-arrow-right"></i></AfButton>
							</div>
							<!-- <p v-if="!!showError" class="m-error-tips">{{showError}}</p> -->
						</div>
						</div>
					</template>
				</template>
			</section>
			<div class="m-image-wrapper" v-if="ad && ad.imgUrl">
				<a :href="ad.linkUrl">
					<img :src="ad.imgUrl"/>
				</a>
			</div>
		</div>
	</Layout>
</div>
</template>

<script>
import AfButton from 'packages/button/button.vue';
import {
	AfInput
} from 'components/input/index';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import Layout from 'components/layout/main.vue';
import { mapMutations } from 'vuex';
import 'components/dialog';
import cookie from 'packages/lib/utils/cookie.js';
import { getReferralCode, getCreativeId, getReferrerSource } from 'utils/channel';

export default {
	components: {
		AfButton,
		AfInput,
		Layout
	},
	data() {
		return {
			code: getReferralCode(),
			loading: false,
			success: false,
			isConfirm: false,
			showError: '',
			hasCode: false,
			from: cookie.get('from'),
			ad: {
				imgUrl: null,
				linkUrl: null
			}
		};
	},
	computed: {
	},
	created () {
		this.pageLoading(false);
		this.loadAd();
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		iconClick () {
			this.code = '';
			this.showError = '';
		},
		goHome() {
			// 跳转app首页
			location.href = 'sportybet://home';
		},
		apply() {
			// 成功状态或者loading状态就直接返回
			if (this.loading || this.success) {
				return;
			}
			if (!this.code) {
				this.showError = 'Referral Code cannot be found.';
				return;
			}
			this.loading = true;
			fetch('/patron/account/inviteCode', {
				method: 'POST',
				body: {
					inviteCode: this.code.trim(),
					creativeId: getCreativeId(),
					source: getReferrerSource()
				}
			})
			.then(res => res.json())
			.then(data => {
				const code = data.bizCode;
				this.hasCode = true;
				if (code === 10000) {
					this.success = true;
					this.isConfirm = true;
				} else if (code === 11670 || code === 11671) {
					this.showError = data.message;
					this.success = false;
					this.isConfirm = false;
				} else {
					return Promise.reject();
				}
				this.loading = false;
			})
			.catch(() => {
				this.$toast('Sorry，something went wrong');
				this.loading = false;
				this.success = false;
				this.isConfirm = false;
			});
		},
		validatorCode(val) {
			this.showError = '';
			this.success = false;
		},
		// 加载底部广告
		loadAd () {
			const t = new Headers();
			t.append('Content-Type', 'application/json;charset=UTF-8');
			/**
			 * {
			 *		"adSpots": [
			 *		{
			 *			"spotId":"registerBanner",
			 *			"preserve":""
			 *		}]
			 *	}
			 */
			const params = {
				adSpots: [{
					spotId: 'registerBanner',
					preserve: ''
				}]
			};
			fetch('/promotion/v1/sp/query', {
				method: 'POST',
				body: JSON.stringify(params),
				headers: t
			})
			.then(res => res.json())
			// 如果不传递就先不显示--暂时不做默认图标
			.then(res => {
				const code = res.bizCode;
				const data = res.data;
				if (code === 10000) {
					if (data.adSpots && data.adSpots[0]) {
						if (data.adSpots[0].ads) {
							this.ad = data.adSpots[0].ads;
						}
					}
				}
			});
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/mixin.less';
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';
html, body{
	min-height: 100%;
}
@keyframes loading {
	100% {
		transform: rotate(360deg);
	}
}
.m-page--success{
	margin-top: 20%;
	.m-right-icon{
		height: 48/@rem;
		width: 48/@rem;
		border-radius: 48/@rem;
		margin: 0 auto;
		background-color: @midGreen;
		text-align: center;
		line-height: 48/@rem;
		.m-icon-success();
		&:before{
			font-size: 30/@rem;
			color: @green;
		}
	}
	.text {
		font-size: 16/@rem;
		text-align: center;
		color: @dark;
	}
	.m-text-tips--thank{
		font-size: 22/@rem;
		text-align: center;
		color:@dark;
		padding-top: 25/@rem;
		padding-bottom: 43/@rem;
	}
	.m-text-tips {
		font-size: 16/@rem;
		text-align: center;
		color: @dark;
	}

	.m-page-opt {
		font-size: 0;
		padding-top: 20/@rem;
		.m-opt-wrapper {
			width: 100%;
			font-size: 0;
			margin: 0 auto;
			text-align: center;
			&:nth-of-type(2) {
				margin-top: 25/@rem;
			}
		}
		.m-error-tips{
			color: @red;
			font-size: 12/@rem;
			text-align: left;
		}
		.m-input-wrapper,
		.af-button {
			display: inline-block;
			vertical-align: middle;
		}
		.m-code-wrapper{
			padding: 0 30/@rem;
			box-sizing: border-box;
			.m-opt-code{
				display: flex;
				align-items: stretch;
				.m-input-wap-wrapper {
					width: 75%;
					flex: 0 0 auto;
					display: block;
					border-color: @midGray;
					.m-input-wap {
						line-height: 48/@rem;
						height: 48/@rem;
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
				.af-button--info {
					background: @green;
					color: @white;
					outline: none;
					font-size: 16/@rem;
					border-top-left-radius: 0;
					border-bottom-left-radius: 0;
					border-width: 0px;
					&:hover {
						background: @midGreen;
					}
					&:active {
						background: @lightGreen;
					}
					width: 25%;
					display: block;
					&.af-button--loading{
						font-size: 0;
						background: @lightGreen;
						>span{
							.m-icon-loading-circle();
							animation: loading 1.5s infinite linear;
							display: inline-block;
							&:before{
								font-size: 16/@rem;
								font-weight: 700;
							}
						}
					}
					&.af-button--success{
						font-size: 0;
						background: @lightGreen;
						.m-icon-success();
						&:before{
							font-weight: 700;
							font-size: 16/@rem;
						}
					}
				}
			}
		}

		.af-button--text {
			color: @linkBlue;
			text-align: right;
			font-size: 16/@rem;
    		padding: 0 !important;
			box-sizing: border-box;
		}

		.m-icon-arrow-right {
			.m-icon-arrow--right();
			&:before {
				display: inline-block;
				vertical-align: middle;
				color: @lightTextColor;
				margin-left: 5/@rem;
			}
		}
	}

}
.m-image-wrapper {
	margin: 0 auto;
	margin-top: 10%;
	a, a:hover,a:visited,a:active{
		text-decoration: none;
	}
	a {
		img{
			width: 100%;
		}
	}
}

#j_appReg .m-footer {
	padding: 10/@rem 0;
	box-sizing: border-box;

	.m-footer-header {
		display: none;
	}
}
</style>
