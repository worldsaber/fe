<template lang="html">
  <div class="m-share-bar" id="j_share_bar">
      <div class="m-share-mask"></div>
      <div class="m-share-main">
          <div class="m-title-bar">
    	  	<span class="m-title">Share</span>
    		<i class="m-icon-close" @click="handleClose"></i>
    	  </div>
    	  <div class="m-icon-wrapper">
    		  <div class="m-fb" @click="share2fb">
    		  	 <i class="m-icon m-icon-fb"></i>
    			 <span class="m-desc">Facebook</span>
    		  </div>
    		  <a class="m-wapp" @click="share2whatapp" :href="`whatsapp://send?text=${getShareText}`" data-action="share/whatsapp/share">
    			  <i class="m-icon m-icon-wapp"></i>
    			  <span class="m-desc">Whatsapp</span>
    		  </a>
    	  </div>
      </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { UPDATE_SHAREBAR_STATUS } from 'store/issue/mutationTypes';
import { domain, protocol } from 'config/pageConfig';

import { shareConfig } from '../js/config';

export default {
	data() {
		return {
			currentUrl: `${protocol}//${domain}${window.v_router.options.base}`
		};
	},
	computed: {
		...mapState('issue', [
			'country'
		]),
		getShareText() {
			const shares = `${this.shareText}at:${this.currentUrl}`;

			return `${encodeURI(shares)}`;
		},
		shareText() {
			const country = this.country || __baseUrl__.replace(/\//g, '');

			return shareConfig[country];
		}
	},
	methods: {
		...mapMutations('issue', {
			hideShareBar: UPDATE_SHAREBAR_STATUS
		}),
		handleClose() {
			this.hideShareBar(false);
		},
		share2whatapp () {
			const loc = location.href;
			setTimeout(() => {
				if (location.href === loc && !document.hidden) {
					this.handleClose();
					this.$dialog.alert('WhatsApp might not be installed on your phone, install it and try agian.', ['OK']);
				}
			}, 2000);
		},
		share2fb() {
			if (window.FB) {
				FB.ui({
					method: 'share',
					display: 'popup',
					href: this.currentUrl,
					// 去掉文案， 为了显示大图
					// quote: this.shareText
				}, response => {
					this.handleClose();
					console.log('cancel share!');
				});
			}
		}
	},
	mounted() {
		document.body.style.overflow = 'hidden';

		const containerDom = document.querySelector('#j_share_bar');
		containerDom && containerDom.addEventListener('touchmove', e => {
			e.preventDefault();
		});

		const maskDom = containerDom && containerDom.querySelector('.m-share-mask');
		maskDom && maskDom.addEventListener('click', () => {
			this.hideShareBar(false);
		});
	},
	destroyed() {
		document.body.style.overflow = 'auto';

		const containerDom = document.querySelector('#j_share_bar');
		containerDom && containerDom.removeEventListener('touchmove');

		const maskDom = containerDom && containerDom.querySelector('.m-share-mask');
		maskDom && maskDom.removeEventListener('click');
	}
};
</script>

<style lang="less">
@import 'base/styles/variable';
@import 'base/styles/icon.less';
@import '../style/variable.less';

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
        background: transparent;
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
		padding-top: 37/@rem;
		text-align: center;

		.m-desc {
			line-height: 14/@rem;
			font-size: 12/@rem;
			text-align: center;
			color: @dark;
			display: block;
		}
	}

	.m-fb,
	.m-wapp {
		display: inline-block;
		vertical-align: top;
	}

	.m-fb {
		margin-right: 66/@rem;
	}

	.m-icon-fb {
		.m-icon-fb();
		color: @fbnBlue;
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
