<template lang="html">
  <div class="m-extra-live">
	  <div class="m-extra-blank"/>
	  <div class="extra-title-wrap">
		<div class="m-extra-title m-background">Extra Lives</div>
	  	<div class="m-extra-title">Extra Lives</div>
	  </div>
	  <div class="m-extra-param">
	  	<div class="m-extra-point"/>
		<p class="m-extra-text">Wrong answer? Keep playing with an Extra Life</p>
	  </div>
	  <div class="m-extra-param">
	  	<div class="m-extra-point"/>
		<p class="m-extra-text">Get one every time a new SportyBet user signs up with your invitation</p>
	  </div>
	  <div class="m-extra-param">
	  	<div class="m-extra-point"/>
		<p class="m-extra-text">The Extra Lives can be used twice per game, excepts on the last question</p>
	  </div>
	  <div class="m-share-wrap">
	  	<div class="m-share-title">Share Quiz to get Extra Lives!</div>
		<div v-if="mode === 'app'" class="m-share-btn" @click="share">Share Now</div>
		<div v-else class="m-share-btn-wrap">
			<div class="m-fb" @click="share2fb">
			   <img class="m-icon m-icon-fb" src="../image/facebook-36.svg">
			   <span class="m-desc">Facebook</span>
			</div>
			<a class="m-wapp" @click="share2whatapp" :href="`whatsapp://send?text=${getShareText}`" data-action="share/whatsapp/share">
				<img class="m-icon m-icon-wapp" src="../image/whatsapp-36.svg">
				<span class="m-desc">Whatsapp</span>
			</a>
		</div>
	  </div>
  </div>
</template>

<script>
import cookie from 'storage/cookie';
import { mapState } from 'vuex';
import appCore from 'appCore';
import { domain, protocol } from 'config/pageConfig';
import { shareConfig } from '../js/config';

export default {
	data() {
		return {
			mode: 'wap',
			currentUrl: `${protocol}//${domain}${window.v_router.options.base}?referralCode=Q${cookie('phone')}&from=Q${cookie('phone')}`
		};
	},
	created() {
		if (appCore.getAppName() === 'sportybet') {
			this.mode = 'app';
		} else {
			this.mode = 'wap';
		}
	},
	computed: {
		...mapState('issue', [
			'country'
		]),
		getShareText() {
			const shares = `${this.shareText}at: ${this.currentUrl}`;

			return `${encodeURI(shares)}`;
		},
		shareText() {
			const country = this.country;

			return shareConfig[country];
		}
	},
	methods: {
		share() {
			if (appCore.getAppName() === 'sportybet') {
				appCore.share({
					title: 'share',
					url: this.currentUrl,
					// url: `${this.shareText}at: ${this.currentUrl}`,
					hideCopy: 'true',
					// quote: this.getShareText,
				});
				appCore.shareNow();
			}
		},
		share2whatapp () {
			const loc = location.href;
			setTimeout(() => {
				if (location.href === loc && !document.hidden) {
					this.$dialog.alert('WhatsApp might not be installed on your phone, install it and try agian.', ['OK']);
				}
			}, 2000);
		},
		share2fb() {
			if (window.FB) {
				FB.ui({
					method: 'share',
					display: 'popup',
					href: this.currentUrl,
					// 去掉文案， 为了显示大图
					// quote: this.shareText
				}, response => {
					console.log('cancel share!');
				});
			}
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-extra-live {
	position: absolute;
	min-height: 100%;
	background-image: linear-gradient(to bottom, #2b0098, #7c2bb7);
	padding-bottom: 32/@rem;
	.m-extra-blank {
		height: 50/@rem;
	}
	
	.extra-title-wrap {
		height: 58/@rem;
		position: relative;
		.m-extra-title {
			position: absolute;
			width: 100%;
			bottom: 0;
			z-index: 10;
			text-align: center;
			font-size: 30/@rem;
			font-weight: 900;
			line-height: 35/@rem;
			color: @midYellow;
			&.m-background {
				z-index: 2;
				font-size: 50/@rem;
				opacity: 0.1;
				color: @white;
				line-height: 50/@rem;
			}
		}
	}
	
	.m-extra-param {
		display: flex;
		padding: 0 23/@rem;
		margin-top: 25/@rem;
		align-items: flex-start;
		justify-content: center;
		.m-extra-point {
			flex: 0 0 auto;
			margin-top: 7/@rem;
			margin-right: 8/@rem;
			width: 6/@rem;
			height: 6/@rem;
			border-radius: 50%;
			background-color: @white;
			opacity: 0.2;
		}
		.m-extra-text {
			flex: 1 1 auto;
			font-size: 16/@rem;
			font-weight: bold;
			line-height: 20/@rem;
			color: @white;
		}
	}
	
	.m-share-wrap {
		margin: 80/@rem 20/@rem 0 20/@rem;
		padding-top: 20/@rem;
		padding-bottom: 35/@rem;
		border-radius: 10/@rem;
		background-color: #7535b7;
		.m-share-title {
			margin-bottom: 24/@rem;
			font-size: 16/@rem;
			line-height: 32/@rem;
			font-weight: bold;
			text-align: center;
			color: @white;
		}
		.m-share-btn {
			margin: 0 60/@rem;
			line-height: 40/@rem;
			border-radius: 20/@rem;
			font-size: 16/@rem;
			font-weight: 900;
			color: #8c4500;
			text-align: center;
			background-color: #ffa600;
			box-shadow: 0 4/@rem 10/@rem 0 rgba(255, 166, 0, 0.5);
		}
		.m-share-btn-wrap {
			display: flex;
			align-items: center;
			justify-content: center;
			.m-fb {
				flex: 0 0 auto;
				text-align: center;
				margin-right: 66/@rem;
			}
			
			.m-wapp {
				flex: 0 0 auto;
				text-align: center;
			}
			
			.m-desc {
				margin-top: 9/@rem;
				line-height: 14/@rem;
				font-size: 12/@rem;
				text-align: center;
				color: @white;
				display: block;
			}
			.m-icon-fb {
				cursor: pointer;
				width: 36/@rem;
				height: 36/@rem;
			}

			.m-icon-wapp {
				cursor: pointer;
				width: 36/@rem;
				height: 36/@rem;
			}
		}
	}
}
</style>
