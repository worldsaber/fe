<template lang="html">
  <div class="m-mask" @click="closePop" :class="getMaskClass" v-show="showPop">
	  <slot name="popContent"></slot>
  </div>
</template>

<script>
import { EventBus } from 'kernel/js/eventBus';
import popDialogEvent from 'config/eventConfig/popDialogEvent';

let uid = 0;
export default {
	name: 'PopMask',
	componentName: 'PopMask',

	props: {
		cssClass: {
			type: [String, Array],
			'default': ''
		},
		show: {
			type: Boolean,
			'default': true
		},
		canBubble: {
			type: Boolean,
			'default': true
		}
	},
	data() {
		return {
			uid: ++uid,
			showPop: this.show
		};
	},
	watch: {
		show(val) {
			this.showPop = val;
		}
	},
	computed: {
		getMaskClass() {
			const cssClass = this.cssClass;

			if (Array.isArray(cssClass)) {
				return cssClass;
			}

			if (cssClass) {
				return [cssClass];
			}

			return '';
		}
	},
	methods: {
		closePop(event) {
			if (this.canBubble || event.currentTarget === event.target) {
				this.showPop = false;
				EventBus.$emit(popDialogEvent.CLOSE_POPMASK, this);
			}
		},
		showPopDialog() {
			this.showPop = true;
		}
	}
};
</script>

<style lang="less">
.m-mask{
	position: absolute;

	@supports (position: fixed){
		position: fixed
	}

	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,.6);
	z-index: 999;

	padding: 10px;
	box-sizing: border-box;

	>*{
		position: relative;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
}
</style>
