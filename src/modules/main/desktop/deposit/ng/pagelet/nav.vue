<template lang="html">
	<ul class="m-dp-nav">
		<li
			v-for="(item, index) in depositType"
			:key="item"
			:class="[
				'f-item',
				{
					'f-item--active': item.toLowerCase() === currentDpType
				}
			]"
			@click="changeType(index)"
		>{{item}}</li>
	</ul>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import * as mutationTypes from 'store/deposit/ng/mutationTypes';
import { depositType } from '../js/config';

export default {
	data() {
		return {
			depositType
		};
	},
	computed: {
		...mapState('deposit', {
			currentDpType: 'depositType'
		})
	},
	methods: {
		...mapMutations('deposit', {
			updateDpType: mutationTypes.UPDATEDEPOSITTYPE
		}),
		changeType(index) {
			this.updateDpType(this.depositType[index].toLowerCase());
		}
	}
};
</script>

<style lang="less">
@import '../style/nav.less';
</style>
