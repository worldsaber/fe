<template>
	<div v-loading:configWidget.dark="loading" class="m-live-statistics-wraper">
		<div class="m-live-tracker-header"></div>
		<div class="m-live-statistics" :id="matchId"></div>
	</div>
</template>

<script>
let headerHandle = null;
let statsHandle = null;
export default {
	name: 'liveMatchStatistics',
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
	methods: {
		// 加载 widgets script
		mountSRLive() {
			return new Promise((resolve, reject) => {
				if (window.SRLive) return resolve();
				const scirptEl = document.createElement('script');
				scirptEl.src = 'https://cs.betradar.com/ls/widgets/?/sportybet2/en/widgetloader/widgets';
				// scirptEl.id = 'betradarWidgets';
				document.querySelector('body').appendChild(scirptEl);
				scirptEl.addEventListener('load', () => {
					resolve();
				});
			});
		},
		// 配置并添加 widget
		configWidget() {
			const self = this;
			this.remove();
			self.loading = false;
			headerHandle = window.SRLive.addWidget({
				name: 'widgets.matchheader',
				config: {
					container: '.m-live-tracker-header',
					showTitle: false,
					matchId: this.matchId
				},
				callback () {
					self.loading = false;
				}
			});
			statsHandle = window.SRLive.addWidget({
				name: 'widgets.matchstats',
				config: {
					container: '.m-live-statistics',
					showTitle: false,
					matchId: this.matchId,
				}
			});
		},
		remove () {
			if (!window.SRLive) {
				return;
			}
			if (headerHandle) {
				window.SRLive.removeWidget(headerHandle);
			}
			if (statsHandle) {
				window.SRLive.removeWidget(statsHandle);
			}
		},
	},

	mounted() {
		this.loading = true;
		this.mountSRLive()
		.then(() => {
			this.configWidget();
		});
	},
	beforeDestroy() {
		this.remove();
	}
};
</script>

<style lang="less">
@import './style.less';
</style>
