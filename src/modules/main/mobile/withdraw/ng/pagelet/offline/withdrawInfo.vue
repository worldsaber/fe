<template>
  <ul class="withdraw-info-wrapper">
	  <li>
		  <span>Withdrawal Amount ({{currency}})</span>
		  <span>{{contentData.withdrawAmount}}</span>
	  </li>
	  <li>
		  <span>Commission to Partner</span>
		  <span>{{contentData.fee}}</span>
	  </li>
	  <li>
		  <span>Remaining Amount</span>
		  <span>{{contentData.remainingAmount}}</span>
	  </li>
	  <li>
		  <span>Partner Code</span>
		  <span>{{contentData.partnerCode}}</span>
	  </li>
	  <li>
		  <span :class="{'noInfo':!contentData.info}">Info</span>
		  <span>{{contentData.info}}</span>
	  </li>
  </ul>
</template>

<script>
export default {
	data () {
		return {
			currency: window.currency || 'NGN',
		};
	},
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
.withdraw-info-wrapper {
  color: #353a45;
  li {
    display: flex;
	justify-content: space-between;
	span:first-child {
		color: #9ca0ab;
	}
  }
  li:first-child {
	font-size: 14/@rem;
	span:first-child {
	  color: #353a45;
    }
    span:last-child {
      font-size: 18/@rem;
	  font-weight: bold;
    }
  }
  .noInfo {
	  color: #fff !important;
  }
}
.es-dialog.withdraw-info {
	width: 100% !important;
    top: 68% !important;
    bottom: 0 !important;
    margin: 0 !important;
    left: 0 !important;
  .es-dialog-footer {
    padding: 0 !important;
    text-align: left !important;
    height: 40/@rem !important;
	color: #fff !important;
	margin-top: 30/@rem;
    .es-dialog-btn:first-child {
      width: 25%;
      background-color: #096b27;
      color: #fff;
    }
    .es-dialog-btn:last-child {
      width: 75%;
      background-color: #0d9737;
      color: #fff;
    }
  }
}
</style>
