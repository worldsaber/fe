<template>
	<img :src="image.btnNext" alt="" class="btn-next" ref="next" @click="onClickNext">
</template>
<script>
import anime from 'animejs';
import { next } from '../images/config';
import { goNextRoute } from '../router/config';

export default {
	data() {
		return {
			image: next
		};
	},
	mounted() {
		anime({
			targets: this.$refs.next,
			opacity: [0, 1],
			translateX: [-100, 0],
			duration: 300,
			delay: 1000,
			easing: 'easeInSine'
		});
	},
	methods: {
		goNext() {
			goNextRoute.call(this);
		},
		leave() {
			anime({
				targets: this.$refs.next,
				opacity: [1, 0],
				translateX: [0, 100],
				duration: 300,
				delay: 500,
				easing: 'easeInSine'
			});
		},
		onClickNext() {
			this.leave();
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.btn-next{
	position: absolute;
	bottom: 20/@rem;
	right: 20/@rem;
	width: 132/@rem;
	z-index: 1000;
}
@media screen and (max-height: 480px){
	.btn-next{
		bottom: 10/@rem;
		right: 10/@rem;
		width: 108/@rem;
	}
}
.wrap-aspect-ratio{
	.btn-next{
		bottom: 10/@rem;
		right: 10/@rem;
		width: 108/@rem;
	}
}
</style>

