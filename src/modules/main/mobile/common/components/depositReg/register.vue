<template>
<div class="deposit-register-and-login">
	<regist class="page-container" v-show="step === 'regist'" @goVeriry="goVeriry" @success="onSuccess" :btnLabel="btnLabel"/>
	<codeVerify class="page-container" v-if="step === 'codeVerify'" :warnForNG="warnForNG" :phone="phone" :preToken="token" @goRegist="goRegist" @goSms="goSms"  @success="onSuccess" :btnLabel="verifyLabel || btnLabel"/>
	<smsSent class="page-container" v-if="step === 'smsSent'" :phone="phone" :smsNumber="smsNumber" :msgContent="msgContent" :token="token" :btnLabel="btnLabel" @goRegist="goRegist" @success="onSuccess"></smsSent>
</div>
</template>

<script>
import regist from './regist';
import codeVerify from './codeVerify';
import smsSent from './smsSent';

export default {
	name: 'register',
	props: {
		btnLabel: String,
		verifyLabel: String

	},
	components: {
		regist,
		codeVerify,
		smsSent,
	},

	data() {
		return {
			step: 'regist',
			phone: '',
			password: '',
			code: '',
			referral: '',
			smsNumber: '',
			warnForNG: '',
			msgContent: '',
			token: '',
		};
	},

	methods: {
		goVeriry(opt) {
			this.phone = opt.phone;
			this.token = opt.token ? opt.token : this.token;
			this.warnForNG = opt.warnForNG ? opt.warnForNG : this.warnForNG;
			this.step = 'codeVerify';
		},
		goSms(opt) {
			this.phone = opt.phone;
			this.smsNumber = opt.smsNumber;
			this.msgContent = opt.msgContent;
			this.token = opt.token;
			this.step = 'smsSent';
		},
		goRegist() {
			this.step = 'regist';
			this.warnForNG = '';
		},
		onSuccess(payload) {
			this.$emit('success', payload);
		}
	},
	created() {

	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'iconfont/iconfont-mixin.less';
@import 'base/styles/icon.less';

.deposit-register-and-login {
    display: block;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-color: transparent;
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
        padding: 6/@rem 30/@rem 20/@rem;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }
}
</style>
