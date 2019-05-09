<template lang="html">
	<div :class="getWrapperClass">
		<div class="m-input-wap-prepend" v-if="prepend">
			<slot name="prepend"></slot>
		</div>
		<i
			v-if="icon"
			:class="['m-input-wap-icon',{'m-input-wap-icon--clickable': iconClickable, 'm-input-wap-icon--show': showIcon}, 'm-icon-'+icon]"
			@click="handleIconClick"></i>
		<i
			v-if="showIcon && textIconValue"
			class="m-input-wap-text--icon"
			@click="toggleShowVal">{{hideTextIcon}}</i>
		<i
			v-if="showIcon && !textIconValue"
			class="m-input-wap-text--icon"
			@click="toggleShowVal">{{showTextIcon}}</i>
		<input v-if="textIconValue"
			ref="input"
			type="input"
			:name="name"
			class="m-input-wap"
			:value="currentValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:readonly="readonly"
			:maxlength="maxlength"
			:min="minlength"
			@input="handlInput"
			@focus="handleFocus" />
		<input v-else
			ref="input"
			type="password"
			:name="name"
			class="m-input-wap"
			:value="currentValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:readonly="readonly"
			:maxlength="maxlength"
			:min="minlength"
			@input="handlInput"
			@focus="handleFocus" />
		<div class="m-input-wap-append" v-if="append">
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
	created() {
		this.textIconValue = this.initTextIconValue;
	},
	data() {
		return {
			textIconValue: false,
			//showType: this.type
		};
	},
	computed: {
		showText() {
			if (this.icon) {
				return false;
			}
			return this.toggleShowText;
		},
		showIcon() {
			if (this.icon) {
				return !!this.currentValue;
			}
			return this.showText && !!this.currentValue;
		}
	},
	methods: {
		// input 输入框内容是否可见
		toggleShowVal() {
			this.textIconValue = !this.textIconValue;

			// this.showType = this.showType === 'input' ? 'password' : 'input';
		}

	}
};
</script>
