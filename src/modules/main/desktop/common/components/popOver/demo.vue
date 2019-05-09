<template lang="html">
	<div class="">
		<div style="padding: 10px; border: 1px solid red; font-size: 20px; width: 150px;margin-left: 200px;">
			<PopOver position="right" triggerType="click">
				sfddsfdsf
			</PopOver>
			<p>slot方式</p>
		</div>
		<div style="padding: 10px; border: 1px solid red; font-size: 20px; width: 120px;margin-left: 200px;">
			<PopOver title="test title" content="test message" position="top" :showArrow="false" triggerType="click"></PopOver>
			<p>props方式：title和content</p>
		</div>
		<div v-popOver pop-title="test directive" style="padding: 10px; border: 1px solid red; font-size: 20px; width: 120px;margin-left: 200px;">1234567</div>
	</div>

</template>

<script>
import Vue from 'vue';
import PopOver from './index';

Vue.use(PopOver);
export default {
	data() {
		return {
			content: 'none slot'
		};
	}
};
</script>
