<template>
	<Layout>
		<MainSection slot="main-pagelet" rightWidth="235px">
			<top slot="top"></top>
			<div slot="mid">
				<important-match></important-match>
				<live-match></live-match>
				<BootomAd />
			</div>
			<div slot="right">
				<RightPagelet :showRegister="false" :showGrandPrize="hasGrand"/>
			</div>
		</MainSection>
	</Layout>
</template>

<script>
import { LS } from 'storage';
import md5 from 'blueimp-md5';
import Layout from 'components/layout/layout';
import MainSection from 'components/layout/main';
import RightPagelet from 'components/layout/right.vue';
import PopActivity from 'components/popDialog/popActivity';
import { mapActions, mapGetters, mapState } from 'vuex';
import top from './top.vue';
import importantMatch from './importantMatch.vue';
import liveMatch from './liveMatch.vue';
import BootomAd from './bottom.vue';

export default {

	name: 'home',
	components: {
		Layout,
		MainSection,
		RightPagelet,
		top,
		importantMatch,
		liveMatch,
		BootomAd
	},
	data() {
		return {};
	},
	computed: {
		...mapState('home', [
			'promotionAd'
		]),
		...mapGetters('home', [
			'hasGrand'
		]),
		hasActivity() {
			const config = this.promotionAd || {},
				alertBanner = config.alertBanner || {};

			if (alertBanner.imgUrl) {
				alertBanner.actId = URL.getPara(alertBanner.linkUrl, 'activityId');
				return true;
			}

			return false;
		}
	},
	watch: {
		hasActivity(val) {
			if (val) {
				const alertBanner = this.promotionAd.alertBanner || {},
					actId = alertBanner.actId,
					linkUrl = alertBanner.linkUrl,
					key = `${linkUrl}|${alertBanner.imgUrl || ''}`,
					oldKey = `pc_activity_${actId}`,
					oldLocKey = LS.get(oldKey);

				let isPop = LS.get(`pc_activity_${md5(key)}`) || oldLocKey;

				isPop = isPop && +isPop || 0;

				if (!isPop) {
					this.$dialog();
					this.$dialog({
						title: null,
						'class': 'm-act-pop',
						contentData: alertBanner,
						content: PopActivity,
						button: []
					});
				}

				if (+oldLocKey) {
					LS.remove(oldKey);
				}
			}
		}
	},
	methods: {
		...mapActions('home', [
			// 'fetchHomePC',
			'subProductStatus',
			'unSubProductStatus',
			'getPromotionAd'
		]),
	},

	created() {
		// this.fetchHomePC();
		this.getPromotionAd();
		this.subProductStatus();
	},
	destroyed () {
		this.unSubProductStatus();
	}
};
</script>

<style lang="less">
@import './home.less';
</style>
