<template lang="html">
  <div class="" >
	<AfSelect
		:readonly="true"
		:data='data'
		:disable='false'
		:isGroup='false'
		placeholder="placeholder test"
		style="width: 140px;top: 30px;left: 10px;"
		@input="input"
		:closeOnSelect="true"
		:itemTemplate="itemTemplate"
		:noResultTemplate="noResultTemplate"
		v-model="value"/>

		 <!-- <div style="height:100px;">
			 <div style="1000px">
				<select>
					<option>aaa</option>
					<option>aaa</option>
					<option>aaa</option>
					<option>aaa</option>
					<option>aaa</option>
					<option>aaa</option>
					<option>aaa</option>
				</select>

			 </div>
		 </div> -->
  </div>
</template>

<script>
import './index';
// 注意这里不要用 template属性，尽量用.vue文件或者render方法
// 自定义itemTemplate测试
// 注意自定义的时候需要覆盖 af-select-item的样式
const itemTemplate = {
	name: 'item',
	props: ['data'],
	template: '<div>自定义item测试{{data.name || data}}</div>'
};
// 没有数据时候的自定义
// 注意这里不要用 template属性，尽量用.vue文件或者render方法
const noResultTemplate = {
	template: '<em>没有数据</em>'
};
export default {
	data() {
		return {
			value: '',
			data: ['test', { name: 'test1', aa: 1 }, 'cjx', 'aaa', 'bbb'],
			// data: [{ group: 'group1', name: 'cjx' }, { group: 'group1', name: 'abc' },{ group: 'group2', name: 'cjx2' }, { group: 'group2', name: 'abc2' }],
			error: false
		};
	},
	methods: {
		input (val) {
			console.log(val);
		}
	},
	computed: {
		itemTemplate () {
			return itemTemplate;
		},
		noResultTemplate () {
			return noResultTemplate;
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
