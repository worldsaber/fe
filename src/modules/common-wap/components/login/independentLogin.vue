<template>
<div class="register-and-login">
	<div class="head-container" v-if="step !== 'regFinish'">
		<!-- <div class="icon-container">
			<i class="m-back-icon-wap" @click="handleBack">
				</i><span class="back-label" @click="handleBack">Back</span>
		</div> -->
		<topNavBar backText="Back" :backClick="handleBack" id="top-navbar">
			<div slot="right" v-if="step === 'pwdReset' || step === 'codeVerify' || step === 'regAndLog'">
				<homeNav/>
			</div>
		</topNavBar>
		<div class="warn-label" v-if="showWarning">
			<p>Code sent, you have 1 time left to request another one.</p>
		</div>
	</div>

	<registerAndLogin
		class="page-container"
		v-if="step === 'regAndLog'"
		@goVeriry="goVeriry"
		@goSms="goSms"
		@goFindAccount="goFindAccount"
		@goFinish="goFinish">
	</registerAndLogin>

	<registerWithFacebook
		class="page-container"
		v-if="step === 'regWithFb'"
		@goVeriry="goVeriry"
		@goSms="goSms">
	</registerWithFacebook>

	<codeVerify
		class="page-container"
		v-if="step === 'codeVerify'"
		:phone="phone"
		:remainMsgNum="remainMsgNum"
		:bizType="bizType"
		:preToken="token"
		:showWarning="showWarning"
		:warnForNG="warnForNG"
		@goRegAndLogin="goRegAndLogin"
		@regWithFb="goRegWithFb"
		@goFindAccount="goFindAccount"
		@goFinish="goFinish"
		@goSms="goSms"
		@warn="handleWarning">
	</codeVerify>

	<smsSent
		class="page-container"
		v-if="step === 'smsSent'"
		:phone="phone"
		:bizType="bizType"
		:smsNumber="smsNumber"
		:msgContent="msgContent"
		:token="token"
		@goFinish="goFinish"
		@goRegAndLogin="goRegAndLogin"
		@goFindAccount="goFindAccount">
	</smsSent>

	<registFinished
		class="page-container"
		v-if="step === 'regFinish'">
	</registFinished>
</div>
</template>

<script>
import { pagePath } from 'config/pageConfig';
import topNavBar from 'components/navbar/index.vue';
import homeNav from 'components/homeNav';
import registerAndLogin from './registerAndLogin';
import codeVerify from './codeVerify';
import smsSent from './smsSent';
import registFinished from './registFinished';
import registerWithFacebook from './registerWithFacebook';
import { isInApp, isAppLogin } from './tools';

export default {
	name: 'independentLogin',

	components: {
		registerAndLogin,
		codeVerify,
		smsSent,
		registFinished,
		registerWithFacebook,
		topNavBar,
		homeNav
	},

	data () {
		return {
			componentName: 'independentLogin',
			step: 'regAndLog',
			phone: '',
			password: '',
			code: '',
			referral: '',
			bizType: 'REGISTER',
			smsNumber: '',
			msgContent: '',
			remainMsgNum: '',
			token: '',
			resetToken: '',
			showWarning: false,
			warnForNG: '',
			historyStack: ['regAndLog']
		};
	},
	created() {
		if (isInApp() && isAppLogin()) {
			const jumpUrl = URL.getPara('okUrl');
			const path = jumpUrl === '' ? pagePath.home : jumpUrl;
			AppCore.login(path);
		}
	},

	methods: {
		handleBack () {
			if (this.step === 'regAndLog') {
				history.back();
				return;
			}
			const length = this.historyStack.length;
			if (length > 1) {
				this.step = this.historyStack[length - 2];
			} else {
				this.historyStack = [];
				this.step = 'regAndLog';
			}
		},

		handleWarning (value) {
			this.showWarning = value;
		},

		goRegAndLogin () {
			this.step = 'regAndLog';
			this.warnForNG = '';
		},

		goFindAccount (opt) {
			location.href = pagePath.resetPassword;
		},

		goRegWithFb (opt) {
			this.step = 'regWithFb';
		},

		goVeriry (opt) {
			this.phone = opt.phone;
			this.bizType = opt.bizType;
			this.remainMsgNum = opt.remainMsgNum;
			this.showWarning = opt.showWarning;
			this.token = opt.token ? opt.token : this.token;
			this.warnForNG = opt.warnForNG ? opt.warnForNG : '';
			this.step = 'codeVerify';
		},

		goSms (opt) {
			this.phone = opt.phone;
			this.bizType = opt.bizType;
			this.smsNumber = opt.smsNumber;
			this.msgContent = opt.msgContent;
			this.token = opt.token;
			this.step = 'smsSent';
		},

		goFinish () {
			this.step = 'regFinish';
		}
	},
	watch: {
		step (value) {
			const length = this.historyStack.length;
			const index = this.historyStack.indexOf(value);
			if (
				value === 'smsSent' &&
				length > 0 &&
				this.historyStack[length - 1] === 'codeVerify'
			) {
				this.historyStack.pop();
			}
			if (index < 0) {
				this.historyStack.push(value);
			} else {
				this.historyStack.splice(index + 1);
			}
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "iconfont/iconfont-mixin.less";
@import "base/styles/icon.less";

#pageLoading {
	display: none!important;
}

.register-and-login {
  display: block;
  align-items: flex-start;
  justify-content: center;
  width: 100%;

  .head-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
  }
  .m-input-wap-wrapper{
	  border-radius: 2/@rem;
  }
  .m-input-wap-text--icon{
	  margin-right: 16/@rem;
	  color:@linkBlue !important;
  }
  .icon-container {
    width: 100%;
    height: 40/@rem;
    background-color: @fogGray;
    line-height: 40/@rem;
    .m-back-icon-wap::before {
      margin-left: 10/@rem;
      content: "\E620";
      font-family: "iconfont" !important;
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
    padding: 55/@rem 30/@rem 20/@rem;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
