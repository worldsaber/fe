<template>
  <nav class="nav-options">
	  <div class="optionEvent">
		  <selectEvent name="date" :value="indexDate"/>
	  </div>
	   <div class="optionEvent">
		  <selectEvent name="sport" :value="selected.sport" :dataList="optionListByOrder"/>
	  </div>
	   <div class="optionEvent">
		  <selectEvent name="category" :value="selected.category" :dataList="categoriesList"/>
	  </div>
	   <div class="optionEvent">
		  <selectEvent name="tournament" :value="selected.tournament" :dataList="tournamentList"/>
	  </div>
  </nav>
</template>
<script>
import { mapState, mapGetters, } from 'vuex';
import dateFormat from 'kernel/js/dateFormat';
import { sportConfigOrder } from 'config/sportsType';
import selectEvent from './selectEvent.vue';

export default {
	name: 'resultOptions',
	components: {
		selectEvent,
	},
	computed: {
		...mapState('liveResult', ['selected', 'optionList']),
		...mapGetters('liveResult', ['categoriesList', 'tournamentList']),
		indexDate() {
			return this.selected.date ? dateFormat.format(this.selected.date, 'DD/MM/YYYY') : '';
		},
		optionListByOrder() {
			return this.optionList.sort((la, lb) => sportConfigOrder[la.id] - sportConfigOrder[lb.id]);
		}
	},
};
</script>
<style lang="less">
@import '~base/style/mixin.less';
@import '~base/style/variable.less';

.nav-options{
	width: 100%;
	font-size: 0;
	padding:7px 0 19px;
	border-bottom: 2px solid @lightGray;
	.optionEvent{
		display: inline-block;
		width: 230px;
		margin-right: 7px;
		font-size: 14px;
		height: 36px;
		&:last-of-type{
			margin-right: -5px;
		}	
	}
}
</style>
