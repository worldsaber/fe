<template lang="html">
  <div class="m-share-bar" id="j_share_bar">
    <div class="m-share-mask"></div>
	<div class="m-share-main">
		<div class="m-title-bar">
		<span class="m-title">Share</span>
		<i class="m-icon-close" @click="handleClose(),handleCancel()" data-action="close" data-ret="close"></i>
		</div>
		<div class="m-icon-wrapper">
			<div
			class="m-fb"
			@click="share2fb"
			data-action="share/fb/share"
			v-if="showFb">
				<i class="m-icon m-icon-fb"></i>
				<span class="m-desc">Facebook</span>
			</div>
			<a
			class="m-wapp"
			@click="share2whatsapp"
			:href="`whatsapp://send?text=${getWhatsappText}`"
			data-action="share/whatsapp/share"
			v-if="showWhatapp">
				<i class="m-icon m-icon-wapp"></i>
				<span class="m-desc">Whatsapp</span>
			</a>
			<a
			class="m-wapp"
			@click="share2twitter"
			:href="getTwitterShare"
			target="_blank"
			data-action="share/twitter/share"
			v-if="showTwitter">
				<i class="m-icon m-icon-twitter"></i>
				<span class="m-desc">Twitter</span>
			</a>
		</div>
	</div>
  </div>
</template>

<script>
/**
 *
 *	shareCfg: {
 *		text: '', // 全局text 如果配置中没有text将会用这个替代  shareText别名
 *		url: '', // 全局url，如果配置中没有url将会用这个替代    shareUrl别名
 *		quote: '', // 默认quote，只有fb用到
 *		hashtag: '', // 默认hashTag， twitter和fb用到
 *		via: '', // 只有twitter用到
 *
 *		fb: {
 *			url: '', // 分享地址 shareUrl是别名
 *			hashtag: '', // 分享的hashtag必须以#开头，如果不写，系统自动补全，如：#SportyBet
 *			quote: '' // 在分享中添加一段文案，注意一旦开启，将无法展示大图
 *		},
 *		twitter: {
 *			text: '', // shareText是别名  分享文案  (通过text和href组合成shareContent)
 *			via: '', // 增加一个@xxx的在分享中,并且会弹出是否follow这个用户 如sportybet
 *			hashtag: '', // 增加一个hashtag，不需要以#号开始
 *			url: '' // shareUrl, url, href是别名
 *		},
 *		whatsapp: {
 *			text: '', // shareText是别名  分享文案  (通过text和href组合成shareContent)
 *			url: '', // shareUrl, url是别名 分享url
 *			shareContent: '', // 分享文案， 如果提供了shareContent text和href就无效
 *		}
 *	}
 *
 *
 *
 *
 */
import { objType } from 'utils';

export default {
	name: 'Share',

	props: {
		shareCfg: {
			type: Object,
			required: true
		}
	},

	data() {
		return {
			shareConfig: null,
			// 是否显示分享到FB
			showFb: true,
			// 是否显示分享到 分享到Whatapp
			showWhatapp: true,
			// 是否显示分享到 twitter
			showTwitter: true
		};
	},
	computed: {
		// 获取 whatapp的分享文案，whate的分享文案就是一句话
		getWhatsappText() {
			const shareConfig = this.shareConfig || {};
			const whatsappCfg = shareConfig.whatsapp || {};
			const shareUrl = whatsappCfg.url;

			const shares = whatsappCfg.shareContent ?
				whatsappCfg.shareContent :
				whatsappCfg.text ?
				`${whatsappCfg.text} at:${shareUrl}` :
				`${shareUrl}`;

			return `${encodeURI(shares)}`;
		},
		getTwitterShare () {
			const { twitter = {}} = this.shareConfig || {};
			const base = 'http://twitter.com/intent/tweet';
			return window.URL.addPara(base, twitter);
		}
	},
	watch: {
		shareCfg: {
			deep: true,
			handler(val) {
				if (val) {
					this.resolveShareConfig();
				}
			}
		}
	},
	methods: {
		handleClose() {
			this.$emit('close-share');
		},
		// 取消分享，在主动关闭弹窗，或者fb回调是取消的时候调用， twitter和whatsapp掉不到
		handleCancel () {
			this.$emit('cancel-share');
		},
		share2whatsapp () {
			this.$emit('click-share', 'whatsapp');
			const loc = location.href;
			setTimeout(() => {
				if (location.href === loc && !document.hidden) {
					this.$dialog.alert('WhatsApp might not be installed on your phone, install it and try agian.', ['OK']);
				}
				this.handleClose();
			}, 2000);
		},
		share2twitter () {
			this.$emit('click-share', 'twitter');
			this.handleClose();
		},
		share2fb() {
			this.$emit('click-share', 'fb');
			if (window.FB) {
				const shareConfig = this.shareConfig || {},
					fbCfg = shareConfig.fb || {};

				const params = Object.assign(fbCfg, {
					method: 'share',
					display: 'popup'
				});
				window.FB.ui(params, response => {
					if (objType(response) !== 'undefined') {
						this.$emit('succ-share', 'fb');
					} else {
						this.handleCancel();
					}
					this.handleClose();
				});
			}
		},
		resolveShareConfig() {
			const shareCfg = this.shareCfg || {};
			const {
				fb = null,
				whatsapp = null,
				twitter = null
			} = shareCfg;
			if (!fb) {
				this.showFb = false;
			}
			if (!whatsapp) {
				this.showWhatapp = false;
			}
			if (!twitter) {
				this.showTwitter = false;
			}
			// 如果三个配置都没给，就根据默认配置自动生成配置
			if (!fb && !whatsapp && !twitter) {
				this.showFb = true;
				this.showWhatapp = true;
				this.showTwitter = true;
				this.resolveShareParam({ fb: {}, whatsapp: {}, twitter: {}});
			} else {
				this.resolveShareParam(this.shareCfg);
			}
		},
		/**
		 * 针对使用默认参数的情况进行默认值处理
		 * 这里只做默认值处理
		*/
		resolveShareParam (cfg) {
			// 当前的cfg
			let { fb, twitter, whatsapp } = cfg;
			// 取默认值
			const text = this.shareCfg.text || this.shareCfg.shareText;
			const url = this.shareCfg.url || this.shareCfg.shareUrl || document.querySelector('meta[property="og:url"]').getAttribute('content') || location.href;
			const quote = this.shareCfg.quote;
			const via = this.shareCfg.via;
			const hashtag = this.shareCfg.hashtag;
			if (fb) {
				fb = this.mergeProperty(fb, {
					href: ['url', 'shareUrl'],
					hashtag: [],
					quote: []
				}, {
					href: url,
					hashtag,
					quote
				});
				// 补#号
				if (fb.hashtag) {
					fb.hashtag = fb.hashtag.startsWith('#') ? fb.hashtag : `#${fb.hashtag}`;
				}
			}

			if (twitter) {
				twitter = this.mergeProperty(twitter, {
					url: ['href', 'shareUrl'],
					text: ['shareText'],
					via: [],
					hashtags: ['hashtag']
				}, {
					url,
					text,
					via,
					hashtags: hashtag
				});
				if (twitter.hashtags) {
					twitter.hashtags = twitter.hashtags.replace(/^#/, '');
				}
			}
			if (whatsapp) {
				whatsapp = this.mergeProperty(whatsapp, {
					url: ['href', 'shareUrl'],
					text: ['shareText'],
					shareContent: []
				}, {
					url,
					text
				});
			}
			const shareConfig = { fb, twitter, whatsapp };
			Object.keys(shareConfig).forEach(key => !shareConfig[key] && delete shareConfig[key]);
			this.shareConfig = shareConfig;
			return this.shareConfig;
		},
		/**
		 * 合并obj的指定字段，并返回一个新的obj
		 * @param obj Object 原始的obj
		 * @param props Object 要合并的字段，以数组表示如 {url: [href, shareUrl]},根据数组顺序排优先级，原始字段url优先级最高
		 * @param def 如果最终这个字段都没取到值，这里可以配置一个默认的值
		 */
		mergeProperty(obj, props = {}, def = {}) {
			const keys = Object.keys(props);
			const res = {};
			for (const key of keys) {
				// 首先取自己的key，取到就直接使用
				if (obj[key]) {
					res[key] = obj[key];
				} else {
					// 取不到就从props中取一个合适的key
					const k = (props[key] || []).find(cur => obj[cur] !== undefined);
					// 如果这个key的值存在，就取这个key的值
					if (k && obj[k]) {
						res[key] = obj[k];
					}
				}
				// 没有取到值, 从默认值中取
				if (res[key] === undefined && def[key]) {
					res[key] = def[key];
				}
			}
			return res;
		},
		clickMask() {
			this.handleCancel();
			this.handleClose();
		},
		touchmoveContainer(e) {
			e.preventDefault();
		}
	},
	created() {
		this.resolveShareConfig();
	},
	mounted() {
		document.body.style.overflow = 'hidden';
		const containerDom = document.querySelector('#j_share_bar');
		containerDom && containerDom.addEventListener('touchmove', this.touchmoveContainer);
		const maskDom = containerDom && containerDom.querySelector('.m-share-mask');
		maskDom && maskDom.addEventListener('click', this.clickMask);
	},
	destroyed() {
		document.body.style.overflow = '';
		const containerDom = document.querySelector('#j_share_bar');
		containerDom && containerDom.removeEventListener('touchmove', this.touchmoveContainer);
		const maskDom = containerDom && containerDom.querySelector('.m-share-mask');
		maskDom && maskDom.removeEventListener('click', this.clickMask);
	}
};
</script>

<style lang="less" scoped>
@import 'base/styles/variable';
@import 'base/styles/icon.less';

.m-share-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 333;

    .m-share-mask {
        width: 100%;
        height: 100%;
        background: fadeout(@black, 50%);
    }

    .m-share-main {
        position: absolute;
        z-index: 2;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 20/@rem 20/@rem 0 0;
    	background: @white;
    	height: 189/@rem;
    }

	.m-title-bar {
		padding: 11/@rem 16/@rem;
		box-sizing: border-box;
		text-align: center;
		overflow: hidden;
		height: auto;
		position: relative;
	}

	.m-title {
		line-height: 32/@rem;
		font-size: 16/@rem;
		font-weight: 500;
		color: @dark;
	}

	.m-icon-close {
		.m-icon-close();
		color: #9ca0ab;
		float: right;
		display: inline-block;
		cursor: pointer;

		&:before {
			font-size: 16/@rem;
		}
	}

	.m-icon-wrapper {
		padding: 37/@rem 16/@rem 0;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: space-around;
		.m-desc {
			line-height: 14/@rem;
			font-size: 12/@rem;
			text-align: center;
			color: @dark;
			display: block;
		}
		>a,div{
			display: block;
		}
	}
	.m-icon-fb {
		.m-icon-fb();
		color: @fbnBlue;
		cursor: pointer;

		&:before {
			font-size: 36/@rem;
		}
	}
	.m-icon-twitter{
		.m-icon-twitter();
		color: #30A0ED;
		cursor: pointer;
		&:before {
			font-size: 36/@rem;
		}
	}
	.m-icon-wapp {
		.m-icon-whatsapp();
		color: green;
		cursor: pointer;

		&:before {
			font-size: 36/@rem;
		}
	}
}
</style>
