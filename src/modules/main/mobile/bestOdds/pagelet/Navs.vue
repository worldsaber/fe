<template>
	<AFSnapNav v-model="currentMarketId" class="m-sport-type"
			@change="handleChange">
		<AFSnapNavItem
			class="m-sport-type-item"
			v-for="(one, index) in currentMarkets"
			:key="index"
			:name="one.id+''">
			{{one.name}}
		</AFSnapNavItem>
	</AFSnapNav>
</template>

<script>
import AFSnapNav from 'components/sanpNav/snapNav.vue';
import AFSnapNavItem from 'components/sanpNav/snapNavItem.vue';
import MARKETITEMS from '../config/marketItems.js';

export default{
	name: 'Navs',
	props: {
		currentSportId: {
			type: String,
			'default': 'sr:sport:1'
		}
	},
	components: {
		AFSnapNav,
		AFSnapNavItem
	},
	data() {
		return {
			currentMarketId: ''
		};
	},
	computed: {
		currentMarkets () {
			return MARKETITEMS[this.currentSportId];
		}
	},
	methods: {
		handleChange() {
			this.$emit('change', this.currentMarketId);
		}
	},
	created() {
		// 默认先设置一个market
		this.currentMarketId = this.currentMarkets[0].id;
	}
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';

.m-sport-type{
	border-bottom: 1px solid @fogGray;
	padding: 0 10/@rem;
	.m-sport-type-item{
		font-size: 14/@rem;
		padding: 11/@rem 15/@rem;
		font-weight: normal;
		&.active{
			border-bottom: 4px solid @green;
		}
	}
}
</style>
