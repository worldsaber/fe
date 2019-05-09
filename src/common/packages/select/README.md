# 简单下拉列表组件

## 使用方法

``` html
	<AfSelect  
		placeholer="test"
		:disable:="false"
		:readonly="true" 
		:data='data'
		@input="input" 
		:closeOnSelect="true"
		:ListWidth="0"
		v-model="value"		
	/>	
```

## props说明
- placeholer 没有数据时候的占位
- disable  是否禁止使用
- reayonly 是否只读
- data 下拉列表的数据
	* data必须是数组，数组元素可以是 string或Object， 如果是string则string表示值，如果是Object，Object必须有name属性，用于显示 如 [{name: 'test'}]
- closeOnSelect 是否在选择后关闭下拉列表
- ListWidth 当前下拉列表的宽度，默认和选择框同宽
- value 当前的值，为双向绑定的值
- itemTemplate 每个列表的模版组件，可以是vue文件, 应该有属性data，用于传递当前item的数据, 可以仿照item.vue编写
- itemGroupTitle 分组title的模版组件，可以是vue文件
- noResultTemplate 没有数据的模版组件，可以是vue文件
- isGroup 是否是一个分组的下拉列表
## 特殊说明

``` javascript
var data = [{
	name: 'test',
	group: 'TEST'
}]
data中的每项数据可以跟 group，group可以用于分组,当选项分组后，将会以分组的形式显示

```

ItemList可以组件可以通过 $select获取 下拉列表的选择框部分

Item，即每个选项中可以通过 this.$parent.$select获取
