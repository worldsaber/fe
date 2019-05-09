<template>
  <button :disabled="disabled" class='af-button'
	 @click="handleClick" 
	:class="[
		extraType ? 'af-button--' + extraType : '',
		{
			'is-disabled' : disabled,
			'is-loading' : loading,
			'is-plain' : plain
		}
	]"
  >
	<i class='af-icon-loading' v-if='loading'></i>
	<i :class="`af-icon-${icon}`" v-if='icon && !loading'></i>
	<span v-if='$slots.default'><slot></slot></span>
  </button>
</template>

<script>
export default {
	name: 'afButton',
	props: {
		disabled: {
			type: Boolean,
			'default': false
		},
		loading: {
			type: Boolean,
			'default': false
		},
		plain: {
			type: Boolean,
			'default': false
		},
		autofocus: {
			type: Boolean,
			'default': false
		},
		extraType: {
			type: String,
			'default': 'primary'
		},
		icon: {
			type: String,
			'default': ''
		}
	},
	methods: {
		handleClick(e) {
			this.$emit('click', e);
		}
	}
};

</script>

<style lang='less'>
@import './button.less';
</style>
