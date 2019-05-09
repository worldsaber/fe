<template>
	<div class="new-badge" v-if="isShow">NEW</div>
</template>
<script>
import { LS } from 'storage/index';
import version from 'constant/version';
// 判断是否展示
const key = 'local_new_badge';

export default {
	data() {
		const badge = LS.get(key);
		// 可以考虑加入版本的控制，仅在1.13版本；下个版本删除
		return {
			isShow: version === '1.13.0' && !badge
		};
	},
	methods: {
		setMark() {
			LS.set(key, 1);
			this.isShow = false;
		}
	}
};
</script>
<style lang="less">
.new-badge{
	position: absolute;
	top: 0;
	right: 0;
	height: 10px;
	width: 24px;
	padding: 2px;
	font-size: 10px;
	text-align: center;
	line-height: 10px;
	color: #FFF;
	background-color: #e41827;
	border-radius: 20px;
}
</style>

