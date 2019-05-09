<template lang="html">
	<div :class="getWrapperClass" tabindex="8">
		<div class="m-input-prepend" v-if="prepend">
			<slot name="prepend"></slot>
		</div>
		<span class="m-input-com">
			<i
				v-if="icon"
				:class="['m-input-icon',{'m-input-icon--clickable': iconClickable, 'm-input-icon--show': showIcon}, 'm-icon-'+icon]"
				@click="handleIconClick"></i>
			<i
				v-if="showText && textIconValue"
				class="m-input-text--icon"
				@click="toggleShowVal">{{showTextIcon}}</i>
			<i
				v-if="showText && !textIconValue"
				class="m-input-text--icon"
				@click="toggleShowVal">{{hideTextIcon}}</i>
			<input v-if="isInput"
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
			<input v-else
				ref="input"
				type="password"
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
import ElementInput from './input.vue';

export default {
	name: 'AfPassword',
	mixins: [InputMinxins, DataMixins],
	'extends': ElementInput,
	props: {
		showTextIcon: {
			type: String,
			'default': 'Show'
		},
		hideTextIcon: {
			type: String,
			'default': 'Hide'
		},
		toggleShowText: {
			type: Boolean,
			'default': false
		},
		initTextIconValue: {
			type: Boolean,
			'default': false
		}
	},
	data() {
		return {
			textIconValue: this.initTextIconValue,
			showType: this.initTextIconValue ? 'password' : 'input'
		};
	},
	computed: {
		isInput() {
			return this.showType === 'input';
		},
		showText() {
			return this.toggleShowText && !!this.currentValue;
		},
		showIcon() {
			return this.icon && !!this.currentValue;
		}
	},
	methods: {
		// input 输入框内容是否可见
		toggleShowVal() {
			this.textIconValue = !this.textIconValue;
			this.showType = this.showType === 'input' ? 'password' : 'input';
		}

	},
	watch: {
		initTextIconValue(val) {
			this.textIconValue = this.initTextIconValue;
			this.showType = this.initTextIconValue ? 'password' : 'input';
		}
	},
	mounted() {
		this.$el.addEventListener('blur', event => {
			this.$emit('blur', event);
		}, true);
	},
	beforeDestory() {
		this.$el.removeEventListener('blur', event => {
			this.$emit('blur', event);
		}, true);
	}
};
</script>
<style>
	.m-input-wap-text--icon{
		margin-right: 16px !important
	}
</style>
