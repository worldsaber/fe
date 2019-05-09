<template>
	<ul class="m-list-group">
		<template v-for="(item, index) in list">
			<li class="m-list-group-item" :class="{
				[item.cls]: item.cls
			}" :key="index">
				<!-- router: router-link -->
				<template v-if="item.router">
					<router-link :to="item.router">
						<span class="m-label">{{item.label}}</span>
						<span class="m-value" v-if="item.value">{{item.value}}</span>
						<i class="m-icon-arrow"></i>
					</router-link>
				</template>

				<!-- click event -->
				<template v-else-if="item.click">
					<div @click="item.click">
						<span class="m-label">{{item.label}}</span>
						<span class="m-value" v-if="item.value">{{item.value}}</span>
						<i class="m-icon-arrow"></i>
					</div>
				</template>

				<!-- link: a href -->
				<template v-else>
					<a :href="item.link">
						<span class="m-label">{{item.label}}</span>
						<span class="m-value" v-if="item.value">{{item.value}}</span>
						<i class="m-icon-arrow"></i>
					</a>
				</template>
			</li>
		</template>
	</ul>
</template>

<script>
export default {
	name: 'ListGroup',
	props: {
		list: {
			type: [Array, Object],
			required: true
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/icon.less';
@import 'base/styles/variable.less';

.m-list-group-item {
	font-size: 16/@rem;
	color: @dark;
	border-bottom: 1px solid @fogGray;
	position: relative;

	a {
		display: block;
		width: 100%;
		padding: 16/@rem 22/@rem 16/@rem 0;
		line-height: 20/@rem;
		color: @dark;
		text-decoration: none;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		box-sizing: border-box;
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.m-icon-arrow {
		position: absolute;
		right: 0;
		top: 50%;
		margin-top: -8/@rem;
		color: @midGray;
		.m-icon-arrow--right();

		&:before {
			font-size: 12/@rem;
			line-height: 16/@rem;
			vertical-align: top;
		}
	}
}
</style>
