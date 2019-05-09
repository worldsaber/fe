<template lang="html">
  <SlideAnimation :pageCount='5' width="320px" height="300px" :activeIndex="currentIndex">
	  <template v-for="(item,index) in 5">
		<SlideItem :pageIndex="index">
			<p>{{item}}</p>
			<div class="m-operation">
				<button type="button" name="prev" @click="goPrev(index)">prev</button>
				<button type="button" name="next" @click="goNext(index)">next</button>
			</div>
		</SlideItem>
	  </template>
  </SlideAnimation>
</template>

<script>
import SlideAnimation from 'components/slideAnimation/slideContainer.vue';
import SlideItem from 'components/slideAnimation/slideItem.vue';

export default {
	components: {
		SlideAnimation,
		SlideItem
	},
	data() {
		return {
			currentIndex: 0
		};
	},
	methods: {
		goPrev(index) {
			// to do something
			this.currentIndex -= 1;
		},
		goNext(index) {
			// to do something
			this.currentIndex += 1;
		}
	}
};
</script>

<style lang="less">
</style>
