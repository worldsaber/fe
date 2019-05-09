<template>
<div class="lp-container lp-container-3">
	<ActivityReg :class="[planId==3?'lp-reg':'']" :succUrl="succUrl" :topImg="topImg" @regSuccess="succ">
		<div slot="topContent" class="content" v-if="planId==3">
			<div v-html="content.header"></div>
		</div>
		<div slot="bottomContent" class="content" v-if="planId==3">
			<div v-html="content.footer"></div>
		</div>
	</ActivityReg>	
</div>
	
</template>
<script>
import { URL } from 'utils';
import 'components/activityReg';
import content from '../js/planId3.js';

export default {
	props: ['succUrl', 'topImg'],
	data () {
		return {
			planId: 1,
			content,
		};
	},
	mounted () {
		const loading = document.querySelector('#pageLoading');
		loading && (loading.style.display = 'none');

		this.planId = URL.getPara('planId') || 1;
	},
	methods: {
		succ () {
			this.$emit('regSuccess');
		}
	}
};
</script>
<style lang="less">
@import "~base/styles/variable.less";
.lp-container-3{
	.content{
		padding: 0;
	}
	.title{
		padding: 0 26/@rem;
	}
}
.lp-container-3 .content {
//   padding: 0;
  font-family: Roboto;
  font-size: 12/@rem;
  line-height: 1.83;
  text-align: left;
  color: #353a45;
  h1 {
    margin-top: 11/@rem;
    font-size: 18/@rem;
    font-weight: bold;
    text-align: left;
    line-height: normal;
  }
  p {
	padding: 0 26/@rem;
    margin-top: 18/@rem;
    font-size: 12/@rem;
    line-height: 1.83;
    text-align: justify;
  }
  .text-gray{
	  font-size: 10/@rem;
	  line-height: 1.3;
	  color: #9b9b9b;
	  margin-bottom: 50/@rem;
  }
  .footer-img{
	width: 100%;
	margin-top: 20/@rem;
  }
  
}
.lp-reg {
  .btn-wrapper,
  .af-button {
    height: 39.5/@rem !important;
  }
  .m-pagelet-index {
    padding: 8/@rem 33/@rem;
    padding-bottom: 15/@rem;
  }
  .m-page-opt {
    padding: 22/@rem 26/@rem !important;
    border-radius: 2/@rem;
    background-color: #f9f9f9;
    border: solid 1/@rem #9b9b9b;
  }
  .btm {
    padding-bottom: 54/@rem;
  }
}
.lp-container .m-pagelet-index .m-page-opt {
  .m-input-wrapper .m-input {
    padding-right: 0 !important;
    font-size: 12/@rem !important;
  }
  .m-input-append > div,
  .m-input-append .send-again {
    width: 100/@rem !important;
    height: 26/@rem;
    line-height: 26/@rem;
  }
  .m-input-append {
    padding-right: 8px !important;
  }
}
</style>
