<template>
	<div class="get-email-expired-wrapper">
		<img src="./image/expired-banner.jpg" class="banner">
		<section>
			<i class="icon"></i>
			<p>We are sorry, however, the verification link has expired. We will redirect you to the SportyBet homepage in {{timer}} seconds...</p>
			<p>You can also click button blew to go to our homepage.</p>
			<a :href="home"><div class="btn">Sportybet Homepage</div></a>
		</section>
	</div>
</template>

<script>
import { pagePath } from 'config/pageConfig';

export default {
	data() {
		return {
			timer: 5,
			home: pagePath.home
		};
	},
	created() {
		const token = URL.getPara('token');
		if (token) {
			fetch(`/patron/mail/verify/bind?token=${token}`)
			.then(res => res.json()).then(res => {
				if (res.bizCode === 12004) {
					this.hideLoading();
					const interval = setInterval(() => {
						if (this.timer > 0) {
							this.timer--;
						} else {
							clearInterval(interval);
							location.href = pagePath.home;
						}
					}, 1000);
				} else {
					location.href = `https://www.sportybet.com/swdp/pagemaker/sportybet/${window.country}/verified/index.htm`;
				}
			}).catch(e => {
				console.log(e);
				this.hideLoading();
			});
		}
	},
	methods: {
		hideLoading() {
			document.querySelector('#pageLoading').style.display = 'none';
		},
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";
.get-email-expired-wrapper {
	.banner {
		width: 100%;
	}
	section {
		padding: 54/@rem 30/@rem;
		font-size: 14/@rem;
		.icon {
			.m-icon-exclamation();
			color: @darkGray;
			text-align: center;
			margin-bottom: 36/@rem;
			display: block;
			&:before {
				font-size: 36/@rem;
			}
		}
		p {
			margin-bottom: 25/@rem;
		}
		.btn {
			display: block;
			line-height: 40/@rem;
			text-align: center;
			color: @green;
			font-weight: bold;
			border: 1/@rem solid @green;
		}
	}
	
}
</style>
