<template>
<div class="register-and-login">
	<div class="head-container" v-if="step !== 'regFinish'">
		<!-- <div class="icon-container">
			<i class="m-back-icon-wap" @click="handleBack">
				</i><span class="back-label" @click="handleBack">Back</span>
		</div> -->
		<topNavBar backText="Back" :backClick="handleBack" id="top-navbar">
			<div slot="right" v-if="step === 'pwdReset' || step === 'codeVerify'">
				<homeNav/>
			</div>
		</topNavBar>
		<div class="warn-label" v-if="showWarning">
			<p>Code sent, you have 1 time left to request another one.</p>
		</div>
	</div>

	<enterMobile class="page-container page-fixed" v-if="step === 'enterMobile'" @goPasswdEnter="goPasswdEnter" @goPasswdSet="goPasswdSet" @goFindAccount="goFindAccount" @goLogin="goLogin">
	</enterMobile>
	<loginStep class="page-container page-fixed" v-if="step === 'login'" :phone="phone" @goFindAccount="goFindAccount" @enterMobile="goEnterMobile"/>
	<passwdSet class="page-container" v-if="step === 'pwdSet'" :phone="phone" @enterMobile="goEnterMobile" @goSms="goSms" @goVeriry="goVeriry" @goFinish="goFinish"></passwdSet>

	<passwdEnter class="page-container" v-if="step === 'pwdEnter'" :phone="phone" @goFindAccount="goFindAccount" @regWithFb="goRegWithFb" @enterMobile="goEnterMobile"></passwdEnter>

	<registerWithFacebook class="page-container" v-if="step === 'regWithFb'" @goVeriry="goVeriry" @goSms="goSms">
	</registerWithFacebook>

	<codeVerify class="page-container" v-if="step === 'codeVerify'" :phone="phone" :remainMsgNum="remainMsgNum" :bizType="bizType" :preToken="token" :showWarning="showWarning" :warnForNG="warnForNG" :regDefault="regDefault" @goPasswdReset="goPasswdReset" @enterMobile="goEnterMobile" @regWithFb="goRegWithFb" @goFindAccount="goFindAccount" @goFinish="goFinish" @goSms="goSms" @warn="handleWarning">
	</codeVerify>

	<smsSent class="page-container" v-if="step === 'smsSent'" :phone="phone" :bizType="bizType" :smsNumber="smsNumber" :msgContent="msgContent" :token="token" @goPasswdReset="goPasswdReset" @goFinish="goFinish" @enterMobile="goEnterMobile" @goFindAccount="goFindAccount">
	</smsSent>

	<registFinished class="page-container" v-if="step === 'regFinish'">
	</registFinished>

	<findAccount class="page-container" v-if="step === 'findAccount'" @goVeriry="goVeriry" @goSms="goSms">
	</findAccount>

	<passwdReset class="page-container" v-if="step === 'pwdReset'" :phone="phone" :resetToken="resetToken" :bizType="bizType"  @goFindAccount="goFindAccount">
	</passwdReset>
</div>
</template>

<script>
import topNavBar from 'components/navbar/index.vue';
import homeNav from 'components/homeNav';
import cookie from 'storage/cookie';
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus';
import enterMobile from './enterMobile';
import passwdSet from './passwdSet';
import passwdEnter from './passwdEnter';
import codeVerify from './codeVerify';
import smsSent from './smsSent';
import registFinished from './registFinished';
import registerWithFacebook from './registerWithFacebook';
import findAccount from './findAccount';
import passwdReset from './passwdReset';
import loginStep from './loginStep.vue';

export default {
	name: 'popupLogin',

	components: {
		enterMobile,
		loginStep,
		passwdSet,
		passwdEnter,
		codeVerify,
		smsSent,
		registFinished,
		registerWithFacebook,
		findAccount,
		passwdReset,
		topNavBar,
		homeNav
	},
	props: {
		forceInitStep: { // 用来强制指定进入登录或注册流程， 单独的登录或注册流程（如一些活动按钮）可能会用到
			type: String,
			'default': ''
		}
	},
	data() {
		return {
			componentName: 'popupLogin',
			step: '',
			phone: '',
			password: '',
			code: '',
			referral: '',
			bizType: 'REGISTER',
			smsNumber: '',
			msgContent: '',
			remainMsgNum: '',
			token: '',
			showWarning: false,
			historyStack: [],
			isPop: true,
			warnForNG: '',
			initStep: '',
			regDefault: {}
		};
	},

	mounted() {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
	},

	methods: {
		handleBack() {
			if (this.step === this.initStep) {
				// close popup
				this.$popupLogin.close();
				EventBus.$emit(commonEvent.UPDATE_POP_LOGIN_BACK);
				return;
			}
			const length = this.historyStack.length;
			if (length > 1) {
				this.step = this.historyStack[length - 2];
			} else {
				this.historyStack = [];
				this.step = this.initStep;
			}
		},

		handleWarning(value) {
			this.showWarning = value;
		},

		goLogin(opt) {
			this.step = 'login';
			this.warnForNG = '';
			if (opt) {
				this.phone = opt.phone || '';
			}
		},

		goPasswdSet(opt) {
			this.phone = opt.phone;
			this.step = 'pwdSet';
		},

		goRegAndLogin() {
			this.step = 'regAndLog';
			this.warnForNG = '';
		},

		goPasswdReset (opt) {
			this.phone = opt.phone;
			this.resetToken = opt.resetToken;
			this.step = 'pwdReset';
		},

		goFindAccount(opt) {
			this.step = 'findAccount';
			this.warnForNG = '';
		},

		goPasswdEnter(opt) {
			this.phone = opt.phone;
			this.step = 'pwdEnter';
		},

		goRegWithFb(opt) {
			this.step = 'regWithFb';
		},

		goVeriry(opt) {
			this.phone = opt.phone;
			this.bizType = opt.bizType;
			this.remainMsgNum = opt.remainMsgNum;
			this.showWarning = opt.showWarning;
			this.token = opt.token ? opt.token : this.token;
			this.warnForNG = opt.warnForNG ? opt.warnForNG : '';
			this.step = 'codeVerify';
			this.regDefault = opt.opt ? opt.opt : {};
		},

		goSms(opt) {
			this.phone = opt.phone;
			this.bizType = opt.bizType;
			this.smsNumber = opt.smsNumber;
			this.msgContent = opt.msgContent;
			this.token = opt.token;
			this.step = 'smsSent';
		},

		goEnterMobile() {
			this.step = 'enterMobile';
			this.warnForNG = '';
		},

		goFinish() {
			this.step = 'regFinish';
		}
	},
	watch: {
		step(value) {
			const length = this.historyStack.length;
			const index = this.historyStack.indexOf(value);
			if (value === 'smsSent' && length > 0 && this.historyStack[length - 1] === 'codeVerify') {
				this.historyStack.pop();
			}
			if (index < 0) {
				this.historyStack.push(value);
			} else {
				this.historyStack.splice(index + 1);
			}
		}
	},
	created() {
		if (this.forceInitStep) {
			this.initStep = this.forceInitStep === 'login' ? 'login' : 'enterMobile';
		} else {
			const phone = cookie('phone');
			if (phone) {
				this.phone = phone;
				this.initStep = 'login';
			} else {
				this.initStep = 'enterMobile';
			}
		}
		this.step = this.initStep;
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'iconfont/iconfont-mixin.less';
@import 'base/styles/icon.less';

.register-and-login {
    display: block;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-color: @white;
    .head-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
    }
    .icon-container {
        width: 100%;
        height: 40/@rem;
        background-color: @fogGray;
        line-height: 40/@rem;
        .m-back-icon-wap::before {
            margin-left: 10/@rem;
            content: '\E620';
            font-family: "iconfont"!important;
            font-size: 10.7/@rem;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
        }
        .back-label {
            margin-left: 11/@rem;
            font-size: 14/@rem;
            text-align: left;
            color: @dark;
        }

    }
    .warn-label {
        width: 100%;
        height: 26/@rem;
        line-height: 26/@rem;
        background-color: @red;
        font-size: 10/@rem;
        text-align: center;
        color: @white;
    }
    .page-container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 107/@rem 30/@rem 20/@rem;
        width: 100%;
        height: 100%;
        box-sizing: border-box;

		&.page-fixed {
			padding: 40/@rem 0 20/@rem;
		}
    }
}
</style>
