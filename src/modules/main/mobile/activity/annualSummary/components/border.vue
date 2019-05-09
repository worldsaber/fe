<template>
	<div class="border-wrap" :style="wrapStl">
		<span class="colon-top-left colon" :style="fontStl">“</span>
		<span class="colon-bottom-right colon" :style="fontStl">”</span>
		<span class="border-top" :style="[heightStl]"></span>
		<span class="border-right" :style="widthStl"></span>
		<span class="border-bottom" :style="heightStl"></span>
		<span class="border-left" :style="[widthStl]"></span>
	</div>
</template>
<script>
export default {
	props: {
		color: {
			type: String,
			'default': '#FFF',
		},
		width: {
			type: Number,
			'default': 3,
		},
		left: {
			type: Number,
			'default': -6
		},
		top: {
			type: Number,
			'default': -6
		}
	},
	computed: {
		heightStl() {
			return {
				height: `${this.width}px`,
				backgroundColor: this.color,
			};
		},
		widthStl() {
			return {
				width: `${this.width}px`,
				backgroundColor: this.color,
			};
		},
		fontStl() {
			return {
				color: this.color,
			};
		},
		wrapStl() {
			return {
				top: `${this.top}px`,
				left: `${this.left}px`
			};
		}
	}
};
</script>
<style lang="less">
.border-wrap{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
	.colon{
		height: 40px;
		font: 80px/1 Helvetica, Verdana, Menlo, "Gill Sans", arial, simsun;
	}
	.colon-top-left{
		position: absolute;
		top: 0;
		left: 0;
		transform: translateX(-100%);
		margin-top: -12px;
		margin-left: 12px;
	}
	.colon-bottom-right{
		position: absolute;
		right: 5px;
		bottom: 0;
		transform: translateY(50%);
	}
	.border-top{
		position: absolute;
		right: 0;
		top: 0;
		width: 90%;
	}
	.border-right{
		position: absolute;
		height: 90%;
		top: 0;
		right: 0;
	}
	.border-bottom{
		position: absolute;
		width: 85%;
		left: 0;
		bottom: 0;
	}
	.border-left{
		position: absolute;
		height: 70%;
		left: 0;
		bottom: 0;
	}
}
</style>
