<template>
	<div class="m-order-share">
		<Share
			:shareCfg="shareCfg"
			@close-share="close"
			@succ-share="succ"
			@click-share="btnClick">
		</Share>

		<div class="m-loading-mask" v-show="loading">
			<i class="m-icon-loading"></i>
		</div>
	</div>
</template>
<script>
import ImageMaker from 'packages/ImageMaker';
import upload, { dataURItoBlob } from 'utils/upload';
import getPercentOptions from './sharePics/percentOptions.js';
import getQuoteOptions from './sharePics/quoteOptions.js';
import './index';

const country = window.country;

// 记录上一次分享的order id
let lastOrderId;

export default {
	props: {
		shareCfg: {
			type: Object,
			required: true
		},
		orderId: {
			'default': '',
			type: String
		},
		// 订单中奖金额
		winnings: {
			type: String,
			'default': ''
		},
		// 中奖超过了百分之多少的人
		percent: {
			type: Number,
			'default': 0
		}
	},
	watch: {
		shareUrl (val) {
			this.shareCfg.url = val;
			if (this.shareCfg.fb) {
				this.shareCfg.fb.href = val;
			}
			if (this.shareCfg.whatsapp) {
				this.shareCfg.whatsapp.url = val;
			}
			if (this.shareCfg.twitter) {
				this.shareCfg.twitter.url = val;
			}
		}
	},
	data () {
		return {
			shareUrl: '',
			ins: null, // imageMaker Instance
			loading: false
		};
	},
	mounted() {
		if (this.orderId !== lastOrderId) {
			this.generateShareImg();
			lastOrderId = this.orderId;
		}
	},
	methods: {
		// 后台生成分享到facebook的图片链接
		async generateFBShareImage() {
			if (this.orderId) {
				try {
					const res = await fetch(`/orders/share/getSharePics?orderId=${this.orderId}`);
					const { bizCode } = await res.json();
					if (bizCode === 10000) {
						this.shareUrl = `${location.origin}/${country}/m/share_win/${this.orderId}`;
					} else {
						this.shareUrl = `${location.origin}/${country}/m/`;
					}
				} catch (err) {
					console.error('facebook分享图片获取失败'); // eslint-disable-line
					this.shareUrl = `${location.origin}/${country}/m/`;
				}
			}
			this.ready();
		},

		// 生成分享图
		async drawSharePic () {
			const { winnings, percent } = this;
			let options;
			if (percent > 0) {
				options = getPercentOptions({ winnings, percent });
			} else {
				options = getQuoteOptions({ winnings });
			}
			this.ins = new ImageMaker(options);
			return this.ins.render();
		},

		// 上传分享图
		async uploadPic () {
			const { orderId } = this;
			if (!this.ins) return;

			const url = `/api/${country}/orders/share/uploadSharePics/${orderId}`;

			try {
				const fileData = this.ins.canvas.toDataURL('image/jpeg', 0.8);

				const { bizCode, message } = await upload(url, {
					file: dataURItoBlob(fileData)
				});
				if (bizCode === 10000) {
					this.shareUrl = `${location.origin}/${country}/m/share_win/${this.orderId}`;
					return Promise.resolve();
				}
				return Promise.reject(new Error(message));
			} catch (err) {
				console.log(err); // eslint-disable-line
				return Promise.reject(err);
			}
		},

		// 生成分享图，优先前端生成后上传，后端生成作为备用方案
		async generateShareImg () {
			this.loading = true;
			// 如果没有传入 winning，或者不支持 FormData, 则用后端生成结果
			if (!this.winnings || !window.FormData) {
				return this.generateFBShareImage();
			}

			try {
				await this.drawSharePic();
				await this.uploadPic();
				this.ready();
				// 上传成功记录下
				lastOrderId = this.orderId;
			} catch (err) {
				console.error(err); // eslint-disable-line
				this.generateFBShareImage();
			}
		},

		// 分享图已准备好
		ready () {
			this.loading = false;
		},

		succ (type) {
			this.$emit('succ-share', type);
		},
		close () {
			this.$emit('close-share');
		},
		btnClick (type) {
			this.$emit('click-share', type);
		}
	}
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';
@import 'base/styles/animate.less';

.m-order-share {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 189/@rem;
}

.m-loading-mask {
	width: 100%;
	position: absolute;
	top: 54/@rem;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
	background: fade(#fff, 80%);

	.m-icon-loading {
		top: 38.2%;
		left: 50%;
		position: absolute;
		margin-left: -15/@rem;
		margin-top: -15/@rem;
		.m-icon-loading-circle();
		animation: circles 1s linear infinite;

		&:before{
			height: 30/@rem;
			width: 30/@rem;
			line-height: 1;
			font-size: 30/@rem;
			vertical-align: top;
			color: @midGreen;
		}
	}
}
</style>
