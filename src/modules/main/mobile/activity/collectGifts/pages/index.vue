<template>
	<div class="m-activity-login m-gifts-login">
		<HeaderLogo></HeaderLogo>

		<div class="m-activity-title">
			<div class="m-title">
				<span>UP TO {{showCurrency}}</span>
				<span class="m-title--upper">10 OFF</span>
			</div>
			<div class="m-desc">DEDUCTS STAKE AMOUNTS <br> WHEN YOU PLACE BETS</div>
		</div>

		<af-tabs v-model="currentTab" class="m-main-pane">
			<af-tab-pane label="Register" name="register">
				<RegisterVerify
					passwordPlaceHolder="Set Password (6-14 Characters)"
					commitBtnText="Collect Now"
					@registerSuccess="handleRegisterSuccess"
					@smsExceeded="onSmsExceeded">
				</RegisterVerify>
			</af-tab-pane>

			<af-tab-pane label="Log In" name="login">
				<Login
					commitBtnText="Collect Now"
					:isShowCountryCode=false
					@loginSuccess="handleLoginSuccess">
					<a slot="forget-password"
						:href="forgetPasswordLink"
						class="m-forget-password-text">
						Forget Password >
					</a>
				</Login>
			</af-tab-pane>
		</af-tabs>

		<FooterDesc></FooterDesc>
	</div>
</template>

<script>
import 'packages/tabs';
import { URL } from 'utils';
import { pagePath } from 'config/pageConfig';
import RegisterVerify from 'components/register/registerVerify';
import Login from 'components/login/pagelet/justLogin';
import HeaderLogo from '../pagelet/headerLogo';
import FooterDesc from '../pagelet/footerDesc';

export default {
	name: 'CollectGifts',
	components: {
		RegisterVerify,
		Login,
		HeaderLogo,
		FooterDesc
	},
	data () {
		return {
			forgetPasswordLink: pagePath.resetPassword,
			showCurrency: window.showCurrency,
			currentTab: 'register'
		};
	},
	methods: {
		jumpToResult () {
			const giftId = URL.getPara('giftId');
			if (!giftId) {
				location.href = pagePath.home;
				return;
			}
			this.$router.push({ name: 'result', params: { giftId }});
		},
		handleRegisterSuccess () {
			window.loginStatus = true;
			this.jumpToResult();
		},
		handleLoginSuccess () {
			window.loginStatus = true;
			this.jumpToResult();
		},
		onSmsExceeded () {
			this.$router.push({ name: 'smsResult' });
		}
	},
	mounted () {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
		if (window.loginStatus) {
			this.jumpToResult();
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/icon.less';
@import "base/styles/variable.less";
@import '../styles/input.less';

@purple: #36008a;

.m-activity-login {
	padding: 12/@rem 20/@rem;
	position: relative;

	&.m-gifts-login {
		background: @purple url(../images/bg.png) no-repeat 0 0;
		background-size: 100% auto;
	}

	.m-activity-title {
		margin-top: 18/@rem;
		text-align: center;
		text-transform: uppercase;

		.m-title {
			font-size: 28/@rem;
			font-weight: 900;
			font-style: italic;
			line-height: normal;
			color: @fogGray;
			text-shadow: 0 2px 10px rgba(61, 0, 128, 0.5);

			&--upper {
				font-size: 48/@rem;
				letter-spacing: -1px;
				line-height: 57px;
			}

			@media screen and (min-width:375px) {
				font-size: 22/@rem;

				&--upper {
					font-size: 40/@rem;
				}
			}

			@media screen and (max-width:359px) {
				font-size: 22/@rem;

				&--upper {
					font-size: 40/@rem;
				}
			}
		}

		.m-desc {
			font-size: 16/@rem;
			font-weight: bold;
			line-height: 19/@rem;
			letter-spacing: 0.2px;
			text-align: center;
			color: @fogGray;
			text-shadow: 0 2px 10px rgba(61, 0, 128, 0.5);
		}
	}

	.m-main-pane {
		margin-top: 120/@rem;
		border-radius: 2px;
		background: @white;
		overflow: initial!important;
	}

	.m-tabs-nav {
		margin: 0 25/@rem;
		width: auto;

		.m-tabs-ink-bar {
			height: 4/@rem;
			width: 80/@rem!important;
			margin-left: 18/@rem;

			background-color: @green;
			// transition: left 0.15s ease-in-out;
		}

		.m-tabs-tab {
			font-size: 16/@rem;
			font-weight: bold;
			color: @dark;
			opacity: 0.4;
			padding: 14/@rem 0;

			&-active {
				opacity: 1;
			}
		}
	}

	.m-tabs-content {
		padding: 0 25/@rem;
	}

	.m-register-verify {
		padding: 23/@rem 0 8/@rem;

		.m-input-prepend {
			font-weight: bold;
			font-size: 16px;
		}
	}

	.m-register-verify,
	.m-just-login {
		.input();

		.af-icon-loading {
			.m-icon-loading-circle();
			animation: loading-rotate 1.2s linear infinite;
		}

		.m-submit-btn {
			height: 44/@rem;
			font-size: 18/@rem;
			font-weight: 900;
			background: @green linear-gradient(to bottom, #13d700, #0d9737);
			position: absolute;
			bottom: -58/@rem;
			left: 0;

			&:hover,
			&:active {
				background: #075000 linear-gradient(to bottom, #075000, #0d9737);
			}

			&.is-loading {
				background: @dark;

				span {
					opacity: 0.5;
				}

				&:before {
					background-color: transparent;
				}
			}
		}
	}

	.m-just-login {
		padding: 19/@rem 0 25/@rem;

		.m-forget-password-text {
			color: @green;
		}
	}
}
</style>
