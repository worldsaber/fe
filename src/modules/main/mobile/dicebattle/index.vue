<template>
  	<Layout :isHaveBottomNav="false" :isHaveNavBar="false" :isHasFooter="false" :isHaveShare="true">
		<div slot="mid">
			
		</div>
	</Layout>
</template>

<script>
import Layout from 'components/layout/main.vue';
import Share from 'components/share';
import { mapMutations, mapState } from 'vuex';
import { loginPromise } from 'components/login/tools';
import * as mutationTypes from 'store/layout/mutationTypes';
import appCore from 'appCore';
import 'components/login/popupLogin';

export default{
	components: {
		Layout,
		Share
	},
	data() {
		return {
			shareUrl: location.href
		};
	},
	computed: {
		...mapState('layout', [
			'showShare'
		])
	},
	created() {
		this.updateShareCfg({
			shareUrl: location.href
		});
	},
	async mounted () {
		try {
			const res = await fetch('/patron/youxing-account');
			const ret = await res.json();
			if (ret.bizCode === 10000) {
				const insertIframe = document.createElement('iframe');
				insertIframe.id = 'diceBattle';
				document.querySelector('#dice-battle-app').appendChild(insertIframe);
				insertIframe.src = ret.data.mobileUrl;
				this.changeLoading(false);
				const origin = ret.data.mobileUrl.split('?')[0].slice(0, -1);
				console.log(origin);
				window.addEventListener('message', messageEvent => {
					let data;
					if (messageEvent.origin === origin) {
						if (typeof messageEvent.data === 'string') {
							data = JSON.parse(messageEvent.data);
						} else {
							data = messageEvent.data;// messageEvent: {source, currentTarget, data}
						}
						if (data.type === 'login') {
							// console.log('login');
							loginPromise().then(() => {
								window.location.reload();
							});
						}
						if (data.type === 'share') {
							console.info('message from child:', messageEvent, data);
							if (appCore.getAppName() === 'sportybet') {
								appCore.share({
									title: 'share',
									url: this.shareUrl,
									hideCopy: 'true',
								});
								appCore.shareNow();
							} else {
								this.toggleShare(true);
								// console.log('share', this.showShare);
							}
						}
					}
				}, false);
			}
		} catch (e) {
			console.log(e);
			this.changeLoading(false);
		}
	},
	methods: {
		...mapMutations('layout', {
			toggleShare: mutationTypes.TOGGLE_SHARE,
			changeLoading: mutationTypes.CHANGE_LOADING,
			updateShareCfg: mutationTypes.UPDATE_SHARE_CONFIG
		}),
	},
};
</script>

