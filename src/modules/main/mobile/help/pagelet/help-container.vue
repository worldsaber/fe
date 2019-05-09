<template>
<div class="m-help-container">
	<template v-if="menus && menus.length">
		<help-list :menus="menus"></help-list>
	</template>

	<template v-else>
		<help-details></help-details>
	</template>

	<div class="m-help-tips" v-if="$router.currentRoute.path === '/about/terms-and-conditions'" v-html="tips"></div>
</div>
</template>

<script>
import { conditionsTips, helpMap } from '../js/bridge.js';
import HelpList from './help-list';
import HelpDetails from './help-details';

function getMenus (obj) {
	return Object.entries(obj).map(([k, v]) => ({
		name: v.name,
		label: v.label,
		path: v.path
	}));
}

export default {
	name: 'HelpContainer',
	components: {
		HelpList,
		HelpDetails
	},
	data () {
		return {
			menus: [],
			tips: ''
		};
	},
	methods: {
		switchMenus () {
			const { path, meta } = this.$router.currentRoute;
			const [parentRoute, childRoute] = path.substr(1).split('/');
			const parent = helpMap[parentRoute];
			const child = parent && parent.children && parent.children[childRoute];

			if (!parentRoute) {
				this.menus = getMenus(helpMap);
				return;
			}

			if (meta.status === 1) {
				if (parent.children) {
					this.menus = getMenus(parent.children);
				} else {
					this.menus = [];
				}
			} else if (meta.status === 2) {
				if (path === '/about/terms-and-conditions') {
					this.tips = conditionsTips;
				}

				if (child.children) {
					this.menus = getMenus(child.children);
					return;
				}

				this.menus = null;
			} else {
				this.menus = null;
			}
		}
	},
	created () {
		this.switchMenus();
	},
	watch: {
		$route: 'switchMenus'
	}
};
</script>


<style lang="less">
@import 'base/styles/icon.less';
@import 'base/styles/variable.less';

.m-icon-arrow2 {
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -8/@rem;
  color: @midGray;
  .m-icon-arrow--down();

  &:before {
    font-size: 12/@rem;
    line-height: 16/@rem;
    display: block;
    transform: rotate(-90deg);
    transform-origin: center;
    transition: all 0.3s;
  }
}

.m-help-container {
	padding: 0 18/@rem;

	.m-help-tips {
		font-size: 12/@rem;
		line-height: 1.33;
		color: #9ca0ab;
		margin: -14/@rem 0 49/@rem;
	}
}

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
		word-break: break-word;
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
