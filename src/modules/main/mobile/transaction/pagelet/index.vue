<template>
  <div>
		<TransList  @changeDetailEvent="changeDetailObj" @toggleSearch="toggleSearch"></TransList>
		<Detail v-if="isShowDetail" :detailObj="detailObj" @backToListEvent="backToList" :isHistory="isHistory"></Detail>
  </div>
</template>
<script>
import getMobile from '../../deposit/ke/js/fetchMobile';
import TransList from './list';
import Detail from './detail';

export default {
	components: {
		TransList,
		Detail
	},
	data () {
		return {
			detailObj: {},
			mobile: '',
			isShowDetail: false,
			isHistory: false
		};
	},
	created () {
		getMobile().then(data => {
			if (typeof data === 'object') {
				this.mobile = data.mobile;
			}
		});
	},
	methods: {
		changeDetailObj (obj, isHistory) {
			if (typeof obj === 'object') {
				this.detailObj = obj;
				this.isHistory = isHistory;
				this.detailObj.mobile = this.mobile;
				this.isShowDetail = true;
			}
		},
		backToList () {
			this.isShowDetail = false;
		},
		toggleSearch() {
			this.$router.push({
				name: 'search'
			});
		}
	}
};
</script>
