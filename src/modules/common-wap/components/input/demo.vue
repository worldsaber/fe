<template lang="html">
  <div class="">
	<AfInput
		v-model="value"
		placeholder="请输入..."
		icon="delete"
		style="border: 1px solid lightblue;border-radius: 5px; margin: 10px; width: 300px;"
		@change="validatorPhone"
		:maxlength="10"
		:iconClick="clearAllInput">
		<span slot="prepend">http://</span>
		<span slot="append">.com</span>
	</AfInput>
	<AfInput
		v-model="value"
		size="large"
		placeholder="large size"
		:disabled="true"
		style="border: 1px solid lightblue;border-radius: 5px;width: 300px;">
	</AfInput>
	<AfInput
		v-model="value"
		type="password"
		placeholder="default size"
		style="border: 1px solid lightblue;border-radius: 5px;margin: 10px;"
		:toggleShowText="true"
		:maxlength="14"
		:minlength="6"
		:error="error"
		@change="validatorPsd">
	</AfInput>
	<AfInput
		v-model="value"
		size="small"
		placeholder="small size"
		style="border: 1px solid lightblue;border-radius: 5px;width: 300px; margin: 10px;"
		:readonly="true">
	</AfInput>
	<AfTextarea
		v-model="value"
		:autosize="{minRows: 2,maxRows: 5}"
		placeholder="请输入..."
		style="border: 1px solid lightblue;border-radius: 5px; margin: 20px; width: 300px;">
	</AfTextarea>
  </div>
</template>

<script>
import './index';
import './textarea';

export default {
	data() {
		return {
			value: '',
			error: false
		};
	},
	methods: {
		validatorPhone(opt) {
			// const val = opt.value;
			// this.value = val.replace(/\D/g, '');
		},
		validatorPsd(opt) {
			// const val = opt.value;
			// const isFinish = opt.finish; // 用于区分是实时校验，还是blur时校验

			let psdRegExp = /^[a-zA-Z0-9_]+$/;
			(psdRegExp = /^[a-zA-Z0-9_]{6,14}$/);

			const testRet = psdRegExp.test(this.value);

			if (!testRet) {
				this.error = true;
			} else {
				this.error = false;
			}
		},
		clearAllInput() {
			this.value = '';
		}
	}
};
</script>
