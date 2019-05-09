<template lang="html">
	<div :class="getWrapperClass">
		<textarea
			ref="input"
			:name="name"
			class="m-input"
			:style="textareaStyles"
			:value="currentValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:readonly="readonly"
			:maxLength="maxlength"
			@input="handlInput"
			@blur="handleBlur"
			@focus="handleFocus" >
		</textarea>
	</div>
</template>

<script>
import InputMinxins from './mixins';
import DataMixins from './dataMixins';
import calcTextareaHeight from './calcTextareaHeight';

export default {
	name: 'AfTextarea',

	mixins: [InputMinxins, DataMixins],

	props: {
		rows: {
			type: Number
		},
		autosize: {
			type: [Boolean, Object],
			'default': false,
			validator(val) {
				if (typeof val === 'object') {
					return !Object.keys(val).some(item => !~['minRows', 'maxRows'].indexOf(item));
				}
			}
		}
	},
	data() {
		return {
			textareaCalStyles: null
		};
	},
	methods: {
		resizeTextArea() {
			const autosize = this.autosize;

			if (!autosize) {
				return;
			}

			const { minRows, maxRows } = autosize;
			this.textareaCalStyles = calcTextareaHeight(this.$refs.input, minRows, maxRows);
		}
	},
	computed: {
		textareaStyles() {
			return Object.assign({}, this.textareaCalStyles);
		}
	},
	watch: {
		value(val) {
			this.$nextTick(() => {
				this.resizeTextArea();
			});
		}
	},
	mounted() {
		this.resizeTextArea();
	}

};
</script>

<style lang="less">
@import './index.less';
</style>
