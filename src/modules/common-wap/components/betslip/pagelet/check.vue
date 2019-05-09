<template>
	<span class="m-checkbox"><span v-if="$slots.before" @click="handleAgentClick"><slot name="before"></slot></span><input type="checkbox" :id="id" ref='input' :checked="checked" @click='handleClick'><label :for="id"></label><span @click="handleAgentClick">{{text}}<slot name="after"></slot></span></span>
</template>

<script>
	const getId = (() => {
		let id = 1;
		return () => id++;
	})();
	export default {
		props: {
			checked: {
				type: Boolean,
				required: true,
				'default': false
			},
			text: {
				type: String,
				'default': ''
			}
		},
		created () {

		},
		data () {
			return {
				id: 'checked_' + getId()
			};
		},
		methods: {
			handleAgentClick () {
				const status = !this.checked;
				this.$emit('input', status);
				this.$refs.input.checked = status;
			},
			handleClick () {
				this.$emit('input', !this.checked);
			}
		}
	};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';
	.m-checkbox{
		display: inline-block;
		line-height: 1;
		vertical-align: middle;
		white-space: nowrap;
		input{
			color: @dark;
			display: none!important;
			& + label {
				background-color: @midGray;
				display: inline-block;
				position: relative;
				-webkit-transition: all 0.1s ease-in;
				transition: all 0.1s ease-in;
				width: 30/@rem;
				height: 19/@rem;
				border: 1px solid @green;
				padding: 1px;
				border-radius: 2/@rem;
				vertical-align: middle;
				margin-right: 5/@rem;
			}
			& + label:before {
				content: ' ';
				position: relative;
				display: block;
				background:@white;
				top: 0px;
				left: 0px;
				z-index: 1;
				-webkit-transition: all 0.1s ease-in;
				transition: all 0.1s ease-in;
				height: 100%;
				width: 16/@rem;
				border-radius: 1px;
				border: 1px solid @green;
				box-sizing: border-box;
			}
			&:checked + label{
				background-color: @midGreen;
			}
			&:checked + label:before {
				left: 100%;
				margin-left: -16/@rem;
			}
		}
	}
</style>

