<template lang="html">
	<div class="m-pop-wrapper">
	  <div class="m-pop-bg"></div>
	  <div class="m-pop-mian">
		  <SlideAnimation
			:pageCount="modulePath.length"
			:activeIndex="0"
		  >
			<SlideItem :pageIndex="0" v-if="showCode">
				<LoginCode
					@submit="goNext"
					:phone="getAccount"
					:countryCode="countryCode"
					:errorInfo="errorInfo"
					:backIcon="false"
					:isStartTimer="startTimer"
					:remainCount="remainCount"
					:loading="isLoading('code')"/>
			</SlideItem>
			<SlideItem :pageIndex="0" v-show="showSmsPage">
				<LoginSMS
					:phone="getAccount"
					:countryCode="countryCode"
					:smsNumber="smsNumber"
					:smsContent="smsContent"
					:moduleName="moduleName"
					:loading="isLoading('sms')"
					:backIcon="false"
					@submit="goNext"/>
			</SlideItem>
		</slideAnimation>
	  </div>
  </div>
</template>

<script>
import SlideAnimation from 'components/slideAnimation/slideContainer.vue';
import SlideItem from 'components/slideAnimation/slideItem.vue';
import LoginCode from 'components/login/pagelet/code.vue';
import LoginSMS from 'components/login/pagelet/SMS.vue';
import { mapGetters, mapMutations, mapState } from 'vuex';
import * as mutationsTypes from 'store/changePsd/mutationTypes';
import { EventBus } from 'kernel/js/eventBus.js';

let timerId;

export default{
	components: {
		SlideAnimation,
		SlideItem,
		LoginCode,
		LoginSMS
	},
	data() {
		return {
			reqLoading: this.loading
		};
	},
	computed: {
		...mapState('login', [
			'countryCode',
			'msgThreshold'
		]),
		...mapGetters('login', {
			errorInfo: 'getErrorInfo',
			moduleName: 'getmoduleName'
		}),
		...mapGetters('login', [
			'remainCount',
			'smsContent',
			'smsNumber',
			'getAccount',
			'loading',
			'modulePath'
		]),
		showSmsPage() {
			return this.modulePath.includes('sms');
		},
		showCode() {
			return this.modulePath.includes('code');
		},
		startTimer() {
			return this.moduleName === 'code' && this.remainCount < this.msgThreshold && this.remainCount >= 0;
		}
	},
	watch: {
		moduleName(val) {
			timerId && clearTimeout(timerId);
			this.reqLoading = false;
		},
		loading(val, oldVal) {
			if (val) {
				this.reqLoading = val;

				timerId = setTimeout(() => {
					this.reqLoading = this.loading;
					clearTimeout(timerId);
					timerId = null;
				}, 500);
			} else {
				!timerId && (this.reqLoading = val);
			}
		}
	},
	methods: {
		...mapMutations('login', {
			changemoduleName: mutationsTypes.UPDATE_NEXT_PAGE
		}),
		isLoading(module) {
			return this.moduleName === module && this.reqLoading;
		},
		goNext(option) {
			EventBus.$emit('goNextModule', option);
		}
	}
};
</script>
<style lang="less">
@import 'components/login/style/popDialog.less';

.m-pop-wrapper {
	position: absolute;
	top: 0 !important;
	transform: translate3d(-50%,0,0) !important;
}
</style>
