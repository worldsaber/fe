<template lang="html">
  <div class="go-top" :class="css" @click="handleClick">
	  <span class="go-top__icon"></span>
	  <span v-if="text" class="go-top__text">{{text}}</span>
  </div>
</template>

<script>
export default {
	name: 'goTop',

	componentName: 'goTop',

	props: {
		css: {
			type: [String, Array],
			'default': ''
		},
		text: {
			type: String,
			'default': ''
		}
	},
	methods: {
		handleClick() {
			window.scrollTo(0, 0);
		},
	}
};
</script>

<style lang="less">
@baseColor: #2dbff7;

.go-top{
	position: fixed;
	right: 2%;
	bottom: 3%;

	border-radius: 2px;
	border: 1px solid @baseColor;

	text-align: center;

	padding: 10px;
	box-sizing: border-box;

	.go-top__text, .go-top__icon:before{
		display: block;
		color: @baseColor;
	}

	.go-top__icon:before{
		content: '\2191';
		font-size: 16px;
	}

	.go-top__text{
		font-size: 15px;
		line-height: 1;
		padding-top: 1%;
		box-sizing: border-box;
	}
}
</style>
