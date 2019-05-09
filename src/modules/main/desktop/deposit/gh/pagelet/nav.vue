<template lang="html">
	<ul class="m-dp-nav">
		<li
			v-for="item in depositType"
			:key="item.key"
			:class="[
				'f-item',
				{
					'f-item--active': item.key === currentDpType
				}
			]"
			@click="changeType(item.key)"
		>{{item.name}}</li>
	</ul>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import * as mutationTypes from 'store/deposit/gh/mutationTypes';
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
		changeType(val) {
			this.updateDpType(val);
		}
	}
};
</script>

<style lang="less">
@import '../style/nav.less';
</style>
