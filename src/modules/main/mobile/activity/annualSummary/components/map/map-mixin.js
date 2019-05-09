import anime from 'animejs';

export default {
	props: {
		isAnimate: {
			type: Boolean,
			'default': true,
		},
		delay: {
			type: Number,
			'default': 1
		}
	},
	mounted() {
		if (!this.isAnimate) {
			return;
		}
		const delay = 3600 + (this.delay * 300);
		anime({
			targets: this.$refs.mark,
			delay,
			duration: 400,
			translateY: [-200, 0],
			opacity: [0, 1],
			// easing: 'easeInSine'
		});
	}
};
