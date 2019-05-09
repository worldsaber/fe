<template lang="html">
  <div class="">
	<p>参数控制方式：</p>
  	<Tips :type="type" :msg="msg"/>

	<p>slot方式：</p>
	<Tips>
		<p>test first</p>
		<p>test second</p>
	</Tips>
  </div>
</template>

<script>
import Tips from './index.vue';

export default {
	components: {
		Tips
	},
	data() {
		return {
			type: 'error',
			msg: 'test error'
		};
	}
};
</script>
