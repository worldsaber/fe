<template>
	<Layout :isHaveLoading="false" :isHasFooter="false" :isHaveBottomNav="false">
		<div class="home" slot="mid">
			<nav-bar></nav-bar>
			<router-view></router-view>
		</div>
	</Layout>
</template>

<script>
import Layout from 'components/layout/main.vue';
import NavBar from 'components/navbar';
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes.js';

export default {
	name: 'Help',
	components: {
		Layout,
		NavBar
	},
	methods: {
		...mapMutations('layout', {
			stopLoading: CHANGE_LOADING
		})
	},
	created () {
		this.stopLoading(false);
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';

// 公共文案样式
.help-content-wrap {
	img {
		max-width: 100%;
		vertical-align: middle;
	}

	& > h3 {
		font-size: 16/@rem;
		font-weight: bold;
		color: @dark;
		margin-bottom: 12/@rem;
	}

	& > h4 {
		font-size: 14/@rem;
		font-weight: 600;
	}

	p {
		margin-bottom: 12/@rem;
		line-height: 1.83;
	}

	ol, ul {
		padding-left: 15/@rem;
		margin-bottom: 14/@rem;
	}

	ol {
		li {
			list-style: decimal;
			line-height: 1.83;
		}
	}

	ul {
		li {
			list-style: initial;
		}
	}

	table {
		margin: 14/@rem 0;

		td, th {
			border: 1px solid @darkGray;
			padding: 6/@rem 12/@rem;
			text-align: center;
		}
	}
}

</style>
