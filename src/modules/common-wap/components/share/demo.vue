<template>
	<!-- 分享成功只有fb有，分享取消是指在用户手动关闭分享弹窗的时候调用，分享关闭是指任何关闭弹窗的行为都算，包括系统关闭 -->
	<Share v-if="isShowShare" :shareCfg="shareCfg" @close-share="close" @cancel-share="cancel" @succ-share="succ" @click-share="btnClick"></Share>
</template>
<script>
import './index'
export default {
	data () {
		return {
			isShowShare: true,
			shareCfg: {
				text: 'test sportybet',
				url: 'https://sportybet.com',
				quote: 'SportyBet',
				via: 'sportybet',
				hashtag: 'SportyBet',
				fb:{
					url: 'https://www.sportybet.com/ng/m',
					quote: 'sportybet',
					hashtag: 'SportyBet'
				},
				twitter: {
					hashtag: 'sportybet1',
					url: 'https://www.sportybet.com/ke/m',
					via: 'sportybet',
					text: 'hello sportybet'
				},
				whatsapp: {
					text: 'aaaaaa',
					href: 'www.163.com',
					shareContent: 'aaaaabbbbbccc'
				}
			}
		}
	},
	methods: {
		succ (type) {
			console.log('succ', type);
		},
		close () {
			this.isShowShare = false;
			console.log('close');
		},
		btnClick (type) {
			console.log('btn click', type);
		},
		cancel() {
			console.log('cancel');
		}
	}
}


</script>
