<template lang="html">
	<footer :class="['m-footer', `m-footer--${country}`]">
		<div class="m-footer-header">
			<a class="m-back-top" @click="backToTop">Back to Top</a>
		</div>

		<div class="m-footer-title-wrap">
			<a class="m-footer-title" :href="home">
				<i class="m-icon-logo">
					<img :src="Logo" alt="">
				</i>
			</a>
			<div class="change-region" @click="changeRegion">
				<div class="m-image-wrapper" v-if="logoUrl">
					<img :src="logoUrl">
				</div>
				<p>{{phoneMap[country][1]}}</p>
				<i class="triangle"></i>
			</div>
			<!-- <a :href="concatUrl" class="m-live-chat">Live Chat</a> -->
		</div>

		<ul class="m-footer-tab">
			<li class="m-tab-item"><a :href="`${helpUrl}#/about/terms-and-conditions`">T&C</a></li>
			<li class="m-tab-item"><a :href="`${helpUrl}#/how-to-play`">How to Play</a></li>
			<li class="m-tab-item"><a :href="`${helpUrl}#/about`">About</a></li>
			<li class="m-tab-item"><a :href="`${helpUrl}#/contact-us`">Contact Us</a></li>
		</ul>

		<div class="m-footer-cs">
			<h5>Customer Service</h5>
			<p class="desc">SportyBet's customer service team will dedicatedly cater all your requests anytime anywhere anyhow!</p>
			<ul :class="['except-ng',{'ng':country==='ng'}]">
				<li v-if="isShowTelephone">
					<a :href="`tel:${phoneMap[country][0]}`">
						<div class="m-img-container">
							<img src="./image/phone.png" class="phone"/>
						</div>
						<p>Call Us</p>
						<p>{{phoneMap[country][0]}}</p>
					</a>
				</li>
				<li class="m-item-help">
					<a :href="concatUrl">
						<div class="m-img-container">
							<img src="./image/msg.png"/>
						</div>
						<p>7/24</p>
						<p>Online Help</p>
					</a>
				</li>
				<li @click="goReconciliation" v-if="country!=='ng'">
					<div class="m-img-container">
						<img src="./image/deposit.png" class="deposit"/>
					</div>
					<p>Deposit</p>
					<p>Unsuccessful?</p>
				</li>
			</ul>
		</div>

		<div class="m-footer-info">
			<template v-for="(item, key) in partnerConfig">
				<div
					:class="['m-image-wrapper', `i-${item.key}`]"
					v-if="item.type === 'img'"
				>
					<img :src="item.url" :alt="key">
				</div>
				<i :class="['m-icon', `${item.className}`]" v-if="item.type === 'icon'"></i>
			</template>
			<i class="m-icon m-icon-license"></i>
			<i class="m-icon m-icon-forum"></i>
		</div>

		<div class="m-footer-desc" v-if="descConfig">
			<p
				class="m-rules"
				v-for="(item, index) in descConfig"
				:key="index"
			>{{item}}</p>
		</div>

		<ul class="m-footer-contact" v-if="infos.length">
			<li
				v-for="(item, index) in infos"
				:key="index"
				class="m-con-ways"
			>
				<div v-if="item.type === 'text'" class="m-txt-wrapper">
					<span class="m-txt-l">{{item.label}}</span>
					<span class="m-text-b">{{item.value}}</span>
				</div>

				<template v-if="item.type === 'img'">
					<div class="m-image-wrapper">
						<img :src="item.url" alt="">
					</div>
				</template>
			</li>
		</ul>

		<ul class="m-footer-third">
			<li class="m-icon">
				<a :href="fbUrl">
				<i class="m-icon-fb"></i></a>
			</li>
			<li class="m-icon">
				<a :href="twUrl">
				<i class="m-icon-tw"></i></a>
			</li>
			<li class="m-icon" style="display:none">
				<a :href="insUrl">
				<i class="m-icon-ins"></i></a>
			</li>
		</ul>

		<div class="m-footer-copy">
			<p>© {{year}} SportyBet. All rights reserved.</p>
		</div>
	</footer>
</template>

<script>
import { pagePath, thirdPartyUrl } from 'config/pageConfig';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import Logo from 'base/images/logo.png';
import ChangeRegion from '../../../popDialog/pagelet/changeRegion';
import { getDescConfig, getPartnerConfig, getCountryLogo, getInfoConfig, getConcatUrl } from './config';

let pop = null;
export default {
	components: {
		ChangeRegion,
	},
	data() {
		const now = new Date();
		return {
			helpUrl: pagePath.help,
			fbUrl: thirdPartyUrl.facebook,
			twUrl: thirdPartyUrl.twitter,
			insUrl: thirdPartyUrl.instagram,
			home: pagePath.home,
			year: now.getFullYear(),
			descConfig: getDescConfig(),
			partnerConfig: getPartnerConfig(),
			logoUrl: getCountryLogo(),
			infos: getInfoConfig(),
			country: window.country || 'ke',
			Logo,
			concatUrl: getConcatUrl(),
			phoneMap: {
				ke: ['0207640825', 'Kenya'],
				ng: ['07008888888', 'Nigeria'],
				gh: ['0242426200', 'Ghana']
			},
		};
	},
	computed: {
		isShowTelephone() {
			return window.country !== 'gh';
		}
	},
	methods: {
		goReconciliation() {
			location.href = userCenterUrl.reconciliation;
		},
		changeRegion() {
			pop = this.$dialog({
				title: null,
				button: [],
				content: ChangeRegion,
				contentData: { fixWidth: true } // 调整组件宽度的开关
			}).onBtnClick(btnType => {
				pop.close();
				pop = null;
			});
		},
		backToTop () {
			const scrollElement = document.querySelector('.m-main-mid') || window;

			function step () {
				const progress = Math.ceil(scrollElement.scrollTop / 10);
				scrollElement.scrollTop -= Math.max(progress, 20);
				if (scrollElement.scrollTop > 0) {
					window.requestAnimationFrame(step);
				} else {
					scrollElement.scrollTop = 0;
				}
			}

			window.requestAnimationFrame(step);
		}
	}
};
</script>

<style lang="less">
@import './index.less';
</style>
