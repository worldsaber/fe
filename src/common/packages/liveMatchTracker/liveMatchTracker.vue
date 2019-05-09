<template>
	<div class="m-livetracker" :id="matchId" v-loading:configWidget.dark="loading"></div>
</template>

<script>
import { widgetTypes } from './widgetsConfig.js';

let widgetHandle = null;

export default {
	name: 'liveMatchTracker',
	props: {
		type: String,
		eventId: String
	},
	data() {
		return {
			widget: null,
			loading: false
		};
	},
	computed: {
		matchId() {
			return this.eventId.split(':')[2];
		}
	},
	watch: {
		type(val) {
			if (val) {
				this.configWidget();
			}
		}
	},
	methods: {
		// 加载 widgets script
		mountSRLive() {
			return new Promise((resolve, reject) => {
				if (window.SRLive) return resolve();
				const scirptEl = document.createElement('script');
				scirptEl.src = 'https://cs.betradar.com/ls/widgets/?/sportybet2/en/widgetloader/widgets';
				document.querySelector('body').appendChild(scirptEl);
				scirptEl.addEventListener('load', () => {
					resolve();
				});
			});
		},
		// 配置并添加 widget
		configWidget() {
			if (widgetHandle) {
				window.SRLive.removeWidget(widgetHandle);
			}
			const config = {
				container: '.m-livetracker',
				showTitle: false,
				matchId: this.matchId
			};

			if (this.type !== 'h2h') {
				// lmts才有的参数
				Object.assign(config, {
					/* avaliable for widgets.lmts only */
					/** 下面的参数仅仅对lmts的管用 */
					// showGoalscorers: true,
					// momentum2_showArea: true,
					showMomentum: true, //  timeline/momentum 是否显示
					// showMomentum2: 'line', // 'bar'
					// sidebarLayout: 'bottom', // 'dynamic', 会根据 width 自动调整
					pitchCrowd: true, // 显示赛场背景人群
					showPitch: true, // 显示赛场
					showSidebar: false, // 显示
					// showHeatmap: true,
					// showLineups: true, // 该属性需要对方配置 that cannot be controled
					collapse_enabled: false, // allow to be collapsed or not
					collapse_startCollapsed: true // collapsed
				});
			}

			const self = this;
			widgetHandle = window.SRLive.addWidget({
				// 注意：matchhead2head 只支持 football, basketball, tennis, handball, darts
				name: widgetTypes[this.type] || 'widgets.lmts',
				config,
				callback() {
					self.loading = false;
				}
			});
		}
	},

	mounted() {
		this.loading = true;
		this.mountSRLive()
		.then(() => {
			this.configWidget();
		});
	},

	beforeDestroy() {
		if (window.SRLive) {
			window.SRLive.removeWidget(widgetHandle);
		}
	}
};
</script>

<style lang="less">
@import './style.less';
</style>
