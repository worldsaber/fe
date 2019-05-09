<template lang="html">
  <div class="m-betslip-search">
  	<p class="m-text-main">To place a bet, click on the odds. Or insert a booking code</p>
	<div class="m-opt-wrapper">
		<AfInput
	  	  v-model="code"
	  	  placeholder="Booking Code"
		  icon="delete"
		  :error="hasError"
	  	  @click="handleClick"
	  	  :iconClick="clearAllInput">
	    </AfInput>
		<af-Button
			type='primary'
			:disabled="submitStatus"
			@click="load">{{loading ? 'Loading' : 'Load'}}</af-Button>
	</div>
	<Tips
		v-if="hasError"
		type="error"
		:msg="errorMsg"
	/>
	<p class="m-text-tips">A booking code enables one to transfer a betslip between different devices.</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import 'packages/input';
import 'packages/button';

import Tips from 'components/tips/index';

export default {
	name: 'BetslipsSearch',

	components: {
		Tips
	},

	data() {
		return {
			code: '',
			loading: false,
			hasError: false,
			errorMsg: null
		};
	},
	computed: {
		submitStatus() {
			return !this.code;
		}
	},
	methods: {
		...mapActions('betslip', [
			'loadBetslip',
			'subscription'
		]),
		handleClick() {
			if (this.hasError) {
				this.hasError = false;
				this.code = '';
			}
		},
		clearAllInput() {
			this.code = '';
			this.errorMsg = null;
			this.hasError = false;
		},
		load() {
			this.loading = true;
			this.errorMsg = null;
			this.hasError = false;
			this.loadBetslip({
				betCode: this.code
			})
			.then(ret => {
				if (!ret.loadBetError) {
					this.loading = false;

					// code load 成功，订阅消息
					this.subscription();
				}
			}, err => {
				if (err.loadBetError) {
					this.hasError = true;
					this.loading = false;
					this.errorMsg = err.msg || 'The code was not loaded successfully. Please try again.';
				}
			});
		}
	}
};
</script>
