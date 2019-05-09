<template>
  <header class="head">
	  <h2>Results</h2>
	  <div class="search">
		  <AfInput
			placeholder="Enter Game ID"
			v-model="gameId"
			icon="delete"
			:error="isError"
			:iconClick="clearGameId"
			>
		<span slot="append" :class="{'active': !isError && gameId.length > 0 }" @click="search">Search</span>
		</AfInput>
		<span v-if="isError" class="m-error-infos">{{errorInfo}}</span>
	  </div>
  </header>
</template>
<script>
import AfInput from 'packages/input/input.vue';

import { mapActions, mapMutations } from 'vuex';
import * as mutationTypes from 'store/liveResult/mutationTypes';

export default {
	name: 'top',
	components: {
		AfInput,
	},
	computed: {
		isError() {
			return this.gameId.length !== 4 && this.gameId.length !== 0;
		}
	},
	data() {
		return {
			gameId: '',
			errorInfo: 'Please enter 4 numeric digits.',
		};
	},
	methods: {
		...mapMutations('liveResult', {
			setSelected: mutationTypes.UPDATE_SELECTED,
			clearOption: mutationTypes.UPDATE_OPTIONLIST
		}),
		...mapActions('liveResult', ['getResultList']),

		clearGameId() {
			this.gameId = '';
		},
		search() {
			if (!this.isError && this.gameId.length !== 0) {
				this.setSelected({
					date: null,
					sport: {},
					category: {},
					tournament: {},
				});
				this.clearOption([]);
				this.getResultList(this.gameId);
			}
		}
	},
};
</script>
<style lang="less">
@import '~base/style/mixin.less';
@import '~base/style/variable.less';

.head{
	height: 82px;
	border-bottom: 2px solid @lightGray;
	.clearfix;
	h2{
		float: left;
		height: 28px;
		line-height: 28px;
		font-size: 24px;
		margin-top: 25px;
		font-family: 'Roboto';
	}
	.search{
		float: right;
		width: 250px;
		margin-top: 24px;
		.m-input{
			border: 1px solid @darkGray;
			border-right: 0;
			border-radius: 2px 0 0 2px;
			height: 32px;
		}
		.m-input-append{
			border: 0;
			
			border-radius: 0  2px 2px 0;
			
			width: 68px;
			padding: 0;
			text-align: center;
			cursor: pointer;
			span{
				background-color: @midGray;
				color: @darkGray;
				display: block;
				width: 100%;
				height: 32px;
				line-height: 32px;
				&.active{
					background-color: @green;
					color: @white;
				}
			}
		}

	}
	.m-error-infos{
		width: 136px;
		height: 14px;
		font-family: 'Roboto';
		font-size: 12px;
		color: @red;
	}
}
</style>
