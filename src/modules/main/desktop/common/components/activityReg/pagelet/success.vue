<template lang="html">
	<div class="m-pagelet-suc" :style="getPageStyle">
		<div class="m-pagelet">
			<!-- back banner -->
			<div class="m-page-back" v-if="hasBack">
				<span @click="handleBack"><i class="m-icon-back"></i>{{backText}}</span>
			</div>

			<div class="m-main">
				<!-- site log -->
				<div class="m-logo-wrapper" v-if="showLogo">
					<i class="m-icon-logo"></i>
				</div>

				<!-- page title -->
				<h3 class="m-title" v-if="title">{{title}}</h3>

				<!-- page content -->
				<div class="m-content" v-if="tips && timer">
					<p>
						<span>{{tips}}</span>
						<span>in <span class="m-t-highlight">{{timer}}</span>{{timer === 1 ? ' second' : ' seconds'}}.</span>
					</p>
				</div>

				<!-- 按钮 -->
				<af-button
					v-if="btnText"
					class="m-btn"
					:autofocus="false"
					@click.prevent="handleClick"
				>
					<span>{{btnText}}</span>
				</af-button>
				<slot name="optBar" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';
import { objType } from 'utils';
import 'packages/button';
import * as mutationTypes from 'store/activityRegister/mutationTypes';
import { pagePath } from 'config/pageConfig';

const defaultImg = require('../image/bg.jpg');

export default {
	name: 'ActivityRegSuc',
	props: {
		// 是否显示logo，在外层覆盖样式可修改logo
		showLogo: {
			type: Boolean,
			'default': true
		},
		// 页面title
		title: {
			type: String,
			'default': 'Registration Successful'
		},
		// 页面按钮, ''将没有按钮
		btnText: {
			type: String,
			'default': 'Go to Website'
		},
		// 页面跳转链接
		autoJmpUrl: {
			type: String,
			'default': pagePath.home
		},
		// 页面自动跳转时间，设置为0将不会自动跳转
		jmpTime: {
			type: Number,
			'default': 5
		},
		// 页面显示文案
		tips: {
			type: String,
			'default': 'this page will jump into sportybet'
		},
		// 是否有back条
		hasBack: {
			type: Boolean,
			'default': false
		},
		// back条文案，''将值显示按钮
		backText: {
			type: String,
			'default': 'Back'
		},
		// 页面背景，不要背景设置为null
		bgImg: {
			type: String,
			'default': ''
		}
	},
	data() {
		return {
			timerId: null,
			timer: this.jmpTime,
			autoJmp: this.jmpTime && this.autoJmpUrl || false,
			bgImage: objType(this.bgImg) === 'null' ? '' : this.bgImg || defaultImg
		};
	},
	computed: {
		getPageStyle() {
			// if (this.bgImage) {
			// 	return {
			// 		background: `url(${this.bgImage}) no-repeat`
			// 	};
			// }
			return '';
		}
	},
	methods: {
		...mapMutations('activityRegister', {
			chgModule: mutationTypes.UPDATE_NEXT_PAGE
		}),
		handleBack() {
			this.chgModule('index');
		},
		startTimer() {
			clearTimeout(this.timerId);
			if (this.timer === 0) {
				location.href = this.autoJmpUrl;
				return;
			}

			this.timerId = setTimeout(() => {
				this.timer -= 1;
				this.startTimer();
			}, 1000);
		},

		handleClick() {
			location.href = this.autoJmpUrl;
		}
	},
	mounted() {
		const from = URL.getPara('from');
		// fb注册成功回调
		if (window.fbq) {
			window.fbq('track', 'CompleteRegistration');
		}
		// twinpine统计注册成功回调
		if (window.postback) {
			window.postback();
		}
		if (from === 'eskimi_wap') {
			let r = Math.random();
			r *= 10000000000000000000;
			document.write('<img src="//dsp.eskimi.com/pixel/cookie?ord=' + r + '" style="display:none" />');
		} else if (from === 'taboola_wap') {
			window._tfa = window._tfa || [];
			window._tfa.push({ notify: 'action', name: 'conversion' });
		}
		this.timer && this.startTimer();
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';
@import 'base/style/icon.less';
@import 'components/login/style/buttonMixin.less';
@import '../style/pageBack.less';
@import '../style/reset.less';

.m-pagelet-suc {
	height: 100%;

	.m-pagelet {
		position: relative;
		padding-top: 46px;
		box-sizing: border-box;
	}

	.af-button {
		width: 100%;
		height: 48px;
		.button();
		border-radius: 2px;
	}

	.af-button--primary {
		.button--primary();
	}

	.m-page-back {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;

		.m-page-back();
	}

	.m-main {
		padding: 0 30px;
		box-sizing: border-box;
		text-align: center;
	}

	.m-logo-wrapper {
		.m-icon-logo {
			display: inline-block;
			.m-icon-sportbet();

			color: @red;
			&:before {
				font-size: 40px;
			}
		}
	}

	.m-title {
		margin-top: 18px;
		line-height: 17px;
		font-size: 20px;
		font-weight: bold;
		color: @dark;
	}

	.m-content {
		margin-top: 8px;
		font-size: 12px;
		line-height: 16px;
		color: @dark;

		.m-t-highlight {
			color: @red;
		}

		p > span {
			display: block;
		}
	}

	.m-btn {
		margin-top: 40px;
		font-size: 16px;
		font-weight: bold;
	}
}
</style>
