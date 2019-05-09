<template lang="html">
<div :class="['m-cup-home', countryStyle]" >
	<div class="m-error-wrapper" v-if="loadError">
		<div>
			<span class="m-error-msg">Failed to load game data.Please refresh the page.</span>
			<div class="m-btn" @click="loadData">Refresh</div>
		</div>
	</div>
	<div class="m-error-wrapper" v-else-if="pageLoading || homeStatus === -1">
		<div>
			<i class="m-icon-loading"></i>
			<span class="m-text-msg">Loading...</span>
		</div>
	</div>

    <template v-else>
		<div class="m-event-predict">
			<div class="m-s-eventname">{{eventName}}</div>
			<router-link class="m-s-event-link" :to="matchUrl" v-if="matchUrl">Matches Info.
				<span class="m-event-arrow"></span>
			</router-link>
		</div>
		<template v-if="homeStatus === 1">
			<div class="m-steps">
				<div class="m-s-item m-score">
					<div class="m-s-title">
						<i class="m-icon-dot"></i>
						<div class="m-t-wrapper">
							<div class="m-title">Step <span class="m-t-big">1</span></div>
							<div class="m-desc">Guess and Enter the Final Score during Regular Time</div>
						</div>
					</div>
					<div class="m-s-main">
						<div class="m-s-top">
							<div class="m-s-event-name m-home-event-name">{{getEventInfo.homeTeamName}}</div>
							<img class="event-icon home-icon" :src="getEventInfo.homeTeamIcon" alt="">
							<span class="m-s-vs">vs</span>
							<img class="event-icon away-icon" :src="getEventInfo.awayTeamIcon" alt="">
							<div class="m-s-event-name">{{getEventInfo.awayTeamName}}</div>
						</div>
						<div class="m-s-bottom">
							<af-input class="m-team" type="tel" v-model="homeScore"> </af-input>
							<div class="m-split"></div>
							<af-input class="m-team" type="tel" v-model="awayScore"> </af-input>
						</div>
					</div>
				</div>
			</div>
			<div class="m-steps">
				<div class="m-s-item m-phone">
					<div class="m-s-title">
						<i class="m-icon-dot"></i>
						<div class="m-t-wrapper">
							<div class="m-title">Step <span class="m-t-big">2</span></div>
							<div class="m-desc mobile">Enter your Mobile Number</div>
						</div>
					</div>
					<div class="m-s-main">
						<div class="m-mobile-wrapper">
							<af-input class="m-mobile" type="tel" v-model="phone" icon="delete" :iconClick="clearPhone" :error="isPhoneError">
					            <span slot="prepend">{{countryCode}}</span>
					        </af-input>
							<div class="m-error" v-show="isPhoneError">
								<p>{{phoneError}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="m-steps">
				<div class="m-s-item m-share">
					<div class="m-s-title">
						<i class="m-icon-dot"></i>
						<div class="m-t-wrapper">
							<div class="m-title">Step <span class="m-t-big">3</span></div>
							<div class="m-desc">{{shareTitle}}</div>
						</div>
					</div>
					<div class="m-s-main">
						<div class="m-share-btn" @click="handleShare">
				            <!-- <i class="m-icon-fb"></i> -->
				            <i class="m-icon-loading" v-if="shareBtnLoading"></i>
				            <span>{{shareBtnLoading ? 'Loading' : 'Share as "Public"'}}</span>
				        </div>
					</div>
				</div>
			</div>
		</template>
		<div class="m-steps" v-else>
			<div class="m-s-item">
				<div class="m-none-title">Another Match Coming Soon!</div>
				<div class="m-none-score-wrap">
					<div class="icon-wrap">?</div>
					<span class="team-name">Team A</span>
					<div class="vs-line"/>
					<span class="team-name">Team B</span>
					<div class="icon-wrap">?</div>
				</div>
				<div class="check-more-promotions" @click="jump">{{jumpText}}</div>
			</div>
		</div>
    </template>
	<div class="terms-wrap">
		<span class="m-route-link" :to="termsUrl" @click="goToTerms">
			Terms and Conditions <span class="arrow-right"></span>
		</span>
	</div>
	<!-- <Rulers /> -->
	<Share v-if="isShowShare" :shareCfg="shareCfg" @cancel-share="handleCancelShare" @close-share="handleCloseShare" @succ-share="handleSuccShare"></Share>
</div>

</template>

<script>
import { objType } from 'utils';
import {
	mapState,
	mapGetters,
    mapActions,
    mapMutations
}
from 'vuex';
import { AfInput } from 'components/input';
import {
    UPDATE_REQUEST_STATUS,
	UPDATE_SHARED_INFO
}
from 'store/worldCup/mutationTypes';
import { showCurrency } from 'config/currencyConfig';
import 'components/share';
import appCore from 'appCore';
import {
	fixPhone
} from 'base/js/utils';
import { domain, protocol, pagePath } from 'config/pageConfig';
import { cookie } from 'storage';

import ExpirePopDialog from './expirePop.vue';
import SharedSucPop from './shareSucPop.vue';
import SharedPop from './sharedPop.vue';
import ShareConfirm from './shareConfirm.vue';
import ShareCancel from './shareCancel.vue';
import { isDuringSpecialPeriod } from '../js/util.js';
import { shareTitle } from '../js/config.js';

export default {
	components: {
		// Rulers,
		ExpirePopDialog,
		SharedSucPop,
		SharedPop,
		ShareConfirm,
		AfInput,
		ShareCancel
	},
	data() {
		let phone = '';
		if (window.loginStatus) {
			phone = cookie('phone');
		}

		return {
			country: window.country,
			showCurrency,
			phone,
			phoneError: '',
			isReg: false,
			shareBtnLoading: false,
			isShared: 0,
			isFromFb: location.search.split('?')[1] ? location.search.split('?')[1].split('&').includes('from=fb') : '',
			loadError: false,
			pageLoading: false,

			homeScore: '0',

			awayScore: '0',

			shareSucDialog: null,

			currentUrl: `${protocol}//${domain}${window.v_router.options.base}`,
			// 分享配置
			shareCfg: {
				url: '',
				hashtag: '',
			},
			// 是否已显示分享
			isShowShare: false,
			// 是否可以二次分享
			allowCancel: false,
			shareTitle: shareTitle(),
			// isDuringSpecialPeriod: Date.now() > Date.parse(new Date('2018/12/17')) && Date.now() < Date.parse(new Date('2018/12/23 23:59:59'))
		};
	},
	computed: {
		...mapState('worldCup', [
			'homeStatus',
			'verifiedPhone',
			'countryCode',
			'reqLoading',
			'sharedInfo',
			'actConfig'
		]),
		...mapGetters('worldCup', [
			'getEventInfo',
			// 'getSharedInfo'
		]),
		countryStyle() {
			return isDuringSpecialPeriod ? `m-cup-${this.country}-special-day` : `m-cup-${this.country}`;
		},
		isPhoneError() {
			return !!this.phoneError;
		},
		shareScore() {
			return `${this.homeScore} - ${this.awayScore}`;
		},
		worldCupPromtUrl() {
			return this.actConfig.promotions;
		},
		jumpUrl() {
			return this.actConfig.gapButtonUrl;
		},
		jumpText() {
			return this.actConfig.gapButtonText;
		},
		bonusUrl() {
			return this.actConfig.bonus;
		},
		footballUrl() {
			return pagePath.preFootball;
		},
		// 赛事名称
		eventName() {
			const event = this.getEventInfo;
			return `${event.categoryName || ''} ${event.tournamentName || ''}`;
		},
		// 赛事bet链接；目前只有足球
		matchUrl() {
			return {
				name: 'match'
			};
		},
		termsUrl() {
			return {
				name: 'terms'
			};
		},
		bigPrize() {
			const prizeMap = {
				ke: '5,000',
				ng: '20,000',
				gh: '300'
			};
			return prizeMap[this.country];
		},
		bigWinnerRulesUrl() {
			const config = this.actConfig || {};
			return config.bigWinnerRules;
		}
	},
	watch: {
		phone(val) {
			let temp = val.replace(/\D/g, '');

			temp = temp.length > 18 ? temp.slice(0, 18) : temp;
			this.phone = temp;
			this.phoneError && (this.phoneError = '');
		},
		homeScore(val) {
			let temp = val.replace(/\D/g, '');

			if (temp.length >= 2) {
				temp = temp.replace(/^0+/g, '');
				temp = temp.length >= 2 ? temp.slice(0, 2) : temp;
			}

			this.homeScore = temp;
		},
		awayScore(val) {
			let temp = val.replace(/\D/g, '');

			if (temp.length >= 2) {
				temp = temp.replace(/^0+/g, '');
				temp = temp.length >= 2 ? temp.slice(0, 2) : temp;
			}

			this.awayScore = temp;
		},
		reqLoading(val) {
			if (!val) {
				this.pageLoading && (this.pageLoading = false);
				this.shareBtnLoading && (this.shareBtnLoading = false);
			}
		}
	},
	methods: {
		...mapActions('worldCup', [
			'validatePhone',
			'share',
			'getBaseInfo'
		]),
		...mapMutations('worldCup', {
			updateReqStatus: UPDATE_REQUEST_STATUS,
			updateSharedInfo: UPDATE_SHARED_INFO
		}),

		clearPhone() {
			this.phone = '';
		},

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
		handleShare() {
			if (!this.homeScore || !this.awayScore) {
				this.handleError({
					type: 'toast',
					msg: 'Please enter a score'
				});
				return;
			}

			if (this.shareBtnLoading) {
				return;
			}

			let phone = this.phone;

			if (!phone) {
				this.phoneError = 'Mobile number is required.';
				return;
			}
			// 重置 是否可以取消状态
			this.allowCancel = false;
			this.shareBtnLoading = true;
			this.updateReqStatus(true);

			const tempPhone = fixPhone(phone);
			if (tempPhone !== phone) {
				this.phone = tempPhone;
				phone = tempPhone;
			}

			if (phone !== this.verifiedPhone) {
				this.isShared = 0;
				this.updateSharedInfo({});

				this.validatePhone(phone).then(ret => {
					const { verify = false } = ret || {};
	                verify && this.recordShare();
	            }, err => {
	                this.updateReqStatus(false);
	                this.handleError(err);
	            });
			} else {
				this.isShared = 0;
				this.recordShare();
			}
			fetch('/promotion/v1/activities/score/regStatus', {
				method: 'GET',
				body: {
					phone: this.phone
				}
			})
			.then(res => res.json())
			.then(ret => {
				const code = ret.bizCode;

				if (code === 10000) {
					this.isReg = ret.data;
				}
			})
			.catch(() => {});
		},
		recordShare() {
			this.share({
				phone: this.phone,
				shareStatus: this.isShared,
				homeScore: +this.homeScore || 0,
				awayScore: +this.awayScore || 0
			})
			.then(ret => {
				this.updateReqStatus(false);
				if (this.shareSucDialog) {
					return;
				}

				if (ret && ret.type === 'share') {
					this.showShareConfirm();
				}
			}, err => {
				this.updateReqStatus(false);

				if (this.shareSucDialog) {
					return;
				}

				const { stopShare = false } = err || {};
				if (stopShare) {
					this.handleError(err);
				} else {
					this.showShareConfirm();
				}
			});
		},
		share2fb(shareInfo) {
			if (!shareInfo) {
				const eventInfo = this.getEventInfo || {},
					sharedInfo = this.sharedInfo || {},
					sharedScore = objType(sharedInfo.homeScore) !== 'undefined' && objType(sharedInfo.awayScore) !== 'undefined' ? `${sharedInfo.homeScore} - ${sharedInfo.awayScore}` : this.shareScore;

				shareInfo = {
					homeTeamName: eventInfo.homeTeamName,
					awayTeamName: eventInfo.awayTeamName,
					sharedScore,
					homeScore: sharedInfo.homeScore || this.homeScore,
					awayScore: sharedInfo.awayScore || this.awayScore,
					eventId: eventInfo.eventId
				};
			}
			// const quote = `AWESOME! Win ${this.showCurrency} ${this.country === 'ke' ? '5,000' : ''} ${this.country === 'ng' ? '20,000' : ''} & Endless FREE BETS on SportyBet! My prediction is: ${this.getEventInfo.homeTeamName} ${this.sharedInfo.homeScore} - ${this.sharedInfo.awayScore} ${this.getEventInfo.awayTeamName}. Join me and win together NOW!`;
			const hashtag = '#SportyBet';
			// const { eventId, homeScore, awayScore } = shareInfo;
			const url = `${this.currentUrl}/${this.sharedInfo.shareImage}`;
			this.shareCfg = { url, hashtag, via: 'Sportybet' };
			if (appCore.getAppName() === 'sportybet') {
				appCore.share({
					title: 'share',
					url,
					// quote,
					hashtag
				}, ret => {
					if (ret) {
						this.isShared = 1;
						this.showShareSuc();
						this.recordShare();
					}
				});
				appCore.shareNow();
			} else if (window.FB) {
				this.isShowShare = true;
			}
		},
		handleCloseShare() {
			this.isShowShare = false;
		},
		handleCancelShare() {
			if (this.allowCancel) {
				return;
			}
			this.allowCancel = true;
			this.$dialog({
				title: null,
				'class': 'm-dialog-share-cancel',
				content: ShareCancel,
				contentData: {
					title: this.actConfig.giveUptoShareLine1,
					content: this.actConfig.giveUptoShareLine2
				},
				button: []
			}).onBtnClick(btnType => {
				if (btnType === 'share') {
					this.$dialog();
					this.share2fb();
				}
			});
		},
		handleSuccShare() {
			this.isShared = 1;
			this.showShareSuc();
			this.recordShare();
		},
		handleError(err) {
			const {
                type = '', msg = ''
            } = err || {};

			switch (type) {
			case 'inline':
				this.phoneError = msg;
				return;
			case 'dialog':
				this.$dialog();
				this.$dialog({
					content: msg,
					button: ['OK']
				});
				return;
			case 'toast':
				this.$dialog();
				this.$toast(msg);
				return;
			case 'expire':
				this.showExpireDialog();
				return;
			case 'hasPredicted':
				this.showShareTips();
				break;
			case 'hasShared':
				this.showShareTips({
					share: true
				});
				break;
			default:
			}
		},
		showShareConfirm() {
			const eventInfo = this.getEventInfo || {},
				sharedInfo = this.sharedInfo || {},
				sharedScore = objType(sharedInfo.homeScore) !== 'undefined' && objType(sharedInfo.awayScore) !== 'undefined' ? `${sharedInfo.homeScore} - ${sharedInfo.awayScore}` : this.shareScore;

			const shareInfo = {
				homeTeamName: eventInfo.homeTeamName,
				awayTeamName: eventInfo.awayTeamName,
				sharedScore,
				homeScore: sharedInfo.homeScore || this.homeScore,
				awayScore: sharedInfo.awayScore || this.awayScore,
				eventId: eventInfo.eventId,
			};

			this.$dialog();

			const self = this;

			this.$dialog({
				title: null,
				'class': 'm-dialog--confirm',
				content: ShareConfirm,
				width: '25rem',
				contentData: Object.assign(
					shareInfo,
					{
						promotions: self.worldCupPromtUrl,
						bonus: self.bonusUrl,
						phone: this.phone,
					}
				),
				button: []
			}).onBtnClick(btnType => {
				if (btnType === 'okBtn') {
					this.share2fb(shareInfo);
				}
			});
		},
		showShareSuc() {
			this.$dialog();
			const self = this;
			this.shareSucDialog = this.$dialog({
				title: null,
				'class': 'm-dialog--cup',
				content: SharedSucPop,
				contentData: {
					actConfig: self.actConfig,
					isReg: self.isReg,
					isFromFb: self.isFromFb,
					eventId: self.getEventInfo.eventId
				},
				button: []
			}).onBtnClick(btnType => {
				this.shareSucDialog = null;
			});
		},
		showShareTips({ share } = {}) {
			this.$dialog();

			const self = this;
			const eventInfo = self.getEventInfo || {};
			this.$dialog({
				title: null,
				'class': 'm-dialog--cup',
				content: SharedPop,
				contentData: {
					actConfig: self.actConfig,
					isReg: self.isReg,
					isFromFb: self.isFromFb,
					eventId: eventInfo.eventId,
					isShared: share
				},
				button: []
			}).onBtnClick(btnType => {
				if (btnType === 'okBtn') {
					this.share2fb();
				}
			});
		},
		showExpireDialog() {
			this.$dialog();

			const self = this;

			this.$dialog({
				title: null,
				'class': 'm-dialog--cup',
				content: ExpirePopDialog,
				contentData: {
					promotions: self.worldCupPromtUrl,
					actConfig: self.actConfig,
				},
				button: []
			}).onBtnClick(btnType => {
				if (btnType === 'closeBtn') {
					location.reload();
				}
			});
		},
		jump() {
			window.location.href = this.jumpUrl;
		},
		goToTerms() {
			window.location.href = isDuringSpecialPeriod ?
			`https://www.sportybet.com/swdp/pagemaker/sportybet/${window.country}/predict_win_xmas/` :
			`https://www.sportybet.com/swdp/pagemaker/sportybet/${window.country}/predict_and_win_t_c/`;
		}
	},
	created() {
		this.loadData();
	},
};

</script>

<style lang="less">
@import "../style/home.less";
</style>
