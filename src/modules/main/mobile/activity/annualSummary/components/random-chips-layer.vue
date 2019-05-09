<template>
	<div class="random-chips-layer">
		<Chip v-for="index in num" :key="index" :wh="width" :ht="height" :delay="delay"/>
	</div>
</template>
<script>
import Chip from './chip.vue';

export default {
	props: {
		// 碎片的数量
		num: {
			type: Number,
			'default': 30
		},
		delay: {
			type: Number,
			'default': 0
		}
	},
	components: {
		Chip,
	},
	data() {
		const el = document.documentElement;
		return {
			width: el.clientWidth,
			height: el.clientHeight,
		};
	}
};
</script>
<style lang="less">
.random-chips-layer{
	position: absolute;
	// z-index: 10000;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}
</style>

