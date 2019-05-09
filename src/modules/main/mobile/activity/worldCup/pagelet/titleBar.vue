<template lang="html">
	<div class="m-addtion-bar">{{getRoundInfo}}</div>
</template>

<script>
import {
    mapGetters
} from 'vuex';

export default {
	computed: {
		...mapGetters('worldCup', [
			'getRoundInfo'
		]),
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';

.m-cup {
	.m-addtion-bar {
		position: absolute;
		right: 13/@rem;
		top: 10/@rem;
		z-index: 22;
		line-height: 1;
		font-family: AvenirNext;
		font-size: 10/@rem;
		font-weight: 500;
		text-align: right;
		color: #deca87;
	}
}
</style>
