<template>
	<form class="m-az-search-wrap" @submit.prevent="submit">
		<afInput v-model="key" class="m-az-search" icon="delete" :iconClick="iconClick" placeholder="Search" :maxlength="27"><i class="icon-search" slot="prepend"/></afInput>	
	</form>
</template>

<script>
import { pagePath } from 'config/pageConfig';

export default {
	data() {
		return {
			key: ''
		};
	},
	methods: {
		iconClick() {
			this.key = '';
		},
		submit() {
			location.href = window.URL.addPara(pagePath.search, {
				soruce: 'azmenu',
				key: this.key
			});
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-az-search-wrap {
	padding: 12/@rem 15/@rem 0;
	.m-az-search {
		background-color: #B6131F;
		border: none;
		border-radius: 2/@rem;
		.icon-search {
			.m-icon-search();
			&::before {
				color: @white;
			}
		}
		&.m-input-wap-group	{
			.m-input-wap-prepend {
				background-color: #B6131F;
			}
		}
		&.m-input-wap-wrapper {
			.m-input-wap {
			  	background-color: #B6131F;
				color: @white;
				font-size: 12/@rem;
		   }
		   .m-input-wap-icon {
			   color: @white;
			   &::before {
				   font-size: 12/@rem;
			   }
		   }
		}
	}
}
</style>
