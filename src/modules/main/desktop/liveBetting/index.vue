<template>
	<Layout>

		<MainSection slot="main-pagelet" rightWidth="235px">
			<div slot="top">
				<span>{{title}}</span>
			</div>
			<div slot="mid">
				<!-- <div class="print-logo"> Netease Logo</div> -->
				<router-view></router-view>
				<!-- <div class="print-footer"> Footer </div> -->
			</div>
			<div slot="right">
				<RightPagelet
					:showRegister="true"
					reigsterTheme="dark"
				/>
			</div>
		</MainSection>
	</Layout>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Layout from 'components/layout/layout';
import MainSection from 'components/layout/main';
import RightPagelet from 'components/layout/right.vue';

export default {
	components: {
		Layout,
		MainSection,
		RightPagelet
	},
	data() {
		const meta = this.$route.meta || {};
		return {
			title: meta.name || 'Single View'
		};
	},
	computed: {
		...mapState('eventDetail', [
			'eventCount'
		])
	},
	methods: {
		...mapActions('eventDetail', [
			'getEventCount',
			'resetEventData'
		]),
		updateEventCount() {
			const val = this.eventCount,
				navigatorDom = document.querySelector('#header'),
				eventviewNode = navigatorDom && navigatorDom.querySelector('[data-key="single view"]');

			eventviewNode && val && (eventviewNode.innerHTML = `Single View(${val || ''})`);
		},
	},
	watch: {
		$route(to, from) {
			const meta = this.$route.meta || {};

			this.title = meta.name || 'Single View';

			if (meta.module !== 'eventDetail') {
				this.resetEventData();
			}
		}
	},
	created() {
		this.getEventCount({ option: 1, productId: 1 }).then(() => {
			this.updateEventCount();
		});
	}
};
</script>

<style lang="less">
@import "./style/commonLayout.less";
</style>
