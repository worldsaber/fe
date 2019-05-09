<template lang="html">
	<AFSnapNav class="m-tab" v-model="dpType">
		<AFSnapNavItem class="m-tab-item" v-for="item in depositType" :name="item.key" :key="item.key">
			<span>{{item.name}}</span>
		</AFSnapNavItem>
	</AFSnapNav>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import * as mutationTypes from 'store/deposit/gh/mutationTypes';

import 'components/sanpNav';

import { depositType } from '../js/config';

export default {
	data() {
		return {
			depositType,
			dpType: 0
		};
	},
	computed: {
		...mapState('deposit', {
			currentDpType: 'depositType'
		})
	},
	watch: {
		dpType(val) {
			if (val !== this.currentDpType) {
				this.updateDpType(val);
			}
		}
	},
	methods: {
		...mapMutations('deposit', {
			updateDpType: mutationTypes.UPDATEDEPOSITTYPE
		})
	},
	created() {
		this.dpType = this.currentDpType;
	}
};
</script>

<style lang="less">
@import '../style/nav.less';
</style>
