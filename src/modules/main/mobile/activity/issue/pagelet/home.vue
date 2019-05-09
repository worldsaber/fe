<template lang="html">
	<div class="home-wrap">
	<section class="adv-home"><img v-if="false && topAdvBanner" :src="topAdvBanner"/></section>
	<section class="issue-home">
		<section class="m-bg-wrapper" v-if="false">
			<div class="m-currency">{{showCurrencyOrigin}}</div>
		</section>
		<ul class="issue-advert-wrap" v-if="false">
			<li class="issue-advert-item" v-for="(advert, index) in quizShowMainBanner" :key="index">
				<img class="issue-advert-image" :src="advert.imgUrl" />
			</li>
		</ul>

		<template v-if="loadError">
			<div class="m-error-wrapper">
				<div>
					<span class="m-error-msg">Failed to load game data.Please refresh the page.</span>
					<div class="m-btn" @click="loadData">Refresh</div>
				</div>
			</div>
		</template>

		<template v-else-if="pageLoading">
			<div class="m-error-wrapper">
				<div>
					<i class="m-icon-loading"></i>
					<span class="m-text-msg">Loading...</span>
				</div>
			</div>
		</template>

		<template v-else>
			<section class="m-title-bar">
				<span class="m-title-text" v-show="getTitle">{{getTitle}}<img class="title-ball" src="../image/football.png"/></span>
			</section>

			<section class="m-round">
				<div :class="[
					'm-item',
					'l-left',
					{
						'l-left-fix': status === 4
					}
				]">
					<div class="m-title">Next Round<template v-if="status === 4"> Starts in</template></div>
					<div class="m-main" v-html="getRoundInfo"></div>
				</div>

				<div class="m-item l-right">
					<div class="m-title">Prize Pool</div>
					<div :class="[
						'm-main',
						{
							'm-main-fix': showPrizeInfo
						}
					]">
						<span class="m-currency" v-if="showPrizeInfo">{{showCurrencyOrigin}}</span>
						<span class="m-total">{{getPrizeInfo}}</span>
					</div>
				</div>
			</section>

			<ActionBar />

		</template>

		<section class="m-more">
			<div class="more-item" @click="jmpNationRank">
				<img :src="require('../image/against.svg')" alt="" class="m-icon-against" />
				<span>National Rankings</span>
			</div>
			<div class="more-item" @click="seeRules">Activity Rules</div>
			<div class="more-item" v-if="false" @click='seeWinners'>Smartphone Winners</div>
		</section>
	</section>
	</div>
</template>

<script>
import cookie from 'storage/cookie';
import { mapState, mapMutations, mapActions } from 'vuex';
import dateFormat from 'kernel/js/dateFormat';
import { TEN_MINUTES } from 'store/issue/commonFun';
import { UPDATE_HOME_STATUS } from 'store/issue/mutationTypes';
import { EventBus } from 'kernel/js/eventBus';

import CommonMixin from '../js/commonMixin';
import { getRulersUrl, getWinnersUrl } from '../js/config';
import { formatTime, getAdvertInArray, getAdvertInObject } from '../js/commonFun';
import ActionBar from './actionBar.vue';
import signUpDialog from './signUpDialog.vue';

export default {
	components: {
		ActionBar
	},

	mixins: [
		CommonMixin
	],

	data() {
		return {
			indexTime: {},
			status: -1,
			timer: null,
			loadError: false,
			pageLoading: false
		};
	},
	computed: {
		...mapState('issue', [
			'isLogin',
			'homeStatus',
			'baseInfo',
			'showCurrencyOrigin',
			'reqLoading',
			'deltaTime',
			'adConfig',
			'smartPhoneUrl'
		]),
		getDate() {
			const baseInfo = this.baseInfo || {},
				startTime = baseInfo.startTime; // + this.deltaTime;

			if (startTime) {
				return dateFormat.format(startTime, 'DD-MM');
			}

			return '';
		},
		getTime() {
			const baseInfo = this.baseInfo || {},
				startTime = baseInfo.startTime; // + this.deltaTime;

			if (startTime) {
				return dateFormat.format(startTime, 'HH:mm');
			}

			return '';
		},
		getTitle() {
			const baseInfo = this.baseInfo || {};

			if (this.status !== 2 && baseInfo.theme) {
				return baseInfo.theme;
			}

			return '';
		},
		getPrizeInfo() {
			const baseInfo = this.baseInfo || {};

			if (this.status === 2 || !baseInfo.prizeAmount) {
				return '-';
			}

			return `${baseInfo.showPrizeAmount}`;
		},
		showPrizeInfo() {
			return this.getPrizeInfo !== '-';
		},
		getRoundInfo() {
			const status = this.status;

			switch (status) {
			case 1:
				return '<span class="m-going m-t-tips">ONGOING!</span>';
			case 2:
				return '<span class="m-coming m-t-tips">Coming  Soon!</span>';
			case 3:
				return [
					`<span class="m-date">${this.getDate}</span>`,
					`<span class="m-time">${this.getTime}</span>`
				].join('');
			case 4:
				return [
					'<span class="m-timer">',
					`<span name="m">${this.indexTime.minute || '0'}</span>`,
					`<span name="s">${this.indexTime.second || '0'}</span>`,
					'</span>'
				].join('');
			default:
				return '<span>-</span>';
			}
		},
		quizShowMainBanner() {
			// 主logo 静态
			const sportyAdvert = [{
				imgUrl: require('../image/sportybet.png'),
			}];

			const banner = this.adConfig.quizShowMainBanner || {};
			const adverts = getAdvertInArray(banner);
			return [...sportyAdvert, ...adverts];
		},
		topAdvBanner() {
			const banner = this.adConfig.quizShowMainBanner || {};
			const adverts = getAdvertInObject(banner);
			return adverts ? adverts.imgUrl : '';
		}
	},
	watch: {
		status(val, old) {
			this.updateHomeStatus(val);
		},
		homeStatus(val, oldVal) {
			if (this.status !== val) {
				this.status = val;
				this.startTimer();
			}
		},
		reqLoading(val, oldVal) {
			if (!val) {
				this.pageLoading = false;
			}
		}
	},
	methods: {
		...mapMutations('issue', {
			updateHomeStatus: UPDATE_HOME_STATUS
		}),
		...mapActions('issue', [
			'getBaseInfo',
			'getIssueAd',
			'getSmartPhoneUrl'
			// 'getParticipantsCount'
		]),
		loadData() {
			if (this.pageLoading) {
				return;
			}

			this.pageLoading = true;
			this.loadError = false;
			this.getBaseInfo().then(null, errorInfo => {
				const { msg = '' } = errorInfo || {};

				if (msg) {
					this.loadError = true;
				}
			});
		},
		jmpNationRank() {
			this.$router.push({ name: 'nationRank' });
		},
		startTimer() {
			if (this.timer) {
				return;
			}

			if ([3, 4].includes(this.status)) {
				let now = Date.now(),
					dis;
				const baseInfo = this.baseInfo || {},
					startTime = baseInfo.startTime + this.deltaTime;

				dis = startTime - now;

				let count = 0;

				if (this.status === 4) {
					this.indexTime = formatTime(dis);

					// 0分0秒，直接改状态
					if (this.indexTime.minute === 0 && this.indexTime.second === 0) {
						this.status = 1;
					}
				}

				this.timer = setInterval(() => {
					now = Date.now();
					dis = startTime - now;

					if (dis >= TEN_MINUTES) {
						return;
					}

					if (dis <= 0) {
						clearInterval(this.timer);
					}

					if (dis === 0) {
						// onGoing
						this.status = 1;
						return;
					}

					if (dis < TEN_MINUTES && dis > 0) {
						(this.status !== 4) && (this.status = 4);
						!count && (this.indexTime = formatTime(dis));
						++count;
						count %= 10;
					}

					// 0分0秒，直接改状态
					if (this.indexTime.minute === 0 && this.indexTime.second === 0) {
						this.status = 1;
					}
				}, 100);
			}
		},
		seeRules() {
			location.href = getRulersUrl();
		},
		seeWinners() {
			const url = this.smartPhoneUrl || getWinnersUrl();
			let ts = +new Date();
			ts = Math.floor(ts / 3600000); // 每小时
			location.href = `${url}?ts=${ts}`;
		},
		detectReferCode() {
			const referralCode = cookie('referralCode');
			if (!this.isLogin && referralCode && referralCode.substr(0, 1) === 'Q') {
				this.$dialog({
					title: null,
					content: signUpDialog,
					button: []
				});
			}
		},
		addLives () {
			return fetch('/promotion/v1/activities/quiz/getExtraLives', {
				methods: 'GET'
			});
		}
	},
	created() {
		const rbCode = URL.getPara('rbCode');
		if (rbCode && this.isLogin) {
			this.addLives().then(() => {
				this.loadData();
			});
		} else {
			this.loadData();
		}
		this.getIssueAd();
		this.getSmartPhoneUrl();
	},

	mounted() {
		this.status = this.homeStatus;

		// if (this.homeStatus !== 2) {
		// 	this.getParticipantsCount();
		// }

		this.startTimer();
		EventBus.$on('refresh-home', () => {
			this.loadData();
		});

		this.detectReferCode();
	},

	destroyed() {
		clearInterval(this.timer);
	}
};
</script>

<style lang="less">
@import '../style/home.less';
.issue-advert-wrap{
	display: flex;
	margin: -36/@rem 0 18/@rem;
	justify-content: center;
	align-items: center;
}
.issue-advert-item{
	position: relative;
	margin-right: 15/@rem;
	padding-right: 15/@rem;
	&::after{
		content: 'x';
		position: absolute;
		right: -3/@rem;
		color: #FFF;
		font-size: 10/@rem;
	}
	&:last-child{
		margin-right: 0;
		padding-right: 0;
		&::after{
			display: none;
		}
	}
}
</style>
