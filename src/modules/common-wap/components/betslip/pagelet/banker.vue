<template>
  <div :class="['m-outcome-dan', {
		active
	}]" @click="updateBankers(id)">B</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import { UPDATE_BANKERS } from 'store/betslip/mutationTypes';

	export default {
		name: 'Banker',
		props: {
			id: {
				required: true,
				type: String
			}
		},
		computed: {
			active () {
				return !!this.bankerMap[this.id];
			},
			...mapState('betslip', ['bankerMap'])
		},
		methods: {
			...mapMutations('betslip', [UPDATE_BANKERS])
		}
	};
</script>
<style scoped lang='less'>
@import '~base/styles/variable.less';
.m-outcome-dan{
	width: 28/@rem;
	height: 28/@rem;
	line-height: 28/@rem;
	border-radius: 28/@rem;
	text-align: center;
	line-height: 28/@rem;
	color: @green;
	border: 1px solid @green;
	&.active{
		background-color: @midGreen;
	}
}
</style>
