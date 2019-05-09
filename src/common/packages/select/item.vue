<template>
  <span class="af-select-item">{{data.name || data}}</span>
</template>

<script>
	/**
	 * 一个item的数据格式
	 * 是一个string，比如 "optionA"
	 * name表示 要显示的字段， group表示该字段的分组,otherData是用户可以携带的其他数据
	 * 是一个Object 比如 {name: "test", group: 'test', otherData}
	 */
	export default {
		name: 'item',
		props: {
			data: {
				type: [Object, String],
				required: true,
				validator (val) {
					if (typeof val === 'object') {
						return !!val.name;
					}
					return true;
				}
			}
		}
	};
</script>

<style lang="less">
	.af-select-item{
		display: inline-block;
		width: 100%;
		text-align: center;
		&.active {
			background: #41b883
		}
		&.hover {
			background: #41b883;
		}
	}
</style>
