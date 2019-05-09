<template>
<div class="register-and-login">
	<div class="head-container">
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

	<findAccount class="page-container" v-if="step === 'findAccount'" @goVeriry="goVeriry" @goSms="goSms"></findAccount>

	<passwdReset class="page-container" v-if="step === 'pwdReset'" :phone="phone" :resetToken="resetToken" :bizType="bizType"  @goFindAccount="goFindAccount">
	</passwdReset>

	<codeVerify class="page-container" v-if="step === 'codeVerify'" :phone="phone" :preToken="token" :showWarning="showWarning" :warnForNG="warnForNG" :remainMsgNum="remainMsgNum" :bizType="bizType" @goPasswdReset="goPasswdReset" @goFindAccount="goFindAccount" @goSms="goSms" @warn="handleWarning">
	</codeVerify>

	<smsSent class="page-container" v-if="step === 'smsSent'" :phone="phone" :bizType="bizType" :smsNumber="smsNumber" :msgContent="msgContent" :token="token" @goPasswdReset="goPasswdReset" @goFindAccount="goFindAccount">
	</smsSent>

</div>
</template>

<script>
import topNavBar from 'components/navbar/index.vue';
import homeNav from 'components/homeNav';
import passwdReset from './passwdReset';
import codeVerify from './codeVerify';
import smsSent from './smsSent';
import findAccount from './findAccount.vue';

export default {
	name: 'forgetPassword',

	components: {
		passwdReset,
		codeVerify,
		smsSent,
		findAccount,
		topNavBar,
		homeNav
	},
	data () {
		return {
			step: 'findAccount',
			phone: '',
			password: '',
			code: '',
			referral: '',
			bizType: 'PASSWORD_RESET',
			smsNumber: '',
			msgContent: '',
			remainMsgNum: '',
			token: '',
			showWarning: false,
			warnForNG: '',
			historyStack: [],
			isPop: true
		};
	},
	mounted () {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
	},

	methods: {
		handleBack () {
			if (this.step === 'findAccount') {
				// close popup
				history.back();
				return;
			}
			if (this.step === 'pwdReset') {
				history.go(0);
				return;
			}
			const length = this.historyStack.length;
			if (length > 1) {
				this.step = this.historyStack[length - 2];
			} else {
				this.historyStack = [];
				this.step = 'findAccount';
			}
		},
		handleWarning (value) {
			this.showWarning = value;
		},

		goPasswdReset (opt) {
			this.phone = opt.phone;
			this.resetToken = opt.resetToken;
			this.step = 'pwdReset';
		},

		goFindAccount (opt) {
			this.step = 'findAccount';
			this.warnForNG = '';
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
	},
	created () {
		window.__debug__ && console.log(this);
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "iconfont/iconfont-mixin.less";
@import "base/styles/icon.less";

.register-and-login {
  display: block;
  align-items: center;
  justify-content: center;
  width: 100%;

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
	padding: 107/@rem 30/@rem 20/@rem;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
  }
}
</style>
