<template>
  <div class="m-help-content" :class="fileName" v-html="contents"></div>
</template>

<script>
/*
	Help 详情页
	支持 url params 参数, ?type=tab&theme=dark
	1. type=tab 表明当前内容处在一个 tab 容器中, 会自动隐藏头部等无关内容，只显示文案主体内容
	2. theme=dark, 主题色, dark / light, 默认为 light
*/

import { wapHelpContents, appHelpContents } from '../js/bridge.js';
import { getCompatiblePathKey } from '../js/utils';

export default {
	name: 'help-details',
	data() {
		return {
			isApp: false
		};
	},
	computed: {
		fileName () {
			/* 取当前文件名及父文件夹名作为 className */
			const filePaths = this.$router.currentRoute.path.split('/');
			return `${filePaths.pop()} ${filePaths.pop() || ''}`;
		},
		contents () {
			const filePath = this.$router.currentRoute.path.substr(1);
			const key = getCompatiblePathKey(filePath);
			if (this.isApp) {
				return appHelpContents[key];
			}
			return wapHelpContents[key];
		}
	},
	methods: {
		checkRuntime() {
			this.isApp = !!window.AppCore.getAppName();
			return this.isApp;
		},
		// 解析参数
		resolveParams() {
			// type=tab 表明当前内容处在一个 tab 容器中（如 app webview, 或其他场景）
			const type = URL.getPara('type');
			// 主题色, dark / light, 默认为 light
			const theme = URL.getPara('theme') || 'light';
			if (type === 'tab') {
				document.body.addClass(`is-tab ${theme}`);
			}
		}
	},
	created() {
		this.checkRuntime();
	},
	mounted() {
		this.resolveParams();
	},
};
</script>

<style lang="less">
@import 'base/styles/icon.less';
@import 'base/styles/variable.less';

.m-help-content {
	padding: 26/@rem 3/@rem 26/@rem 15/@rem;
	margin-bottom: 10/@rem;
	overflow: hidden;

	&.faq.general,
	&.faq.sports {
		.help-content-wrap {
			p {
				margin-bottom: 0;
			}

			ol {
				li {
					margin-bottom: 14/@rem;
					p:first-child {
						font-size: 14/@rem;
						font-weight: 600;
					}
				}
			}
		}
	}

	&.about-us {
		.help-content-wrap {
			img {
				margin: 8/@rem 0 6/@rem;
			}
		}
	}

	&.roulette {
		table {
			td, th {
				padding: 6/@rem 6/@rem;
			}
		}
	}
	
	&.dicebattle {
		background: #70B8B4;
		padding: 26/@rem 12/@rem;
		h3 {
			background: #155159;
			border-radius: 4/@rem;
			padding: 6/@rem 0;
			text-align: center;
			color: #58FFEF;
		}
		h4 {
			color: #97F3E4;
		}
	}
}


body.is-tab {
	.mobile-navbar-wrap,
	.m-navbar,
	iframe {
		display: none!important;
	}

	&.dark {
		background: @dark;
		color: @white;

		.m-help-content {
			.help-content-wrap {
				h3 {
					color: @white;
				}
			}
		}
	}
}
</style>
