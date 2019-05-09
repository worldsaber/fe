<template lang="html">
	<div :class="[
			'm-dialog-wrapper',
			{
				'm-dialog-wrapper-fix': isShare
			}
		]"
	>
		<div class="m-pop-header">
			<span>{{contentData.title}}</span>
			<i
				class="m-icon-close"
				data-action="close"
				data-ret="close"
			></i>
		</div>
		<div class="m-pop-main">
			<p v-html="contentData.msg"></p>

			<!-- share bet code success -->
			<template v-if="isShare">
				<div class="m-share-wrapper">
					<div>
						<div class="m-label">Booking Code</div>
						<div class="m-value">{{contentData.shareCode}}</div>
					</div>
					<div>
						<div class="m-label">Code Link</div>
						<div class="m-opt-wrapper">
							<AfInput v-model="contentData.shareURL" id="j_betCode">
								<span slot="append" @click="copyCode">copy</span>
							</AfInput>
						</div>
					</div>

					<af-Button
						@click="shareToFaceBook"
						icon="faceBook"
					>Share to Facebook</af-Button>
				</div>
			</template>

			<template v-else>
				<div class="m-btn-wrapper">

					<!-- create order success -->
					<template v-if="shouldGoDeposit">
						<af-Button
							extraType="text"
							data-action="close"
							data-ret="close"
						>Cancel</af-Button>
						<af-Button
							data-action="close"
							data-ret="close"
							@click="goDeposit"
						>Deposit</af-Button>
					</template>

					<!-- common tips -->
					<template v-else>
						<af-Button
							data-action="close"
							data-ret="close"
						>OK</af-Button>
					</template>
				</div>
			</template>

		</div>
	</div>
</template>

<script>
import 'packages/button';
import 'packages/input';
import { userCenterConfig } from 'config/order/userCenterConfig';

export default {
	computed: {
		shouldGoDeposit() {
			return this.contentData.optType === 'deposit';
		},
		isShare() {
			return this.contentData.optType === 'share';
		}
	},
	methods: {
		goDeposit() {
			window.open(userCenterConfig.Deposit, '_blank');
		},
		shareToFaceBook() {
			if (window.FB) {
				FB.ui({
					method: 'share',
					display: 'popup',
					href: this.contentData.shareURL,
					// href: 'http://www.sportybet.com/ke/?shareCode=CCX27',
					quote: 'Hey check out the bet I just placed on Sportybet!'
				}, response => {
					console.log('cancel share!');
				});
			}
		},
		copyCode() {
			const codeWrapperDom = document.querySelector('#j_betCode'),
				codeDom = codeWrapperDom && codeWrapperDom.querySelector('.m-input') || null;

			if (codeDom) {
				codeDom.select();
				document.execCommand('Copy');
			}
		}
	},
	// mounted() {
	// 	this.copyCode();
	// 	document.querySelector('#j_betCode input').dispatchEvent(new Event('focus'));
	// }
};
</script>
