<template>
	<div class="m-contact-us">
		<div class="m-contact-item">
			<div class="m-contact-title">Need Help?</div>
			<div class="m-contact-desc">SportyBet‘s Customer service Team will dedicatedly cater all your requests anytime anywhere anyhow！</div>
		</div>
		<div class="m-contact-item m-chat-item">
			<div class="m-contact-title">Live Chat (24 Hours)</div>
			<div class="m-contact-chat">
				<a href="javascript:;" @click="openLiveChat"><i class="m-icon-chatx"></i>Live Chat</a>
			</div>
		</div>
		<div class="m-contact-item" v-if="isShowTelephone">
			<div class="m-contact-title">Telephone</div>
			<div class="m-contact-info">{{contacts.tel}}</div>
		</div>
		<div class="m-contact-item">
			<div class="m-contact-title">Email</div>
			<div class="m-contact-info">{{contacts.email}}</div>
		</div>
		<!-- ng 不显示 -->
		<div class="m-contact-item" v-if="isShowDepositUnsuccess">
			<div class="m-contact-title">Deposit unsuccessful?</div>
			<a class="m-link-btn" :href="manualCheck">Check transaction status</a>
		</div>
	</div>
</template>

<script>
import { pagePath } from 'config/pageConfig';
import helpContacts from '../js/helpConfig.js';

export default {
	name: 'contact-us',
	data() {
		return {
			manualCheck: pagePath.manualCheck,
			contacts: helpContacts[window.country],
			country: window.country || 'ke'
		};
	},
	computed: {
		isShowDepositUnsuccess() {
			return (window.country || 'ke') !== 'ng';
		},
		isShowTelephone() {
			return window.country !== 'gh';
		}
	},
	methods: {
		openLiveChat() {
			if (window.zE) {
				window.zE(() => {
					// window.zE.hide();
					window.zE.activate();
				});
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import 'base/styles/icon.less';
@import 'base/styles/variable.less';

body {
	width: 100%;
}

.m-icon-chatx {
	.m-icon-chatx();
}

.m-contact-us {
	padding: 26/@rem 3/@rem 0 15/@rem;

	.m-contact-item {
		margin-bottom: 19/@rem;

		&.m-chat-item {
			margin: 26/@rem 0 25/@rem;
		}

		.m-contact-title {
			font-size: 16/@rem;
			font-weight: bold;
			line-height: 1.05;
			margin-bottom: 5/@rem;
		}
		.m-contact-info {
			font-size: 14/@rem;
			line-height: 1.33;
			color: @darkGray;
		}
		.m-contact-desc {
			margin-top: 13/@rem;
			font-size: 12/@rem;
			line-height: 1.33;
			color: @darkGray;
		}
		.m-contact-chat {
			margin-top: 12/@rem;

			& > a {
				display: block;
				width: 206/@rem;
				height: 50/@rem;
			    line-height: 50/@rem;
			    border-radius: 4px;
			    color: @white;
			    font-size: 16px;
				text-align: center;
				background-image: linear-gradient(to bottom, #549c36, #009a3e);


				& > .m-icon-chatx {
					margin-right: 15/@rem;
					&:before {
						font-size: 20px;
						vertical-align: top;
		          	}
				}
		  	}
		}

		.m-link-btn {
			margin-top: 11/@rem;
			display: inline-block;
			border: 1px solid @green;
			border-radius: 2/@rem;
			height: 45/@rem;
			line-height: 45/@rem;
			box-sizing: border-box;
			color: @green;
			font-size: 14/@rem;
			font-weight: bold;
			min-width: 206/@rem;
			text-align: center;
		}
  	}
}
</style>

