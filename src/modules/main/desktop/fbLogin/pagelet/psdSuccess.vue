<template lang="html">
	<div class="m-page m-page--success" id="j_success">
		<section class="m-page-con">
			<h3 class="m-title--success m-icon-success">Registration Successful</h3>
			<p class="m-t-infos">{{sucTips.main}} {{sucTips.desc}}</p>

			<div class="m-btn-wrapper">
				<AfButton
					@click="deposit"
				>Go to Deposit {{dpDesc}}</AfButton>
			</div>
		</section>
		<section class="m-page-footer">
			<template v-if="referralCode">
				<div class="m-page-opt">
					<p class="m-text-tips">Referral code</p>
					<p class="m-code m-border">{{referralCode}}</p>

					<div class="m-opt-wrapper">
						<AfButton
						extraType="text"
						@click="goHome"
					>Back<i class="m-icon-arrow-right"></i></AfButton>
					</div>
				</div>
			</template>

			<template v-else>
				<div class="m-page-opt">
					<p class="m-text-tips">Have a referral code?</p>

					<div class="m-opt-wrapper m-border">
						<AfInput
							v-model="code"
							placeholder="Referral Code (OPTIONAL)"
							icon="delete"
							:iconClick="clearAllInput"
							:error="codeError || isCodeError"/>
						<AfButton
							extraType="info"
							@click="apply"
							:loading="reqLoading"
							:disabled="submitStatus"
						>Apply</AfButton>
						<p
							v-if="showError"
							class="m-error-tips"
						>{{showError}}</p>
					</div>
					<div class="m-opt-wrapper">
						<AfButton
						extraType="text"
						@click="goHome"
					>Back<i class="m-icon-arrow-right"></i></AfButton>
					</div>
				</div>
			</template>
		</section>

		<!-- <template v-if="hasPromotion">
			<div class="m-image-wrapper m-promotion" @click="deposit">
				<img src="../../common/components/login/image/succeedBanner.png" alt="">
				<img :src="promotionAd.imgUrl" alt="" />
			</div>
		</template> -->
	</div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import AfButton from 'packages/button/button.vue';
import 'packages/input';

import * as mutationsTypes from 'store/changePsd/mutationTypes';

import { userCenterConfig } from 'config/order/userCenterConfig';
import { pagePath } from 'config/pageConfig';
import { getSucTips, getDpFee } from 'config/regConfig';
import { getReferralCode } from 'utils/channel';
// import { showCurrency } from 'config/currencyConfig';

let timerId;

export default {
	components: {
		AfButton
	},

	data() {
		return {
			code: getReferralCode(),
			codeError: false,
			reqLoading: false,
			isCodeReady: false,
			sucTips: getSucTips(),
			dpDesc: getDpFee(),
			// showCurrency
		};
	},
	computed: {
		...mapState('fbLogin', [
			'errorInfo',
			'requesting',
			// 'promotionAd',
			'referralCode'
		]),

		/*
		show error message which not dialoging
		 */
		showError() {
			const err = this.errorInfo || {};
			return err.msg || '';
		},

		// hasPromotion() {
		// 	const promotionAd = this.promotionAd || {};
        //
		// 	return promotionAd.imgUrl;
		// },

		isCodeError() {
			const err = this.errorInfo || {};

			return err.isReferralError || false;
		},

		submitStatus() {
			return !this.isCodeReady;
		}
	},
	watch: {
		requesting(val) {
			if (val) {
				this.reqLoading = val;

				timerId = setTimeout(() => {
					this.reqLoading = this.requesting;
					clearTimeout(timerId);
					timerId = null;
				}, 500);
			} else {
				!timerId && (this.reqLoading = this.requesting);
			}
		},
		code(val) {
			if (val.length) {
				this.isCodeReady = true;
			} else {
				this.isCodeReady = false;
			}
		}
	},
	methods: {
		...mapActions('fbLogin', [
			'setReferralCode',
			'getPromotionAd'
		]),
		...mapMutations('fbLogin', {
			changeReqStaue: mutationsTypes.UPDATE_REQUSET_STATE,
		}),
		clearAllInput() {
			this.code = '';
		},
		deposit() {
			location.href = userCenterConfig.Deposit;
		},
		goHome() {
			location.href = pagePath.home;
		},
		apply() {
			if (this.submitStatus) {
				return;
			}

			this.changeReqStaue(true);
			this.setReferralCode({
				code: this.code
			});
		},

		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.apply();
			}
		}
	},
	created() {
		if (!this.promotionAd) {
			this.getPromotionAd();
		}

		if (this.referralCode) {
			this.setReferralCode();
		}
	},
	mounted() {
		document.querySelector('#j_success').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});

		this.isCodeReady = !!this.code;
	},
	beforeDestory() {
		document.querySelector('#j_success').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};
</script>
