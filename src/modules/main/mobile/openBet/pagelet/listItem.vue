<template lang="html">
  <div>
	  <ul class="m-against">
  		<li
  			v-for="selItem in betInfo.showSelection"
  			:key="selItem.key"
  		>
  			<span class="m-t-16 m-t-l20 m-t-bold m-t-black">{{selItem.home}}</span>
  			<span class="m-t-16 m-t-l20 m-t-gray m-vs">vs</span>
  			<span class="m-t-16 m-t-l20 m-t-bold m-t-black">{{selItem.away}}</span>
  		</li>
  	</ul>
  	<div class="m-more f-flex m-t-12 m-t-l14">
  		<div class="m-l-left">
  			<span class="m-t-gray">{{betInfo.showMores || ''}}</span>
  		</div>
  		<div class="m-l-right">
  			<span class="m-t-dark" @click.stop="seeDetail">Show match details<i class="m-icon-more"></i></span>
  		</div>
  	</div>
  </div>
</template>

<script>
export default {
	props: {
		betInfo: {
			type: Object,
			required: true
		}
	},
	methods: {
		seeDetail() {
			this.$emit('chgDetailBetId', this.betInfo.id);
		},
	}
};
</script>
