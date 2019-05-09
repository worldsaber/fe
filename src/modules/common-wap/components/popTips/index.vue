<template>
  	<div :class="['m-pop-tips', {
		'active': visible
	}]">
		<slot></slot>
	</div>
</template>

<script>
import { LS } from 'storage';

export default {
	name: 'PopTips',
	props: {
		duration: {
			'default': 2000,
			type: Number
		},
		// 用于存储状态的key
		tipsKey: {
			type: String,
			'default': ''
		}
	},
	data () {
		return {
			visible: false,
			maskElement: null
		};
	},
	methods: {
		show () {
			this.visible = true;
		},
		hide () {
			this.visible = false;
			this.timer = null;
			this.$nextTick(() => {
				if (this.maskElement) {
					this.maskElement.removeEventListener('click', this.hide);
					document.body.removeChild(this.maskElement);
					this.maskElement = null;
				}
			});
		},
		autoHide () {
			if (this.timer) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(() => {
				this.hide();
			}, this.duration);
		},
		addHandle () {
			this.show();
			this.autoHide();
			this.createMask();
		},
		createMask () {
			const maskElement = document.createElement('div');
			maskElement.className = 'm-pop-tips__mask';
			document.body.appendChild(maskElement);
			maskElement.addEventListener('click', this.hide);
			this.maskElement = maskElement;
		},
		init () {
			const hasStoraged = LS.get(this.tipsKey);

			if (!hasStoraged) {
				LS.set(this.tipsKey, 1);
				this.addHandle();
			}
		}
	},
	mounted () {
		this.init();
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';

.m-pop-tips {
	position: absolute;
	top: 26/@rem;
	right: 0;
	z-index: 1000;
	background: @blue;
	padding: 10/@rem;
	box-sizing: border-box;
	border-radius: 2px;
	line-height: 16/@rem;
	font-size: 14/@rem;
	font-weight: 500;
	color: @white;
	box-shadow: 0 1px 4px 0 fadeout(@black, 50%);

	&:before {
		content: '';
		display: block;
		width: 0;
		height: 0;
		border: 6/@rem solid transparent;
		border-bottom-color: @blue;
		position: absolute;
		top: -12/@rem;
		right: 20/@rem;
	}

	&:not(.active) {
		display: none;
	}
}

// 遮盖 body
.m-pop-tips__mask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 99999;
}
</style>

