<template lang="html">
	<div class="m-wd-gh">
		<Success v-if="wdSuccess"/>

		<template v-else>
			<navbar><i slot="right" class="m-icon-help" @click.stop="withdrawHelp"></i></navbar>

			<MainPanel />

			<ShopBanner keyword="buyGiftWithdrawPage" />
		</template>
	</div>

</template>

<script>
import {
	mapState
} from 'vuex';
import navbar from 'components/navbar';
import {
	pagePath
} from 'config/pageConfig.js';

import MainPanel from './pagelet/index.vue';

import Success from './pagelet/success.vue';
import ShopBanner from '../../shop/pagelet/adBanner.vue';

export default {
	components: {
		MainPanel,
		navbar,
		Success,
		ShopBanner
	},
	computed: {
		...mapState('withdraw', [
			'wdSuccess'
		]),
	},
	watch: {
		wdSuccess(val) {
			if (val) {
				this.$dialog();
			}
		}
	},
	mounted() {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');
	},
	methods: {
		withdrawHelp() {
			location.href = pagePath.help + '#/how-to-play/others/how-to-withdraw';
		}
	}
};
</script>


<style lang="less">
@import './style/layout.less';

.m-withdrawBlockTip-dialog {
	&.es-dialog {
		.es-dialog-footer {
			.es-dialog-btn {
				width: auto;
				min-width: 30%;
			}
		}
	}
}
</style>
