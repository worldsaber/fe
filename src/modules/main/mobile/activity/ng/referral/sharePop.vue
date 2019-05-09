<template>
<div class="container">
	<h1>SHARE</h1>
	<i class="m-icon-close" data-action="close" data-ret="close"></i>
	<div class="inner-con">
		<a :href="smsInv" class="wrapper">
			<img src="./image/sms.png">
			<div class="text">SMS</div>
		</a>
		<a class="wrapper" :href="`whatsapp://send?text=${encodeInvitation}`" data-action="share/whatsapp/share">
			<img src="./image/whatsapp.png">
			<div class="text">WhatsApp</div>
		</a>
		<div class="wrapper" id="copy-link" @click="copyLink">
			<img src="./image/link.png">
			<div class="text">Copy Link</div>
		</div>
	</div>
</div>
</template>

<script>
import Clipboard from 'clipboard';
import cookie from 'packages/lib/utils/cookie.js';

export default {
	data () {
		return {
			currency: window.currency || 'NGN',
			referralCode: 'R' + cookie.get('phone'),
			invitation: '',
			smsInv: '',
			encodeInvitation: '',
			protocol: location.protocol
		};
	},
	created () {
		this.invitation = `Hi! Have you heard of SportyBet?! It's a whole new concept at Betting! Follow me and give it a try! UP to ${this.currency} 10000 Discount gifts on first deposit! Check ${this.protocol}//www.sportybet.com/ng/?referralCode=${this.referralCode}`;
		if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
			this.smsInv = `sms:&body=${this.invitation}`;
		} else {
			this.smsInv = `sms:?body=${this.invitation}`;
		}
		this.encodeInvitation = encodeURI(this.invitation);
	},
	methods: {
		copyLink () {
			const referralCode = 'R' + cookie.get('phone');
			const protocol = location.protocol;
			new Clipboard('#copy-link', {
				text () {
					return `Hi! Have you heard of SportyBet?! It's a whole new concept at Betting! Follow me and give it a try! UP to ${window.currency} 10000 Discount gifts on first deposit! Check ${protocol}//www.sportybet.com/ng/?referralCode=${referralCode}`;
				}
			});
			this.$toast('Successfully copied!');
		},
	}
};
</script>

<style lang="less">
@import "base/styles/variable.less";
@import "base/styles/mixin.less";
@import "base/styles/icon.less";
body, html {
	font-family: AvenirNext, Arial, sans-serif
}
.container {
  color: #343a45;
}
h1 {
  position: relative;
  top: 5/@rem;
  font-size: 14/@rem;
  font-weight: 900;
  line-height: 1.39;
  text-align: center;
}
.inner-con {
  display: flex;
  flex-flow: row nowrap;
  margin-top: 30/@rem;
  margin-bottom: 36/@rem;
}
.wrapper {
  flex: 1;
  display: flex;
  flex-flow: column;
  align-items: center;
}
img {
  width: 38/@rem;
  height: 38/@rem;
}
a,
.text {
  font-size: 10/@rem;
  line-height: 1.58;
  color: #6c6c6c;
}
a:hover,
a:active,
a:visited {
  text-decoration: none;
}
.text {
  margin-top: 11/@rem;
}
.m-icon-close {
  cursor: pointer;
  position: relative;
  color: #8c8c8c;
  left: 220/@rem !important;
  top: -25/@rem !important;
  .m-icon-close();
}
</style>
