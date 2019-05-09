<template>
	<dl class="list list-category">
		<dt :class="{open: isOpen}" @click="showContent">{{data.categoryName}} - {{data.name}}</dt>
		<dd v-for="event in data.events" :key="event.eventId" v-show="isOpen">
			<Event :data="event"/>
		</dd>
	</dl>
</template>
<script>
import Event from './event';

export default {
	name: 'category',
	components: {
		Event
	},
	props: {
		data: {
			type: Object,
			'default': () => {},
		}
	},
	data() {
		return {
			isOpen: false,
		};
	},
	methods: {
		showContent() {
			this.isOpen = !this.isOpen;
		}
	}
};
</script>
<style lang="less">
@import '~base/styles/mixin.less';
@import '~base/styles/variable.less';
@import '~base/styles/icon.less';
.list-category{
	dt{
		.m-icon-arrow-down2();
		&:before{
			color: @green;
			display:inline-block;
			position: relative;
			left: -6/@rem;
			top:1px;
			transform:rotate(-90deg);
		}
		&.open:before{
			transform:rotate(0);
			top:2px;
		}
	}
	
}
</style>