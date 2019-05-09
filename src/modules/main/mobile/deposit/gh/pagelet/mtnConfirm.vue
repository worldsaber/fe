<template lang="html">
  <div class="m-dp-gh-mtncfm" id="j_mtnCfm">
  	<navbar :backClick="backHandler"><i slot="right" class="m-icon-help" @click.stop="depositHelp"></i></navbar>
	<div class="m-steps">
		<div class="m-s-item m-submit">
			<div class="m-circle m-checked"></div>
			<div class="m-b-gray"></div>
			<p class="m-t-bold">Submission Succeeded!</p>
		</div>
		<div class="m-s-item m-operate">
			<div :class="['m-circle',{'m-checked': needJmp}]"></div>
			<div class="m-b-gray"></div>
			<p class="m-t-bold m-t-black">Please follow the instruction to complete transaction:</p>
			<ul class="f-count">
				<li class="m-t-normal m-t-black f-count-item f-flex"><span class="f-flex-item">Dial *170# select Option 7, My Wallet.</span></li>
				<li class="m-t-normal m-t-black f-count-item f-flex"><span class="f-flex-item">Select Option 3 for My Approvals.</span></li>
				<li class="m-t-normal m-t-black f-count-item f-flex"><span class="f-flex-item">Enter PIN to get your Pending Approval List.</span></li>
				<li class="m-t-normal m-t-black f-count-item f-flex"><span class="f-flex-item">Select pending transaction to approve.</span></li>
				<li class="m-t-normal m-t-black f-count-item f-flex"><span class="f-flex-item">Select Option 1 YES to approve the transaction or Option 2 NO to reject the transaction.</span></li>
				<li class="m-t-normal m-t-black f-count-item f-flex"><span class="f-flex-item">You will receive an SMS as confirmation for a successful transaction.</span></li>
			</ul>
		</div>
		<div class="m-s-item m-transaction" @click="seeDetail">
			<div :class="['m-circle',{'m-checked': needJmp}]"></div>
			<p class="m-t-bold m-t-green">Check transaction result after confirmation ></p>
		</div>
		<div class="m-b-green" :style="getLineStyle" id="j_mtnStepBar"></div>
	</div>
  </div>
</template>

<script>
import navbar from 'components/navbar';
import { userCenterUrl } from 'config/mycenter/dataConfig.js';
import dpNavMixin from '../js/dpNavMixin';

export default {
	mixins: [
		dpNavMixin
	],
	components: {
		navbar
	},
	data() {
		return {
			lineHeight: 0,
			needJmp: false
		};
	},
	computed: {
		getLineStyle() {
			return {
				height: this.lineHeight
			};
		}
	},
	methods: {
		seeDetail() {
			const wrapDom = document.querySelector('#j_mtnCfm'),
				firstStepDom = wrapDom && wrapDom.querySelector('.m-checked') || null,
				secondStepDom = wrapDom && wrapDom.querySelector('.m-operate') || null;
			let height = 0;

			firstStepDom && (height += firstStepDom.getBoundingClientRect().height || 0);
			secondStepDom && (height += secondStepDom.getBoundingClientRect().height || 0);

			this.lineHeight = height + 'px';

			this.needJmp = true;
		},
		transitionEnd() {
			if (this.needJmp) {
				location.href = userCenterUrl.transaction;
			}
		}
	},
	mounted() {
		const wrapDom = document.querySelector('#j_mtnCfm'),
			firstStepDom = wrapDom && wrapDom.querySelector('.m-checked') || null;

		if (firstStepDom) {
			const height = firstStepDom.getBoundingClientRect().height;

			this.lineHeight = (height * 0.5) + 'px';
		}

		const stepBarDom = document.querySelector('#j_mtnStepBar');
		if (stepBarDom) {
			stepBarDom.addEventListener('transitionend', this.transitionEnd, false);
			stepBarDom.addEventListener('webkitTransitionEnd', this.transitionEnd, false);
			stepBarDom.addEventListener('oTransitionEnd', this.transitionEnd, false);
			stepBarDom.addEventListener('MSTransitionEnd', this.transitionEnd, false);
		}
	},
	destroyed() {
		const stepBarDom = document.querySelector('#j_mtnStepBar');
		if (stepBarDom) {
			stepBarDom.removeEventListener('transitionend', this.transitionEnd, false);
			stepBarDom.removeEventListener('webkitTransitionEnd', this.transitionEnd, false);
			stepBarDom.removeEventListener('oTransitionEnd', this.transitionEnd, false);
			stepBarDom.removeEventListener('MSTransitionEnd', this.transitionEnd, false);
		}
	}
};
</script>

<style lang="less" scoped>
@import '../style/mtnCfm.less';
</style>
