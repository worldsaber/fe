<template>
	<ListGroup class="m-menu-list" :list="list"></ListGroup>
</template>

<script>
import ListGroup from 'components/ListGroup';

export default {
	name: 'help-list',
	props: {
		menus: {
			type: Array,
			required: true
		}
	},
	components: {
		ListGroup
	},
	computed: {
		list() {
			const result = [...this.menus].map(item => {
				item.router = { name: item.name };
				return item;
			});

			if (this.$router.currentRoute.path === '/') {
				result.push({
					label: 'Contact Us',
					router: '/contact-us'
				});
			}

			return result;
		}
	}
};
</script>

<style lang="less" scoped>
@import 'base/styles/variable.less';

.m-menu-list {
	margin-bottom: 70/@rem;
}
</style>
