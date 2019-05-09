<template>
	<div class="mobile-navbar-wrap">
		<header class="mobile-navbar">
			<div class="navbar-wraper">
				<div class='mobile-navbar-left' @click.prevent='toggleLeftMenu'>
					<div>
						<span class="m-menu-icon"></span>
						<span class="m-text">AZ menu</span>
					</div>
				</div>

				<a class='mobile-navbar-logo' :href="homeLink">
					<h1 style="display: none">Sportybet</h1>
				</a>

				<div class="m-flag-wrapper">
					<!-- 肯尼亚国旗 -->
					<img src="./image/KenyaFlag.png" v-if="countryCode === '254'">
					<!-- 尼日国旗 -->
					<img src="./image/NigeriaFlag.png" v-if="countryCode === '234'">
				</div>
				<div class='mobile-navbar-right'>
					<span class="m-icon-search" @click="jmpSearch"></span>
					<span v-if="!isLogin" class="m-login-not" @click="jumpToLogin"><span>Register/Log In</span></span>
					<span v-else class="m-login-yes" @click="toggleMe">
						<template v-show="!isLoading">
							<!-- 是由等于0的时候才显示freeDeposit， 为负数及正数显示 值 -->
							<span v-if="balance !== 0" class="m-t-money"><em class="m-user-icon"></em>{{showCurrency}}{{fomatBalance}}</span>
							<span v-else-if="!isLoading" class="m-btn-deposit"><span class="m-btn-text" @click.stop="jumpToDeposit">Deposit</span><em class="m-user-icon"></em></span>
						</template>
					</span>
					<div class="history-tip" v-if="isShowHistoryTip && isLogin">Check your bet history here</div>
				</div>
			</div>
		</header>
		<Me v-model="isShowMe"/>
	</div>
</template>

<script>
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';
import { TOGGLE_LEFT, TOGGLE_RIGHT } from 'store/layout/mutationTypes';
import { LS } from 'storage';
import {
	// baseUrl,
	pagePath
} from 'config/pageConfig';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { showCurrency } from 'config/currencyConfig';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus.js';
import Me from '../me';

const isHaveHistoryTip = LS.get('isHaveHistoryTip');
export default {
	name: 'Navbar',
	components: {
		Me,
	},
	data () {
		return {
			showCurrency,
			isShowHistoryTip: isHaveHistoryTip !== '1',
			countryCode: window.countryCode,
			isShowMe: false
		};
	},
	props: {
	},
	created() {
	},
	watch: {
		isShowHistoryTip: {
			immediate: true,
			handler  (val) {
				if (val) {
					setTimeout(() => {
						this.isShowHistoryTip = false;
						LS.set('isHaveHistoryTip', 1);
					}, 4000);
				}
			}
		},
		showLeft () {
			this.isShowMe = false;
		},
		showRight () {
			this.isShowMe = false;
		}
	},
	computed: {
		...mapState('assetsInfo', ['isLogin', 'giftNum', 'balance', 'isLoading']),
		...mapState('layout', ['showLeft', 'showRight']),
		...mapGetters('assetsInfo', ['fomatBalance']),
		homeLink() {
			return pagePath.home;
		}
	},
	methods: {
		toggleLeftMenu (e) {
			this.toggleLeft();
		},
		...mapMutations('layout', [TOGGLE_LEFT, TOGGLE_RIGHT]),
		...mapActions('assetsInfo', ['fetchAcountInfo']),
		toggleMe() {
			// 显示me弹层
			this.isShowMe = !this.isShowMe;
			if (this.isShowMe) {
				this.isShowHistoryTip = false;
				LS.set('isHaveHistoryTip', 1);

				// 更新余额
				EventBus.$emit(commonEvent.UPDATE_ACCOUNT_BALANCE);
			}
		},
		jumpToLogin() {
			if (this.$popupLogin) {
				this.$popupLogin.show();// use popup login.
			} else {
				console.log('Need to load components/login/popupLogin.js in root component ');
			}
		},
		jumpToDeposit () {
			window.location.href = URL.addPara(userCenterUrl.deposit, {
				source: 'navbar'
			});
		},
		jmpSearch() {
			window.location.href = URL.addPara(pagePath.search, {
				source: 'navbar'
			});
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';
.mobile-navbar {
	position: relative;
	height: 44/@rem;
	line-height: 44/@rem;
	width: 100%;

	.navbar-wraper{
		position: relative;
		z-index: 1;
		height: 44/@rem;
		line-height: 44/@rem;
		// background: linear-gradient(to right, @red 92%, @red 93%, fadeout(@red, 20%) 96%, fadeout(@red, 50%) 98%, transparent 100%);
		background: @red;
		color: @white;
		display: flex;
		justify-content: left;
		width: 100%;
	}
	.mobile-navbar-left,.mobile-navbar-right{
		flex: 0 1 auto;
	}
	.mobile-navbar-left {
		line-height: 1.2;
		height: 100%;
		text-align: center;
		width: 44/@rem;
		background: fade(@black, 10%);

		&>div{
			transform: translate(0%, 25%);
			.m-menu-icon{
				.m-icon-menu();
				display: block;
				&:before{
					font-size: 16/@rem;
				}
			}
			.m-text{
				margin-top: 3px;
				font-size: 8/@rem;
				display: block;
			}
		}
	}
	.mobile-navbar-logo {
		display: block;
		flex: 0 0 auto;
		.m-icon-sportbet();
		&:before{
			font-size: 15/@rem;
			color: @white;
		}
		padding-left: 8/@rem;

		&:active, &:link, &:hover, &:visited {
			text-decoration: none;
		}
	}

	.m-icon-search {
		width: 24/@rem;
		height: 24/@rem;
		padding: 5/@rem;
		.m-icon-search();
		color: @white;
		margin-right: 10/@rem;
		// box-sizing: border-box;
		line-height: 24/@rem;
		&:before {
			font-size: 16/@rem;
		}
	}

	.m-flag-wrapper{
		padding-left: 3/@rem;
		display: none;
		img{
			width: 19/@rem;
			height: auto;
			vertical-align: baseline;
		}
	}
	.mobile-navbar-right {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		text-align: right;
		padding-right: 8/@rem;
		position: relative;
		.m-user-icon{
			color: @white;
			.m-icon-user-dft();
			&:before {
				font-size: 16/@rem;
				line-height: 1;
			}
		}

		.m-t-money {
			border: 1px solid fadeout(@white, 40%);
			border-radius: 2/@rem;
			display: inline-block;
			vertical-align: middle;
			padding: 4/@rem 6/@rem;
			box-sizing: border-box;
			line-height: 16/@rem;
			font-size: 12/@rem;
			font-weight: 500;

			.m-user-icon {
				padding-right: 5px;
			}
		}

		.m-login-yes{
			height: 44/@rem;
			line-height: 44/@rem;
			white-space: nowrap;

			.m-btn-deposit{
				.m-user-icon {
					display: inline-block;
					line-height: 1;
					vertical-align: middle;
					padding: 6/@rem 8/@rem;
					box-sizing: border-box;
					margin-left: 4/@rem;
					border: 1px solid fadeout(@white, 50%);
					border-radius: 2/@rem;
				}
			}

			.m-btn-text {
				display: inline-block;
				font-size: 12/@rem;
				line-height: 14/@rem;
				border: 1px solid fadeout(@white, 50%);
				padding: 7/@rem 8/@rem;
				border-radius: 2/@rem;
				color: @darkerRed;
				background: fadeout(@white, 10%);
			}
		}
		.m-login-not{
			display: inline-block;
			height: 100%;
			// height: 14px;

			& > span {
				font-size: 12/@rem;
				font-weight: 500;
				display: inline-block;
				height: 28/@rem;
				line-height: 28/@rem;
				padding: 0 8/@rem;
				box-sizing: border-box;
				border: 1px solid fadeout(@white, 20%);
				border-radius: 2/@rem;
			}
		}
	}
	// 为了不影响flex布局，在低端手机下，加了一层div
	// 某些浏览器不加就会导致出现横向滚动条
	// 写top：0，不要写bottom为0否则在andoroid4.3原生浏览器会随滚动而滚动
	// z-index:-1也会在android4.1.1下原生浏览器有bug
	// .m-image-wrapper {
	// 	position: absolute;
	// 	right: 0;
	// 	top: 0;
	// 	height: 100%;
	// 	> img {
	// 		height: 100%;
	// 		vertical-align: top;
	// 	}
	// }

	.history-tip{
		position: absolute;
		background-color: #3685e2;
		height: 38/@rem;
		line-height: 38/@rem;
		font-size: 14/@rem;
		color: @white;
		padding: 0 12/@rem;
		border-radius: 2px;
		font-weight: 500;
		box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);
		top: 100%;
		margin-top: -5/@rem;
		z-index: 3;
		right: 8/@rem;
		margin-left: -20/@rem;
		.m-icon-arrow-up2();
		&:before{
			position: absolute;
			display: block;
			font-size: 16/@rem;
			right: 10/@rem;
			top: -10/@rem;
			height: 16px;
			line-height: 1;
			color: #3685e2;
		}
	}
}
// app下不显示
#sportybet{
	.mobile-navbar{
		display: none !important;
	}
}

// 最右侧不显示国旗背景
.page-content--ng {
	.mobile-navbar {
		.navbar-wraper {
			background: @red;
		}
	}
}
</style>
