<template lang="html">
	<div :class="getWrapperClass" tabindex="6">
		<div class="m-input-prepend" v-if="prepend">
			<slot name="prepend"></slot>
		</div>
		<span class="m-input-com">
		<i
			v-if="icon"
			:class="['m-input-icon',{'m-input-icon--clickable': iconClickable, 'm-input-icon--show': showIcon}, 'm-icon-'+icon]"
			@click="handleIconClick"></i>
		<input
			ref="input"
			type="input"
			:name="name"
			class="m-input"
			:value="currentValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:readonly="readonly"
			:maxlength="maxlength"
			:min="minlength"
			:onpaste="getPasteHanle"
			@input="handlInput"
			@focus="handleFocus" />
		</span>
		<div class="m-input-append" v-if="append">
			<slot name="append"></slot>
		</div>
		<slot></slot>
	</div>
</template>

<script>
import InputMinxins from './mixins';
import DataMixins from './dataMixins';

export default {
	name: 'AfInput',
	mixins: [InputMinxins, DataMixins],
	props: {
		icon: String,
		iconClickable: {
			type: Boolean,
			'default': true
		},
		iconClick: Function
	},
	data() {
		return {
			prepend: true,
			append: true
		};
	},
	computed: {
		showIcon() {
			return this.icon && !!this.currentValue;
		}
	},
	methods: {
		// icon 点击事件
		handleIconClick(event) {
			const inputDom = this.$refs.input;
			inputDom && inputDom.focus();
			this.iconClick(event, this);
		}

	},
	mounted() {
		this.prepend = this.$slots.prepend !== undefined;
		this.append = this.$slots.append !== undefined;
		this.$el.addEventListener('blur', event => {
			this.handleBlur(event);
		}, true);
	},
	beforeDestory() {
		this.$el.removeEventListener('blur', event => {
			this.handleBlur(event);
		}, true);
	}
};
</script>

<style lang="less">
@import './index.less';
.m-input-wrapper {
	.m-input-text--icon {
		// width: 50px;

		&+.m-input {
			padding-right: 50px;
		}
	}
}
</style>
