<template>
	<div class="search">
	<AfInput
		placeholder="Enter Game ID (4 numeric digits)"
		v-model="gameId"
		icon="delete"
		:error="isError"
		:iconClick="clearGameId"
		@focus='clearErr'
		>
		<span slot="prepend" @click="hidden">Cancel</span>
		<span slot="append" :class="{'active': !isError && gameId.length > 0 }" @click="search"></span>
	</AfInput>
	<span v-if="isError" class="m-error-infos">{{errorInfo}}</span>
	</div>
</template>
<script>
import AfInput from 'packages/input/nunberInput.vue';

import { mapActions } from 'vuex';

export default {
	name: 'top',
	components: {
		AfInput,
	},
	props: {
		hidden: {
			type: Function,
			defualt: () => {},
		}
	},
	data() {
		return {
			gameId: '',
			errorInfo: 'Please enter 4 numeric digits.',
			isError: false,
		};
	},
	methods: {
		...mapActions('liveResult', ['getSearchList']),

		clearGameId() {
			this.gameId = '';
		},
		clearErr() {
			this.isError = false;
		},
		search() {
			this.isError = this.gameId.length !== 4;
			if (!this.isError) {
				this.getSearchList(this.gameId);
			}
		}
	},
};
</script>
<style lang="less">
@import '~base/styles/mixin.less';
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';

.search{
	height:30/@rem;
	position:relative;
	padding:5/@rem 0;
	background-color:@fogGray;
	.m-input-wrapper .m-input{
		border: 0;
		border-radius: 2px 0 0 2px;
		height: 30/@rem;
		font-size: 12/@rem;
	}
	.m-input-group{
		.m-input-append,.m-input-prepend{
			border:0;
			background:transparent;
		}
		.m-input-prepend{
			width: 50/@rem;
			color:@darkGray;
			text-align:center;
		}
		.m-input-append{	
			width: 50/@rem;
			padding: 0;
			text-align: center;
			cursor: pointer;
			span{
				color: @dark;
				display: block;
				height: 30/@rem;
				line-height: 30/@rem;
				.m-icon-search();
				&:before{
					font-size: 18/@rem;
				}
			}
		}
	}
	
	.m-error-infos{
		position:absolute;
		text-align:center;
		width: 100%;
		line-height:36/@rem;
		height: 36/@rem;
		font-family: 'Roboto';
		font-size: 10/@rem;
		color: @red;
		top:45/@rem;
		background-color:#fee9ed;
	}
}
</style>
