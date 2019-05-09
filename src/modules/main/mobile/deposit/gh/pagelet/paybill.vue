<template lang="html">
  <div class="m-dp-gh-bill">
  	<ul class="m-flex">
		<li
			v-for="(item, index) in showBankList"
			@click.stop="chgIndex(index)"
			:key="item.title"
			:class="[
				'm-f-item',
				{
					'm-f-item--active': activeIndex === index
				}
			]"
		>
			<h5 class="m-i-title f-flex">
				<div class="m-image-wrapper">
					<img :src="item.channelIconUrl" v-if="item.channelIconUrl">
					<img src="../img/default-card.png" v-else>
				</div>
				<span class="m-t f-flex-item">{{item.title}}</span>
				<i class="m-icon-more"></i>
			</h5>
			<ul class="m-i-main f-count" v-show="activeIndex === index">
				<li class="m-i-item f-flex f-count-item" v-for="rItem in item.desc"><span class="f-flex-item">{{rItem}}</span></li>
			</ul>
		</li>
  	</ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { billRulers } from '../js/config';

export default {
	data() {
		return {
			rules: billRulers,
			activeIndex: -1
		};
	},
	computed: {
		...mapState('deposit', [
			'bankList'
		]),
		showBankList() {
			const bankList = this.bankList || [],
				rules = this.rules || [];

			if (!bankList.length) {
				return rules;
			}

			const temp = {};

			for (const item of bankList) {
				temp[item.channelShowName] = item;
			}

			const ret = [];
			for (const rItem of rules) {
				if (temp[rItem.title]) {
					ret.push({
						...rItem,
						...temp[rItem.title]
					});
				}
			}

			return ret;
		}
	},
	methods: {
		chgIndex(index) {
			if (index === this.activeIndex) {
				this.activeIndex = -1;
			} else {
				this.activeIndex = index;
			}
		}
	},
	created() {

	}
};
</script>

<style lang="less">
@import '../style/payBill.less';
</style>
