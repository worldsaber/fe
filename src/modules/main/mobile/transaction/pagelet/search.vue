<template>
  <div>
		<Detail v-if="isShowDetail" :detailObj="detailObj" @backToListEvent="backToList" :isHistory="isHistory"></Detail>
		<searchPanel @changeDetailObj="changeDetailObj"/>
  </div>
</template>
<script>
import getMobile from '../../deposit/ke/js/fetchMobile';
import Detail from './detail';
import searchPanel from './searchPanel';

export default {
	components: {
		Detail,
		searchPanel
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
	}
};
</script>
