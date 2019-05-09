<template>
	<div class="m-daily-menu">
		<div class="m-menu-row">
			<div class="m-menu-title">Daily</div>
		</div>
		<div class="m-menu-row" v-for="(item,index) in weekText" :key="index">
			<MenuItem :linkUrl="getSportsByWeek(item[0])">
				{{item[0]}}
				{{showTodayOrTomorrow(index,1)}}
				{{tomorrow}}
			</MenuItem>
			<MenuItem :linkUrl="getSportsByWeek(item[1])" v-if="item[1]">
				{{item[1]}}
				{{showTodayOrTomorrow(index,2)}}
			</MenuItem>
		</div>
	</div>
</template>

<script>
import { sportPageById } from 'config/pageConfig';
import MenuItem from './MenuItem.vue';

export default {
	name: 'DailyMenu',
	components: {
		MenuItem
	},
	props: {
		currentSportId: String
	},
	data() {
		return {
			weekText: [
				['Monday', 'Tuesday'],
				['Wednesday', 'Thursday'],
				['Friday', 'Saturday'],
				['Sunday', '']
			],
			tomorrow: ''
		};
	},
	methods: {
		getSportsByWeek (week) {
			const days = [
				'Monday', 'Tuesday', 'Wednesday',
				'Thursday', 'Friday', 'Saturday', 'Sunday'
			];
			const id = days.indexOf(week);
			if (id !== -1) {
				let time = id + 1;
				if (time === 7) {
					time = 0;
				}
				return URL.addPara(sportPageById[this.currentSportId], {
					time,
					source: 'sport_menu'
				});
			}
		},
		// 判断星期X是否为今天
		showTodayOrTomorrow (id, col) {
			const index = ((2 * id) + col) % 7; // 计算 getDay
			const day = new Date().getDay();

			if (index === day) {
				return '(Today)';
			} else if (index === (day + 1) % 7) {
				return '(Tomorrow)';
			}
			return '';
		},
	}
};
</script>

<style lang="less">
@import "base/styles/variable.less";
@import "base/styles/icon.less";
@import "base/styles/mixin.less";

.m-daily-menu {
  margin-top: 20/@rem;

  .m-menu-row{
  	display: flex;
  	justify-content: space-between;
  	box-sizing: border-box;
  	padding: 4/@rem 10/@rem 0;

  	.m-menu-title {
  	  font-size: 18/@rem;
  	  color: @dark;
  	  font-weight: bold;
  	  margin-bottom: 9/@rem;
  	}
  }
}

</style>
