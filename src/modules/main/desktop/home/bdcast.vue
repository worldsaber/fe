<template lang="html">
	<div class="bdcast-wrapper" v-if="hasBdcast">
  	  <div>
  		  <i class="m-icon-bd"></i>
  		  <Broadcast :list="bdcastList" />
  		  <div class="m-bd-mask"></div>
  	  </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import 'components/broadcast';

export default {
	computed: {
		...mapGetters('home', [
			'bdcastList',
			'hasBdcast'
		])
	}
};
</script>
