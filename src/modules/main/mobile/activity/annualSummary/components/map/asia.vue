<template>
	<div class="map-light-wrap">
		<img :src="url" alt="" class="map-light-item"/>
		<img :src="markUrl" alt="" class="mark-asia" ref="mark">
	</div>
</template>
<script>
import { map } from '../../images/config';
import mapMixin from './map-mixin.js';

export default {
	mixins: [mapMixin],

	data() {
		return {
			url: map.mapasia,
			markUrl: map.mark,
		};
	},
};
</script>
<style lang="less">
.map-light-wrap{
	.map-light-item{
		width: 100%;
	}
	.mark-asia{
		position: absolute;
		width: 31px;
		top: 0;
		left: 0;
		margin: 23% 0 0 61%;
		transform-origin: center bottom;

	}
}
</style>

