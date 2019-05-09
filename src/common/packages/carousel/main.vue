<template>
	<div id="carousel">
	    <carousel  :indicators = "carouselOps.indicators" :interval = "carouselOps.interval" :controls = "carouselOps.controls" v-if="list.length > 0">
	        <carousel-item v-for="(i, index) in list" :key="index">
	                <a v-if = "i.link && i.link.length && i.img && i.img.length> 0 " :href="i.link">
	                    <img :src="i.img" alt="">
	                </a>
	                <img v-else-if = "i.img && i.img.length" :src="i.img" alt="">
	        </carousel-item>
	    </carousel>
	    <slot></slot>
	</div>
</template>

<script>
import items from './items.vue';
import carousel from './carousel.vue';

export default {
	name: 'AfCarousel',
	components: {
		'carousel-item': items,
		carousel
	},
	data () {
		return {
			list: []
		};
	},
	watch: {
		itemsList (val) {
			this.list = [];
			this.$nextTick(() => {
				this.list = this.itemsList;
			});
		}
	},
	created () {
		this.list = this.itemsList;
	},
	props: {
		itemsList: {
			type: Array,
			'default': function () {
				return [];
			}
		},
		carouselOps: {
			type: Object,
			'default': function () {
				return {
					indicators: true,
					interval: 5000,
					controls: false
				};
			}
		}
	}
};
</script>

<style lang = "less">
.carousel{
	height: 300px;
}
</style>
