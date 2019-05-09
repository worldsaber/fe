<template>
  <nav class="nav-options">
	  <!-- 时间组件 -->
	  <SelectDate />
	  <!-- sport等选项筛选组件 -->
	  <SelectList />
  </nav>
</template>
<script>
import SelectList from './selectList.vue';
import SelectDate from './selectDate.vue';

export default {
	name: 'resultOptions',
	components: {
		SelectDate,
		SelectList
	},
};
</script>
<style lang="less">
@import '~base/styles/mixin.less';
@import '~base/styles/variable.less';

.nav-options{
	position: fixed;
	top: 40/@rem;
	z-index: 50;
	width: 100%;
	font-size: 0;
	padding:7/@rem 0 15/@rem;
	background: @white;
	box-sizing: border-box;
}
</style>
