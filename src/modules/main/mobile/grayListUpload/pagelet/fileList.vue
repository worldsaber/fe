<template>
	<ul class="m-file-list">
		<li class="file-item" v-for="(file, i) in files">
			<img class="file-thumbnails" :src="file.thumbnails">
			<p class="file-name">{{file.name}}</p>
			<i class="m-icon-close" @click="remove(i)"/>
		</li>
	</ul>
</template>

<script>
export default {
	props: {
		files: {
			type: Array,
			'default': () => []
		}
	},
	data() {
		return {

		};
	}
};
</script>

<style lang="less" scoped>
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-file-list {
	list-style: none;
	padding-left: 25/@rem;
	.file-item {
		margin-top: 6/@rem;
		padding: 8/@rem 12/@rem;
		background: @fogGray;
		display: flex;
		align-items: center;
		justify-content: center;
		.file-thumbnails {
			flex: 0 0 auto;
			width: 32/@rem;
			height: 32/@rem;
			margin-right: 16/@rem;
		}
		.file-name {
			margin-right: 16/@rem;
			flex: 1 1 auto;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.m-icon-close {
			flex: 0 0 auto;
			.m-icon-close();
			&::before {
				font-size: 12/@rem;
			}
		}
	}
}
</style>
