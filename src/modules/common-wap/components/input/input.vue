<template lang="html">
	<div :class="getWrapperClass">
		<div class="m-input-wap-prepend" v-if="prepend">
			<slot name="prepend"></slot>
		</div>
		<i
			v-if="icon"
			:class="['m-input-wap-icon',{'m-input-wap-icon--clickable': iconClickable, 'm-input-wap-icon--show': showIcon}, 'm-icon-'+icon]"
			@click="handleIconClick"></i>
		<div :class="getTransfromWrapSryle" v-if="transformMode">
			<div class="m-input-transform-text" v-if="transformFocus">{{transformText}}</div>
			<slot name="transform-prepend"></slot>
			<input
				ref="transform-input"
				:type="isOpera ? 'input' : type"
				:name="name"
				:class="getInputClass"
				:value="currentValue"
				:placeholder="getPlaceHolder"
				:disabled="disabled"
				:readonly="readonly"
				:maxlength="maxlength"
				:min="minlength"
				:autocomplete="autocomplete"
				@input="handlInput"
				@focus="handleFocus" />
		</div>
		<input
			ref="input"
			v-else
			:type="isOpera ? 'input' : type"
			:name="name"
			class="m-input-wap"
			:value="currentValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:readonly="readonly"
			:maxlength="maxlength"
			:min="minlength"
			:autocomplete="autocomplete"
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

export default {
	name: 'AfInput',
	mixins: [InputMinxins, DataMixins],
	props: {
		icon: String,
		iconClickable: {
			type: Boolean,
			'default': true
		},
		type: {
			type: String,
			'default': 'input'
		},
		transformText: {
			type: String,
			'default': ''
		},
		iconClick: Function,
		autocomplete: {
			type: String,
			validator(val) {
				return !!~['off', 'on'].indexOf(val);
			}
		}
	},
	data() {
		const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		return {
			prepend: true,
			append: true,
			isOpera,
			transformMode: false
		};
	},
	created() {
		this.transformMode = this.transformText !== '';
	},
	computed: {
		showIcon() {
			return this.icon && !!this.currentValue;
		},
		transformFocus() {
			return this.active || this.currentValue !== '';
		},
		getInputClass() {
			const classList = ['m-input-wap'];
			this.transformFocus && classList.push('on');

			return classList;
		},
		getTransfromWrapSryle() {
			const classList = ['m-input-transform'];
			this.transformFocus && classList.push('on');

			return classList;
		},
		getPlaceHolder() {
			return this.transformFocus ? this.placeholder : this.transformText;
		}
	},
	methods: {
		// icon 点击事件
		handleIconClick(event) {
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
</style>
